"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconEye, IconEyeClosed } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { login } from "@/services/auth.service"
import {
    loginSchema,
    type LoginFormValues,
} from "@/schemas/auth.schema"

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: LoginFormValues) => {
        try {
            await login(values)

            toast.success("Đăng nhập thành công!")
            router.replace("/")
            router.refresh()
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể đăng nhập. Vui lòng kiểm tra lại email hoặc mật khẩu."

            toast.error(message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="mb-8 text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Chào mừng trở lại
                    </h1>

                    <p className="text-sm leading-6 text-muted-foreground">
                        Tiếp tục hành trình học từ vựng tiếng Trung mỗi ngày.
                    </p>
                </div>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
            >
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                    />

                    {errors.email && (
                        <p className="text-sm text-destructive">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mật khẩu</Label>

                        <Link
                            href="/forgot-password"
                            className="text-xs text-primary hover:underline"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="pr-10"
                            aria-invalid={!!errors.password}
                            {...register("password")}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((current) => !current)
                            }
                            aria-label={
                                showPassword
                                    ? "Ẩn mật khẩu"
                                    : "Hiện mật khẩu"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? (
                                <IconEye size={16} />
                            ) : (
                                <IconEyeClosed size={16} />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <p className="text-sm text-destructive">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                >
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    )
}
