import TWEEN from "@tweenjs/tween.js";
export const FAKE_PAGES = 4;
export const degToRad = (deg) => (deg * Math.PI) / 180;
export const setupAnimation = (
  pages,
  direction,

  changeTexures
) => {
  let targetY;
  console.log("direction", direction);
  // 最底下那一页是不用转的 可以优化一下
  if (direction === 1) {
    targetY = {
      rotationY0: degToRad(-180),
      rotationY1: pages.current.children[0].rotation.y,
      rotationY2: pages.current.children[1].rotation.y,
      rotationY3: pages.current.children[2].rotation.y,
    };
  } else {
    targetY = {
      rotationY0: pages.current.children[1].rotation.y,
      rotationY1: pages.current.children[2].rotation.y,
      rotationY2: pages.current.children[3].rotation.y,
      rotationY3: degToRad(360),
    };
  }
  const startY = {
    rotationY0: pages.current.children[0].rotation.y,
    rotationY1: pages.current.children[1].rotation.y,
    rotationY2: pages.current.children[2].rotation.y,
    rotationY3: pages.current.children[3].rotation.y,
  };
  return new TWEEN.Tween(startY)
    .to(targetY, 1500)
    .easing(TWEEN.Easing.Quintic.Out)
    .onComplete(() => {
      if (direction === 1) {
        pages.current.children[0].rotation.y = degToRad(180);
      } else {
        pages.current.children[3].rotation.y = degToRad(0);
      }
      passPages(pages, direction);
      changeTexures(pages);
    })
    .onUpdate(({ rotationY0, rotationY1, rotationY2, rotationY3 }) => {
      pages.current.children[0].rotation.y = rotationY0;
      pages.current.children[1].rotation.y = rotationY1;
      pages.current.children[2].rotation.y = rotationY2;
      pages.current.children[3].rotation.y = rotationY3;
    })
    .start();
};
// 循环传递页面下标
const passPages = (pages, direction) => {
  const children = pages.current.children;
  if (direction === 1) {
    [children[0], children[1], children[2], children[3]] = [
      children[1],
      children[2],
      children[3],
      children[0],
    ];
  } else {
    [children[0], children[1], children[2], children[3]] = [
      children[3],
      children[0],
      children[1],
      children[2],
    ];
  }
};
