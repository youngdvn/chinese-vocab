"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back
                </h1>

                <p className="text-sm text-muted-foreground">
                    Sign in to continue learning Chinese
                </p>
            </div>

            <form className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email
                    </Label>

                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">
                            Password
                        </Label>

                        <Link
                            href="/forgot-password"
                            className="text-xs text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="pr-20"
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                >
                    <Link href={"/"}>Sign In</Link>
                </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                >
                    Create account
                </Link>
            </p>
        </div>
    )
}