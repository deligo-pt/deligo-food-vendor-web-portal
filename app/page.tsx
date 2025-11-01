import AboutSection from "@/components/AboutSection/AboutSection";
import BenefitsSection from "@/components/Benefit/Benefit";
import ContactSupportSection from "@/components/ContactSupportSection/ContactSupportSection";
import FAQSection from "@/components/FAQSection/FAQSection";
import FooterPremium from "@/components/Footer/Footer";
import HeroSection from "@/components/Hero/hero";
import JoinVendorCTA from "@/components/JoinVendorCTA/JoinVendorCTA";
import KeyMetrics from "@/components/KeyMetrics/KeyMetrics";
import Navbar from "@/components/nabar/Navbar";
import PricingCommission from "@/components/PricingCommission/PricingCommission";
import VendorTestimonials from "@/components/VendorTestimonials/VendorTestimonials";
import HowItWorksSection from "@/components/works/works";


export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <HeroSection/>
      <BenefitsSection/>
      <HowItWorksSection/>
      <AboutSection/>
      <VendorTestimonials/>
      <KeyMetrics/>
      <PricingCommission/>
      <JoinVendorCTA/>
      <FAQSection/>
      <FooterPremium/>
    </div>
  );
}
