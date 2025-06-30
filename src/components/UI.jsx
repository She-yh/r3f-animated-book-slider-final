import { useEffect } from "react";
import usePreviewStore from "./PreviewStore.tsx";
import { Button } from "antd";
const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
];

export const pages = [];
for (let i = 0; i < pictures.length; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

export const UI = () => {
  const { page, count, setCount, setDirection, isRotating, setIsRotating } =
    usePreviewStore();
  useEffect(() => {
    const audio = new Audio("/lyrics_book/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);
  const turnPage = (direction) => {
    if (isRotating) return;
    setIsRotating(true);
    setCount(count + direction);
    setDirection(direction);
  };
  return (
    <>
      <main className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-between flex-col">
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            <Button onClick={() => turnPage(-1)}>-1</Button>
            <Button onClick={() => turnPage(1)}>+1</Button>
          </div>
        </div>
      </main>
    </>
  );
};
