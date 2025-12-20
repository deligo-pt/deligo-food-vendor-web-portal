import FooterDeligoPremium from "@/src/components/Footer/Footer";
import Navbar from "@/src/components/nabar/Navbar";
import React from "react";


const PublicLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            {children}
            <FooterDeligoPremium />
        </div>
    );
};

export default PublicLayout;