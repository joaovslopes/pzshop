// app/cadastro/page.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://apisite.pzdev.com.br";

// dynamically load ToastContainer on client only
const ToastContainer = dynamic(
  () =>
    import("react-toastify").then((mod) => {
      return mod.ToastContainer;
    }),
  { ssr: false }
);

export default function CadastroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const jr = await res.json();

      if (!res.ok) {
        const msg =
          jr.message === "Email já cadastrado."
            ? "Este email já está em uso."
            : jr.message || "Falha no cadastro.";
        toast.error(msg);
        return;
      }

      toast.success("Cadastro realizado! Redirecionando para login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      console.error("Erro no cadastro:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-custom-bg bg-cover h-screen">
      <ToastContainer position="top-right" />
      <Card className="w-full max-w-md rounded-2xl shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Criar uma conta
          </CardTitle>
          <CardDescription className="text-center">
            Preencha os campos abaixo para se cadastrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                placeholder="Seu nome completo"
                required
                value={formData.name}
                onChange={handleChange}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
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
                placeholder="Sua senha"
                required
                value={formData.password}
                onChange={handleChange}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Repetir Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repita sua senha"
                required
                value={confirmPassword}
                onChange={handleConfirmChange}
                className="rounded-xl"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>
          <Link href="/" className="text-sm hover:text-primary">
            Voltar para Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
