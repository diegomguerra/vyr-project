import { Brain, LineChart, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginLayoutProps = {
  email: string;
  password: string;
  isLoading: boolean;
  isSignUp: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onToggleSignUp: () => void;
};

export function LoginLayout({
  email,
  password,
  isLoading,
  isSignUp,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onToggleSignUp,
}: LoginLayoutProps) {
  const highlights = [
    {
      title: "Protocolos inteligentes",
      description: "Rotinas guiadas por dados para foco, energia e clareza.",
      icon: Sparkles,
    },
    {
      title: "Insights acionáveis",
      description: "Painéis com sinais cognitivos e tendências semanais.",
      icon: LineChart,
    },
    {
      title: "Privacidade e segurança",
      description: "Dados sensíveis protegidos em cada sessão.",
      icon: Shield,
    },
  ];

  const kpis = [
    { label: "Signal score", value: "84", suffix: "pts" },
    { label: "Baseline", value: "7", suffix: "dias" },
    { label: "Foco", value: "82", suffix: "%" },
  ];

  return (
    <div className="min-h-screen vyr-gradient-bg safe-area-inset">
      <div className="fixed inset-0 vyr-gradient-radial opacity-30 pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="order-2 space-y-6 lg:order-1">
            <div className="vyr-badge-accent w-fit">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-mono tracking-wider">VYR APP</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-semibold text-vyr-white">
                A nova experiência VYR para decisões cognitivas precisas
              </h1>
              <p className="text-sm sm:text-base text-vyr-gray-400 max-w-xl">
                O novo front da VYR App integra check-ins guiados, baseline de performance e
                insights inteligentes em um painel enxuto e executivo.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="vyr-card-graphite p-4 space-y-3">
                    <div className="w-9 h-9 rounded-sm bg-vyr-graphite-dark/80 border border-vyr-graphite/60 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-vyr-gray-200" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-vyr-white">{item.title}</p>
                      <p className="text-xs text-vyr-gray-500 mt-1">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {kpis.map((item) => (
                <div key={item.label} className="vyr-card-glow p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-vyr-gray-500 font-mono">
                    {item.label}
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-2xl font-semibold text-vyr-white">{item.value}</span>
                    <span className="text-xs text-vyr-gray-500">{item.suffix}</span>
                  </div>
                  <div className="mt-3 vyr-accent-line" />
                </div>
              ))}
            </div>
          </section>

          <section className="order-1 lg:order-2">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vyr-graphite to-vyr-accent flex items-center justify-center shadow-xl shadow-vyr-accent/20">
                    <Brain className="w-6 h-6 text-vyr-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-vyr-white font-mono tracking-wide">
                      VYR App
                    </h2>
                    <p className="text-xs text-vyr-gray-500 font-mono mt-1">
                      Performance cognitiva mensurável
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full border border-vyr-graphite/60 text-[10px] uppercase tracking-[0.3em] text-vyr-gray-500">
                  secure
                </span>
              </div>

              <div className="vyr-card-glow p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-vyr-white">
                      {isSignUp ? "Criar conta" : "Entrar"}
                    </h3>
                    <p className="text-xs text-vyr-gray-500 font-mono">
                      {isSignUp ? "Registre-se para começar" : "Acesse sua conta"}
                    </p>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs text-vyr-gray-400">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        className="bg-vyr-graphite-dark border-vyr-graphite text-vyr-white text-sm placeholder:text-vyr-gray-600"
                        autoComplete="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-xs text-vyr-gray-400">
                        Senha
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        className="bg-vyr-graphite-dark border-vyr-graphite text-vyr-white text-sm placeholder:text-vyr-gray-600"
                        autoComplete={isSignUp ? "new-password" : "current-password"}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-vyr-white hover:bg-vyr-gray-100 text-vyr-black text-sm font-medium h-11"
                    >
                      {isLoading ? "Processando..." : isSignUp ? "Criar conta" : "Entrar"}
                    </Button>
                  </form>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={onToggleSignUp}
                      className="text-xs text-vyr-gray-500 hover:text-vyr-white transition-colors"
                    >
                      {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-[10px] text-vyr-gray-600 font-mono">
                Clareza mental é construída com consistência.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
