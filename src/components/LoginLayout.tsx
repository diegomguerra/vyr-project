import { Brain } from "lucide-react";
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
  return (
    <div className="min-h-screen bg-[#0E0F12] safe-area-inset flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#14161B] to-[#556B8A] flex items-center justify-center">
              <Brain className="w-6 h-6 text-[#ECEEF2]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#ECEEF2] font-mono tracking-wide">
                VYR App
              </h2>
              <p className="text-xs text-[#A7ADB8] font-mono mt-1">
                Performance cognitiva mensurável
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full border border-[#232733] text-[10px] uppercase tracking-[0.3em] text-[#A7ADB8]">
            secure
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-[#14161B] border border-[#232733] rounded-2xl p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium text-[#ECEEF2]">
                {isSignUp ? "Criar conta" : "Entrar"}
              </h3>
              <p className="text-xs text-[#A7ADB8] font-mono">
                {isSignUp ? "Registre-se para começar" : "Acesse sua conta"}
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-[#A7ADB8]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  className="bg-[#0E0F12] border-[#232733] text-[#ECEEF2] text-sm placeholder:text-[#A7ADB8]/40"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs text-[#A7ADB8]">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  className="bg-[#0E0F12] border-[#232733] text-[#ECEEF2] text-sm placeholder:text-[#A7ADB8]/40"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ECEEF2] hover:bg-[#A7ADB8] text-[#0E0F12] text-sm font-medium h-11"
              >
                {isLoading ? "Processando..." : isSignUp ? "Criar conta" : "Entrar"}
              </Button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onToggleSignUp}
                className="text-xs text-[#A7ADB8] hover:text-[#ECEEF2] transition-colors"
              >
                {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-[#A7ADB8]/50 font-mono">
          Clareza mental é construída com consistência.
        </p>
      </div>
    </div>
  );
}
