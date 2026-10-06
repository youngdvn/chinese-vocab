"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)

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

            <form className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Name
                    </Label>

                    <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        autoComplete="name"
                        required
                    />
                </div>

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
                    <Label htmlFor="password">
                        Password
                    </Label>

                    <div className="relative">
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
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

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                        Confirm password
                    </Label>

                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                >
                    Create account
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