import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { pageAtom, pages, countAtom, directionAtom } from "./UI";
import Page from "./Page";
import { setupAnimation } from "./utils";
pages.forEach((page) => {
  useTexture.preload(`/lyrics_book/textures/${page.front}.jpg`);
  useTexture.preload(`/lyrics_book/textures/${page.back}.jpg`);
  useTexture.preload(`/lyrics_book/textures/book-cover-roughness.jpg`);
});
const ANGLE_DEFAULT = 15;
const rotationInit = [0, ANGLE_DEFAULT, 180 - ANGLE_DEFAULT, 180];
export const Book = ({ ...props }) => {
  const [page] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);
  const [count, setCount] = useAtom(countAtom);
  const [direction] = useAtom(directionAtom);
  const pagesRef = useRef();
  useEffect(() => {
    const currentPage = count % 4;
    const oppositePage = (count + 2) % 4;
    console.log("count", currentPage, oppositePage);
    const tweena = setupAnimation(pagesRef, direction, changeTexture);
    function animate() {
      requestAnimationFrame(animate);
      tweena.update();
    }
    animate();
  }, [count]);
  const changeTexture = (pages) => {
    console.log("changetexture", pages);
  };
  // useEffect(() => {
  //   let timeout;
  //   const goToPage = () => {
  //     console.log("goToPage", page, delayedPage);
  //     //page是目标页 delayedPage是当前页
  //     setDelayedPage((delayedPage) => {
  //       //如果目标页和当前页一致则不翻页
  //       if (page === delayedPage) {
  //         return delayedPage;
  //       } else {
  //         timeout = setTimeout(() => {
  //           goToPage();
  //         }, 150);
  //         if (page <= 0 || page >= 4) return delayedPage;
  //         if (page > delayedPage) {
  //           console.log("右边翻页", page, delayedPage);
  //           const tweena = setupAnimation(pagesRef, 1, changeTexture);
  //           function animate() {
  //             requestAnimationFrame(animate);
  //             tweena.update();
  //           }
  //           animate();
  //           setCount(count + 1);
  //           return delayedPage + 1;
  //         }
  //         if (page < delayedPage) {
  //           console.log("左边翻页", page, delayedPage);
  //           setCount(count - 1);
  //           return delayedPage - 1;
  //         }
  //       }
  //     });
  //   };
  //   goToPage();
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [page]);

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
