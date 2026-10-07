"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { IconEye, IconEyeClosed } from "@tabler/icons-react"
import { useForm } from "react-hook-form"
import { RegisterFormValues, registerSchema } from "@/schemas/auth.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { register } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState("")
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    async function onSubmit(values: RegisterFormValues) {
        try {
            setLoading(true)
            const user = await register({
                name: values.name,
                email: values.email,
                password: values.password
            })
            console.log(user)
            toast.success("Account created successfully", {
                description: "You can now sign in to your account.",
            })
            router.push("/")
        }
        catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong"

            setServerError(message)

            toast.error("Registration failed", {
                description: message,
            })
        }
        finally {
            setLoading(false)
        }

    }

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Create an account
                </h1>

                <p className="text-sm text-muted-foreground">
                    Start your Chinese learning journey
                </p>
            </div>

            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Name
                    </Label>

                    <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        autoComplete="name"
                        {...form.register("name")}
                    />
                </div>
                {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.name.message}
                    </p>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email
                    </Label>

                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email" required
                        {...form.register("email")}
                    />
                </div>
                {form.formState.errors.email && (
                    <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                    </p>
                )}

                <div className="space-y-2">
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            className="pr-20"
                            {...form.register("password")}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (<IconEye size={16} />) : (<IconEyeClosed size={16} />)}

                        </button>
                    </div>
                    {form.formState.errors.password && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.password.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                        Confirm password
                    </Label>

                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        {...form.register("confirmPassword")}
                    />
                    {form.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.confirmPassword.message}
                        </p>
                    )}
                </div>
                {serverError && (
                    <p className="text-sm text-destructive">
                        {serverError}
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Creating..." : " Create account"}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
    )
}