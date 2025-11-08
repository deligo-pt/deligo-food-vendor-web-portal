// FAQSection.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "What documents are required to become a vendor?",
    answer:
      "You need a valid business registration, tax ID, and a proof of address. Additional documents may be required depending on your business type.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Typically, vendor approval takes 24-48 hours after submitting all required documents.",
  },
  {
    question: "When will I receive payments?",
    answer:
      "Payments are processed weekly via SEPA transfer. You can track your earnings in real-time on your dashboard.",
  },
  {
    question: "Can I manage multiple locations?",
    answer:
      "Yes, you can add and manage multiple store locations under a single vendor account.",
  },
  {
    question: "What support is available?",
    answer:
      "24/7 multilingual support is available via chat, email, and phone for all vendors.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 sm:px-10 lg:px-20 bg-gray-900 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold text-white mb-10 text-center">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqData.map((item, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            <button
              onClick={() => toggleAccordion(i)}
              className="w-full px-6 py-4 flex justify-between items-center text-left text-white font-semibold hover:bg-gray-700 transition-colors"
            >
              <span>{item.question}</span>
              <motion.span
                animate={{ rotate: activeIndex === i ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {activeIndex === i && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="px-6 py-4 text-gray-300 bg-gray-800"
                >
                  {item.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
