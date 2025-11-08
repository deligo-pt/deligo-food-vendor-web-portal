import AboutSection from "../components/AboutSection/AboutSection";
import BenefitsSectionPremium from "../components/Benefit/Benefit";
import FAQSection from "../components/FAQSection/FAQSection";
import FooterPremiumNextLevel from "../components/Footer/Footer";
import HeroSectionNextLevel from "../components/Hero/hero";
import JoinVendorCTA from "../components/JoinVendorCTA/JoinVendorCTA";
import KeyMetrics from "../components/KeyMetrics/KeyMetrics";
import Navbar from "../components/nabar/Navbar";
import PricingCommissionInteractive from "../components/PricingCommission/PricingCommission";
import VendorTestimonials from "../components/VendorTestimonials/VendorTestimonials";
import HowItWorksSection from "../components/works/works";



export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <HeroSectionNextLevel/>
      <BenefitsSectionPremium/>
      <HowItWorksSection/>
      <AboutSection/>
      <VendorTestimonials/>
      <KeyMetrics/>
      <PricingCommissionInteractive/>
      <JoinVendorCTA/>
      <FAQSection/>
      <FooterPremiumNextLevel/>
    </div>
  );
}
