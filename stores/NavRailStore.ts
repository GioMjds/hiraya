import { create } from "zustand";
import { persist } from "zustand/middleware";

interface States {
  isCollapsed: boolean;
}

interface Actions {
  toggleCollapse: () => void;
  setCollapse: (collapsed: boolean) => void;
}

export const useNavRailStore = create<States & Actions>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapse: (collapsed: boolean) => set({ isCollapsed: collapsed }),
    }),
    {
      name: "nav-rail",
    }
  )
);