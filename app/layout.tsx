// app/layout.tsx (ou pages/_app.tsx)
import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// ➜ importe o CSS do React-Toastify
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"

import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { LanguageProvider } from "@/components/language-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PZ Store - Scripts e Launchers para MU Online",
  description: "Scripts e Launchers para seu servidor MU Online",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              {/* Cabeçalho específico de cada página */}
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>

        {/* ToastContainer do React-Toastify */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/* Analytics e Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
