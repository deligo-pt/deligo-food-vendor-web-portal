import AboutCompany from "@/src/components/about-company/AboutCompany";
import AboutSection from "@/src/components/AboutSection/AboutSection";
import BenefitsSectionPremium from "@/src/components/Benefit/Benefit";
import FAQSection from "@/src/components/FAQSection/FAQSection";
import HeroSectionNextLevel from "@/src/components/Hero/hero";
import JoinVendorCTA from "@/src/components/JoinVendorCTA/JoinVendorCTA";
import HowItWorksSection from "@/src/components/works/works";
import ExploreFoodCategories from "@/src/components/ExploreFoodCategories/ExploreFoodCategories";
import VendorDashboardPreview from "@/src/components/VendorDashboardPreview/VendorDashboardPreview";
import SecurityTrustSection from "@/src/components/SecurityTrustSection/SecurityTrustSection";


const PublicHomePage = () => {
    return (
        <div>
            <HeroSectionNextLevel />
            <BenefitsSectionPremium />
            <HowItWorksSection />
            <AboutSection />
            <VendorDashboardPreview />
            <ExploreFoodCategories/>
            <AboutCompany />
            <SecurityTrustSection />
            <JoinVendorCTA />
            <FAQSection />
        </div>
    );
};

export default PublicHomePage;