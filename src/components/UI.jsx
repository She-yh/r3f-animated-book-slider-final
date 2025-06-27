import { atom, useAtom } from "jotai";
import { useEffect } from "react";

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

export const pageAtom = atom(2);
export const countAtom = atom(2);
export const directionAtom = atom(1);
export const isRotating = atom(false);
export const pages = [];
for (let i = 0; i < pictures.length; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

export const UI = () => {
  const [page] = useAtom(pageAtom);
  const [count, setCount] = useAtom(countAtom);
  const [_, setDirection] = useAtom(directionAtom);
  useEffect(() => {
    const audio = new Audio("/lyrics_book/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);

  return (
    <>
      <main className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-between flex-col">
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            <button
              className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${"bg-white/90 text-black"}`}
              onClick={() => {
                setCount(count - 1);
                setDirection(-1);
              }}
            >
              -1
            </button>
            <button
              className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${"bg-white/90 text-black"}`}
              onClick={() => {
                setCount(count + 1);
                setDirection(1);
              }}
            >
              +1
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
