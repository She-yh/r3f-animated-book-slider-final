import usePreviewStore from "./PreviewStore.tsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { pages } from "./UI";
import Page from "./Page";
import TWEEN from "@tweenjs/tween.js";
import { degToRad, passPages } from "./utils.jsx";

pages.forEach((page) => {
  useTexture.preload(`/lyrics_book/textures/${page.front}.jpg`);
  useTexture.preload(`/lyrics_book/textures/${page.back}.jpg`);
  useTexture.preload(`/lyrics_book/textures/book-cover-roughness.jpg`);
});
const ANGLE_DEFAULT = 0.5;
const rotationInit = [0, ANGLE_DEFAULT, 180 - ANGLE_DEFAULT, 180];
export const Book = ({ ...props }) => {
  const { page, count, direction, setIsRotating } = usePreviewStore();
  const [delayedPage] = useState(page);
  const pagesRef = useRef();
  const setupAnimation = (pages, direction, changeTexures) => {
    let targetY;
    let selectedPage;
    // 最底下那一页是不用转的
    console.log(
      pages.current.children[3].rotation.y,
      pages.current.children[2].rotation.y,
      pages.current.children[1].rotation.y,
      pages.current.children[0].rotation.y
    );
    if (direction === 1) {
      // page[2]往左翻
      pages.current.children[3].rotation.y =
        pages.current.children[2].rotation.y;
      // selectedBones = bones[2];
      selectedPage = pages.current.children[2];
      targetY = pages.current.children[1].rotation.y;
      pages.current.children[1].rotation.y =
        pages.current.children[0].rotation.y;
      pages.current.children[0].rotation.y = degToRad(180);
    } else {
      // page[1]往右翻
      pages.current.children[0].rotation.y =
        pages.current.children[1].rotation.y;
      // selectedBones = bones[1];
      selectedPage = pages.current.children[1];
      targetY = pages.current.children[2].rotation.y;
      pages.current.children[2].rotation.y =
        pages.current.children[3].rotation.y;
      pages.current.children[3].rotation.y = degToRad(0);
    }
    const bones = selectedPage.children[0].skeleton.bones;
    console.log(selectedPage, targetY, bones);
    new TWEEN.Tween(selectedPage.rotation)
      .to({ y: targetY }, 1500)
      .easing(TWEEN.Easing.Quintic.Out)
      .onComplete(() => {
        passPages(pages, direction);
        changeTexures(pages);
        console.log("onComplete");
        setIsRotating(false);
      })
      .onUpdate(({ y }) => {
        selectedPage.rotation.y = y;
        console.log("onUpdate", y);
      })
      .start();
    for (let i = 1; i < bones.length; i++) {
      new TWEEN.Tween(bones[i].rotation)
        .to({ y: direction * degToRad(5) }, 700 - i * 10)
        .easing(TWEEN.Easing.Quintic.Out)
        .repeat(1)
        .yoyo(true)
        .start();
    }
  };
  useEffect(() => {
    console.log("direction", direction);
    if (direction === 0) return;
    setupAnimation(pagesRef, direction, changeTexture);
    console.log("animate", TWEEN.getAll());
    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }
    animate();
  }, [direction, count]);
  const changeTexture = (pages) => {
    console.log("changetexture", pages);
  };

  return (
    <group {...props} rotation-y={-Math.PI / 2} ref={pagesRef}>
      {[...pages].map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          rotationInit={rotationInit[index]}
          {...pageData}
        />
      ))}
    </group>
  );
};
