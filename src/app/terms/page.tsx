// TermsConditions.tsx
"use client";

import { motion } from "framer-motion";
import { ClipboardX, Shield, CreditCard, UserCheck, AlertCircle } from "lucide-react";

export default function TermsConditions() {
  const sections = [
    {
      icon: <ClipboardX className="w-6 h-6 text-[#DC3173]" />,
      title: "Vendor Registration & Account",
      content: `To join Deligo as a vendor, you must create an account with accurate business information. 
      Ensure your business is registered in Portugal and all documentation is valid. 
      Vendors are responsible for maintaining updated information in their dashboard.`
    },
    {
      icon: <Shield className="w-6 h-6 text-[#DC3173]" />,
      title: "Compliance & Legal Obligations",
      content: `Vendors must comply with all Portuguese laws regarding food safety, business operations, 
      and taxation. Deligo may request proof of compliance at any time. 
      Non-compliance may result in suspension or termination.`
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#DC3173]" />,
      title: "Payment & Commission",
      content: `Deligo charges a commission of 15% per order. Payouts are processed weekly via secure SEPA transfer. 
      Vendors are responsible for correct banking details. Any discrepancies must be reported immediately.`
    },
    {
      icon: <UserCheck className="w-6 h-6 text-[#DC3173]" />,
      title: "Product & Service Standards",
      content: `Vendors must ensure product quality, accurate descriptions, and timely delivery. 
      All listings must reflect actual availability. Failure to meet standards may impact ratings and platform access.`
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-[#DC3173]" />,
      title: "Termination & Suspension",
      content: `Deligo reserves the right to suspend or terminate vendor accounts for violations of terms, fraudulent activity, 
      or repeated customer complaints. Vendors may terminate their participation by providing written notice.`
    },
    {
      icon: <ClipboardX className="w-6 h-6 text-[#DC3173]" />,
      title: "Dispute Resolution & Liability",
      content: `All disputes will first attempt to be resolved amicably between Deligo and the vendor. 
      Deligo is not liable for losses arising from vendor non-compliance, delivery issues, or technical failures.`
    },
    {
      icon: <Shield className="w-6 h-6 text-[#DC3173]" />,
      title: "Confidentiality & Data Protection",
      content: `Vendors must not share customer data outside the platform. All personal and order data 
      must be handled according to GDPR regulations. Deligo may audit data handling practices periodically.`
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#DC3173]" />,
      title: "Amendments to Terms",
      content: `Deligo reserves the right to modify these terms at any time. Vendors will be notified 
      via email and dashboard notification. Continued use after modifications constitutes acceptance.`
    }
  ];

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8 text-center">
          Vendor Terms & Conditions
        </h1>
        <p className="text-gray-700 mb-12 text-center text-lg">
          By joining Deligo as a vendor, you agree to comply with the following terms and conditions. 
          Please read carefully before registering.
        </p>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-4 hover:shadow-2xl transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {section.icon}
                <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: sections.length * 0.1 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-700 mb-4 text-lg">
            Ready to join Deligo? Start growing your business today.
          </p>
          <a
            href="/vendor-signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#FF7EB3] to-[#DC3173] text-white font-bold rounded-full text-lg hover:scale-105 hover:shadow-lg transition"
          >
            Become a Vendor
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}