import { useAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { pageAtom, pages } from "./UI";
import Page from "./Page";
pages.forEach((page) => {
  useTexture.preload(`/textures/${page.front}.jpg`);
  useTexture.preload(`/textures/${page.back}.jpg`);
  useTexture.preload(`/textures/book-cover-roughness.jpg`);
});
export const Book = ({ ...props }) => {
  const [page] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);

  useEffect(() => {
    let timeout;
    const goToPage = () => {
      //page是目标页 delayedPage是当前页
      setDelayedPage((delayedPage) => {
        if (page === delayedPage) {
          return delayedPage;
        } else {
          timeout = setTimeout(() => {
            goToPage();
          }, 150);
          if (page <= 0 || page >= 4) return delayedPage;
          const clickedPage = page % 4;
          const oppositePage = (page + 2) % 4;
          console.log("clickedpage", clickedPage, oppositePage);
          if (page > delayedPage) {
            console.log("右边翻页", page, delayedPage);
            return delayedPage + 1;
          }
          if (page < delayedPage) {
            console.log("左边翻页", page, delayedPage);

            return delayedPage - 1;
          }
        }
      });
    };
    goToPage();
    return () => {
      clearTimeout(timeout);
    };
  }, [page]);

  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {[...pages].map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          {...pageData}
        />
      ))}
    </group>
  );
};
