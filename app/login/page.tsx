// app/login/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  // Se já estiver logado, redireciona direto
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.replace("/dashboard")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const API = "https://apisite.pzdev.com.br/api"
      const resp = await axios.post(`${API}/users/login`, formData)
      const { success, token, message } = resp.data

      if (!success) {
        toast.error(message || "Email ou senha incorretos.")
        setLoading(false)
        return
      }

      // guarda o JWT e entra no dashboard
      localStorage.setItem("token", token)
      toast.success("Login realizado!")
      router.push("/dashboard")
    } catch (err: any) {
      console.error(err)
      toast.error(
        err.response?.data?.message ||
          "Erro na conexão. Tente novamente mais tarde."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-custom-bg bg-cover h-screen">
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Entrar na sua conta
          </CardTitle>
          <CardDescription className="text-center">
            Use seu email e senha para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="rounded-xl"
              />
            </div>
            <div className="text-right">
              <Link
                href="/esqueci-senha"
                className="text-sm text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            Não tem conta?{" "}
            <Link href="/cadastro" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
          <Link href="/" className="text-sm hover:text-primary">
            Voltar para Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
