import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import brainIcon from "@/assets/brain-icon.png";

type LoginLayoutProps = {
  email: string;
  password: string;
  isLoading: boolean;
  isSignUp: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onToggleSignUp: () => void;
  onForgotPassword: () => void;
  onGoogleLogin: () => void;
  onAppleLogin: () => void;
  oauthLoading?: boolean;
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
  onForgotPassword,
  onGoogleLogin,
  onAppleLogin,
  oauthLoading,
}: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0E0F12] safe-area-inset flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={brainIcon} alt="VYR Brain" className="w-12 h-12 rounded-lg" />
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

            {/* OAuth Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onGoogleLogin}
                disabled={oauthLoading || isLoading}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-[#232733] bg-[#0E0F12] text-[#ECEEF2] text-sm font-medium transition-all hover:bg-[#1a1c22] active:scale-[0.98] disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar com Google
              </button>
              <button
                type="button"
                onClick={onAppleLogin}
                disabled={oauthLoading || isLoading}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border border-[#232733] bg-[#0E0F12] text-[#ECEEF2] text-sm font-medium transition-all hover:bg-[#1a1c22] active:scale-[0.98] disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#ECEEF2">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continuar com Apple
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#232733]" />
              <span className="text-[10px] text-[#A7ADB8] uppercase tracking-widest">ou</span>
              <div className="flex-1 h-px bg-[#232733]" />
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs text-[#A7ADB8]">
                    Senha
                  </Label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={onForgotPassword}
                      className="text-[10px] text-[#A7ADB8] hover:text-[#ECEEF2] transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
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
