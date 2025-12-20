import Image from "next/image";

const AboutCompany = () => {
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
                        Powering the Future of{" "}
                        <span className="bg-linear-to-r from-[#DC3173] to-pink-600 bg-clip-text text-transparent">
                            Local Commerce
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                        We are building Portugal’s fastest-growing food & grocery delivery
                        platform — helping local restaurants, supermarkets, and independent
                        vendors reach more customers and grow their business online.
                    </p>

                    <p className="mt-4 text-gray-600 leading-relaxed">
                        From seamless order management to fast deliveries and real-time
                        insights, our platform empowers vendors with everything they need
                        to succeed — all from one simple dashboard.
                    </p>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-[#DC3173]">10K+</p>
                            <p className="text-gray-600 text-sm mt-1">Orders Delivered</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <p className="text-3xl font-bold text-[#DC3173]">500+</p>
                            <p className="text-gray-600 text-sm mt-1">Active Vendors</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-10">
                        <button className="inline-flex items-center justify-center rounded-full bg-[#DC3173] px-8 py-4 text-white font-semibold shadow-lg hover:bg-pink-600 transition-all">
                            Join as a Vendor
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default AboutCompany;
