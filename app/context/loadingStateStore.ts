import create from "zustand";
interface ILoadingState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const useLoadingStateStore = create<ILoadingState>((set: any) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));

export default useLoadingStateStore;
