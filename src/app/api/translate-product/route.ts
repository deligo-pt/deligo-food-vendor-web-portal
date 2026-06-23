/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { data, selectedLanguage } = await req.json();

        const sourceLang =
            selectedLanguage === "en"
                ? "EN"
                : "PT";

        const targetLang =
            selectedLanguage === "en"
                ? "PT"
                : "EN";

        const texts: string[] = [];

        texts.push(
            selectedLanguage === "en"
                ? data.name.en
                : data.name.pt
        );

        texts.push(
            selectedLanguage === "en"
                ? data.description.en
                : data.description.pt
        );

        data.variations.forEach((variation: any) => {
            texts.push(
                selectedLanguage === "en"
                    ? variation.name.en
                    : variation.name.pt
            );

            variation.options.forEach(
                (option: any) => {
                    texts.push(
                        selectedLanguage === "en"
                            ? option.label.en
                            : option.label.pt
                    );
                }
            );
        });

        const params =
            new URLSearchParams();

        texts.forEach((text) => {
            params.append("text", text);
        });

        params.append(
            "source_lang",
            sourceLang
        );

        params.append(
            "target_lang",
            targetLang
        );

        const deeplResponse =
            await fetch(
                "https://api-free.deepl.com/v2/translate",
                {
                    method: "POST",
                    headers: {
                        Authorization: `DeepL-Auth-Key ${process.env.NEXT_PUBLIC_DEEPL_API_KEY}`,
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },
                    body: params,
                }
            );

        const deeplData =
            await deeplResponse.json();

        const translations =
            deeplData.translations.map(
                (t: any) => t.text
            );

        let index = 0;

        const translatedName =
            translations[index++];

        const translatedDescription =
            translations[index++];

        const translatedVariations =
            data.variations.map(
                (variation: any) => {
                    const translatedVariationName =
                        translations[index++];

                    return {
                        ...variation,

                        name:
                            selectedLanguage === "en"
                                ? {
                                    en: variation.name.en,
                                    pt: translatedVariationName,
                                }
                                : {
                                    en: translatedVariationName,
                                    pt: variation.name.pt,
                                },

                        options:
                            variation.options.map(
                                (option: any) => {
                                    const translatedLabel =
                                        translations[index++];

                                    return {
                                        ...option,

                                        label:
                                            selectedLanguage === "en"
                                                ? {
                                                    en: option.label.en,
                                                    pt: translatedLabel,
                                                }
                                                : {
                                                    en: translatedLabel,
                                                    pt: option.label.pt,
                                                },
                                    };
                                }
                            ),
                    };
                }
            );

        const translatedData = {
            ...data,

            name:
                selectedLanguage === "en"
                    ? {
                        en: data.name.en,
                        pt: translatedName,
                    }
                    : {
                        en: translatedName,
                        pt: data.name.pt,
                    },

            description:
                selectedLanguage === "en"
                    ? {
                        en: data.description.en,
                        pt: translatedDescription,
                    }
                    : {
                        en: translatedDescription,
                        pt: data.description.pt,
                    },

            variations:
                translatedVariations,
        };

        return NextResponse.json({
            success: true,
            data: translatedData,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: "Translation failed",
            },
            {
                status: 500,
            }
        );
    }
}