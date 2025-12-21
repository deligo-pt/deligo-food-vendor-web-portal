import { translations } from '@/src/assets/translations'
import { useStore } from '@/src/store/store'

export const useTranslation = () => {
    const lang = useStore((state) => state.lang)

    const t = (key: string): string => {
        return (
            translations[lang]?.[key as keyof typeof translations.en] ||
            translations.en[key as keyof typeof translations.en] ||
            key
        )
    }

    return { t }
}
