import TWEEN from "@tweenjs/tween.js";
export const FAKE_PAGES = 4;
export const degToRad = (deg) => (deg * Math.PI) / 180;
// 循环传递页面下标
export const passPages = (pages, direction) => {
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
