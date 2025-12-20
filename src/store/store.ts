import { create } from "zustand"

type StoreState = {
    lang: string
    setLang: (selectedLang: string) => void
}

export const useStore = create<StoreState>((set) => ({
    lang: "en",
    setLang: (selectedLang) => set({ lang: selectedLang }),
}))
