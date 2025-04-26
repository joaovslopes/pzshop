"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Package, ShoppingCart, AlertTriangle } from "lucide-react";
import {
  formatDistanceToNow,
  isBefore,
  isAfter,
  addDays,
  parseISO,
} from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

interface License {
  _id: string;
  token: string;
  domain: string;
  expirationDate: string;
  themeUrl: string;
  updateUrl: string;
  downloader: "active" | "disabled";
  dashboard: "active" | "disabled";
}

interface UserData {
  name: string;
  email: string;
  licenses: License[];
}

interface CountsData {
  launcherCount: number;
  scriptCount: number;
  totalCount: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [counts, setCounts] = useState<CountsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch user data plus licenses
    const fetchUser = fetch("http://localhost:5005/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json());

    // Fetch counts (launcher + scripts)
    const fetchCounts = fetch("http://localhost:5005/api/users/counts", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json());

    Promise.all([fetchUser, fetchCounts])
      .then(([jrUser, jrCounts]) => {
        if (jrUser.success) setUser(jrUser.data);
        if (jrCounts.success) setCounts(jrCounts.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando dashboard…</p>;
  if (!user || !counts)
    return <p>Não foi possível carregar os dados do dashboard.</p>;

  const now = new Date();
  const soonThreshold = addDays(now, 7);

  const totalLicenses = user.licenses.length;
  const expiredLicenses = user.licenses.filter(l =>
    isBefore(parseISO(l.expirationDate), now)
  );
  const expiringSoon = user.licenses.filter(l => {
    const exp = parseISO(l.expirationDate);
    return isAfter(exp, now) && isBefore(exp, soonThreshold);
  });

  const totalProducts = counts.totalCount;

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo, {user.name}.
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore a dashboard, configure seus produtos, faça downloads e visite
          nossa loja.
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm flex gap-1 items-center font-medium">
              <Package className="h-4 w-4 text-muted-foreground" />
              Total de Licenças
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLicenses}</div>
            </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm flex gap-1 items-center font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Próximas a vencer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringSoon.length}</div>
            <p className="text-xs text-muted-foreground">
              {expiringSoon.length > 0 ? `Vence em até 7 dias` : "Nenhuma"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm flex gap-1 items-center font-medium">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Expiradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredLicenses.length}</div>
            <p className="text-xs text-muted-foreground">
              {expiredLicenses.length > 0
                ? `Expiradas há ${formatDistanceToNow(
                    parseISO(expiredLicenses[0].expirationDate),
                    { addSuffix: true, locale: ptBR }
                  )}`
                : "Nenhuma"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm flex gap-1 items-center font-medium">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">+1 no último mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Atividade recente */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl md:col-span-2">
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.licenses
                .sort((a, b) =>
                  parseISO(b.expirationDate) > parseISO(a.expirationDate)
                    ? 1
                    : -1
                )
                .slice(0, 3)
                .map((l) => {
                  const exp = parseISO(l.expirationDate);
                  const status = isBefore(exp, now)
                    ? "red"
                    : isBefore(exp, soonThreshold)
                    ? "yellow"
                    : "green";
                  return (
                    <div key={l._id} className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          status === "red"
                            ? "bg-red-500"
                            : status === "yellow"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {status === "green"
                            ? "Licença ativa"
                            : status === "yellow"
                            ? "Vence em breve"
                            : "Licença expirada"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {l.token} –{" "}
                          {formatDistanceToNow(exp, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Suporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">Precisa de ajuda com seus produtos?</p>
              <div className="grid gap-2">
                <a href="#" className="text-sm text-primary hover:underline">
                  Documentação
                </a>
                <a href="#" className="text-sm text-primary hover:underline">
                  FAQ
                </a>
                <a href="#" className="text-sm text-primary hover:underline">
                  Contato
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
