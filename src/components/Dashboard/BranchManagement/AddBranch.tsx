'use client';

import { useState } from "react";
import AddBranchForm from "./AddBranchForm";
import BranchVerifyOTP from "./BranchVerifyOTP";


const AddBranch = () => {
    const [email, setEmail] = useState("");

    const onAddSuccess = (emailArg: string) => {
        setEmail(emailArg);
    };

    return (
        <div className="p-4 md:p-6 flex justify-center items-center max-w-2xl mx-auto h-full">
            {!email ? (
                <AddBranchForm onSuccess={onAddSuccess} />
            ) : (
                <BranchVerifyOTP email={email} />
            )}
        </div>
    );
};

export default AddBranch;