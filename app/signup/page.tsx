import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050505]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}