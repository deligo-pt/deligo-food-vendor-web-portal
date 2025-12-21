"use client"
import { useTranslation } from '@/src/hooks/use-translation';
import { motion } from 'framer-motion';
import { BarChart2, Truck, DollarSign, Headphones } from 'lucide-react';

export default function BenefitsSectionPremium() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <BarChart2 className="w-10 h-10 text-white" />,
      title: t('benefitFeatureTitle1'),
      desc: t('benefitFeatureDesc1'),
      gradient: 'from-[#DC3173] to-[#FF6F61]',
    },
    {
      icon: <Truck className="w-10 h-10 text-white" />,
      title: t('benefitFeatureTitle2'),
      desc: t('benefitFeatureDesc2'),
      gradient: 'from-[#FF6F61] to-[#FF9980]',
    },
    {
      icon: <DollarSign className="w-10 h-10 text-white" />,
      title: t('benefitFeatureTitle3'),
      desc: t('benefitFeatureDesc3'),
      gradient: 'from-[#FFCC33] to-[#FFD966]',
    },
    {
      icon: <Headphones className="w-10 h-10 text-white" />,
      title: t('benefitFeatureTitle4'),
      desc: t('benefitFeatureDesc4'),
      gradient: 'from-[#43CEA2] to-[#185A9D]',
    },
  ];

  return (
    <section className="relative py-24 bg-[#1B1B2F] overflow-hidden">
      {/* Animated background subtle glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-80 h-80 bg-[#DC3173]/20 rounded-full top-10 left-1/4 animate-pulse-slow blur-3xl"></div>
        <div className="absolute w-96 h-96 bg-[#FF6F61]/20 rounded-full bottom-10 right-1/4 animate-pulse-slow blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-16 drop-shadow-lg"
        >
          {t('benefitTitle')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, transition: { type: 'spring', stiffness: 130 } }}
              className={`relative p-6 rounded-3xl bg-[#22223B]/80 backdrop-blur-md shadow-2xl hover:shadow-3xl cursor-pointer border border-white/10 transition-all duration-300`}
            >
              <div className={`mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-tr ${feature.gradient} shadow-lg`}>{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2 text-center drop-shadow-md">{feature.title}</h3>
              <p className="text-white/90 text-sm text-center">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
