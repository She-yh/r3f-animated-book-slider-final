import { create } from "zustand";
type Store = {
  fullScreen: boolean;
  setFullScreen: (val: boolean) => void;
  page: number;
  count: number;
  direction: number;
  isRotating: boolean;
};
const usePreviewStore = create<Store>()((set) => ({
  fullScreen: false,
  setFullScreen: (val: boolean) => set({ fullScreen: val }),
  page: 2,
  count: 2,
  direction: 0,
  isRotating: false,
  setPage: (val: number) => set({ page: val }),
  setCount: (val: number) => set({ count: val }),
  setDirection: (val: number) => set({ direction: val }),
  setIsRotating: (val: boolean) => set({ isRotating: val }),
}));

export default usePreviewStore;
