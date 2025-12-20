import AboutCompany from "@/src/components/about-company/AboutCompany";
import AboutSection from "@/src/components/AboutSection/AboutSection";
import BenefitsSectionPremium from "@/src/components/Benefit/Benefit";
import FAQSection from "@/src/components/FAQSection/FAQSection";
import HeroSectionNextLevel from "@/src/components/Hero/hero";
import JoinVendorCTA from "@/src/components/JoinVendorCTA/JoinVendorCTA";
import KeyMetrics from "@/src/components/KeyMetrics/KeyMetrics";
import PricingCommissionInteractive from "@/src/components/PricingCommission/PricingCommission";
import VendorTestimonials from "@/src/components/VendorTestimonials/VendorTestimonials";
import HowItWorksSection from "@/src/components/works/works";


const PublicHomePage = () => {
    return (
        <div>
            <HeroSectionNextLevel />
            <BenefitsSectionPremium />
            <HowItWorksSection />
            <AboutSection />
            <VendorTestimonials />
            <KeyMetrics />
            <AboutCompany />
            <PricingCommissionInteractive />
            <JoinVendorCTA />
            <FAQSection />
        </div>
    );
};

export default PublicHomePage;