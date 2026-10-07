import { RegisterForm } from "@/app/features/auth/components/register-form";

export default function RegisterPage() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl">
            <RegisterForm />
        </div>
    )
}