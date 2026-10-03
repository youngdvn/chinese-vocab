import React from "react";
import HeaderLayout from "../layouts/header-layout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <HeaderLayout />
            <main>{children}</main>
        </div>
    )
}