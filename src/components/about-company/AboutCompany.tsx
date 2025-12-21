'use client'

import { useTranslation } from "@/src/hooks/use-translation";
import Image from "next/image";
import Link from "next/link";

const AboutCompany = () => {
    const { t } = useTranslation();

    return (
        <section className="relative py-24 px-6 sm:px-12 lg:px-28 bg-white overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,49,115,0.08),transparent_70%)] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Image Section */}
                <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[520px] rounded-3xl overflow-hidden shadow-xl">
                    <Image
                        src="/deligo_office.jpeg"
                        alt="About Company"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                    />
                </div>

                {/* Content Section */}
                <div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                        {t('aboutCompanyTitle')} {" "}
                        <span className="bg-linear-to-r from-[#DC3173] to-pink-600 bg-clip-text text-transparent">
                            {t('aboutCompanyTitleLocal')}
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                        {t('aboutCompanyDesc1')}
                    </p>

                    <p className="mt-4 text-gray-600 leading-relaxed">
                        {t('aboutCompanyDesc2')}
                    </p>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-[#DC3173]">10K+</p>
                            <p className="text-gray-600 text-sm mt-1">{t("aboutCompanyStatDesc")}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-[#DC3173]">500+</p>
                            <p className="text-gray-600 text-sm mt-1">{t("aboutCompanyStatDesc2")}</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-10">
                        <Link href="/become-vendor" className="ml-4 px-5 py-2 bg-[#DC3173] text-white font-semibold rounded-lg hover:bg-[#a72b5c] transition-all">
                            {t("aboutCompanyCTA")}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default AboutCompany;
