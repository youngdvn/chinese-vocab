import { Geist_Mono, IBM_Plex_Sans } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@workspace/ui/components/sonner";

const geistMonoHeading = Geist_Mono({ subsets: ['latin'], variable: '--font-heading' });

const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"], variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", ibmPlexSans.variable, geistMonoHeading.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ServiceWorkerRegister />
          <Analytics />
          <main className="flex h-svh w-full justify-start md:justify-center">
            <div className="w-full max-w-md">
              {children}
            </div>
          </main>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
