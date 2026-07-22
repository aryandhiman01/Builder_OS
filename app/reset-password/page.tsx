import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}