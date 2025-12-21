import { translations } from "@/src/assets/translations";
import { useStore } from "@/src/store/store";



export const t = (key: string): string => {
    const lang = useStore.getState().lang;

    return (
        translations[lang]?.[key as keyof typeof translations.en] ||
        translations.en[key as keyof typeof translations.en] ||
        key
    )
};