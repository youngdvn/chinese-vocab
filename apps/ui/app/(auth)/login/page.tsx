import { LoginForm } from "@/app/features/auth/components/login-form";

export default function LoginPage() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl">
            <LoginForm />
        </div>
    )
}