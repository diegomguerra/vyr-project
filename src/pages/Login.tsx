// VYR Labs - Login (Tela de entrada minimalista)

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Email já cadastrado",
              description: "Este email já está em uso. Tente fazer login.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Conta criada",
            description: "Verifique seu email para confirmar o cadastro.",
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Credenciais inválidas",
              description: "Email ou senha incorretos.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        }
        // Auth state change will trigger App.tsx to show VYRApp
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Algo deu errado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vyr-bg-primary flex flex-col items-center justify-center px-6 py-8 safe-area-top safe-area-bottom">
      {/* Logo / Título */}
      <div className="mb-12 text-center">
        <h1 className="text-vyr-text-primary text-2xl font-medium tracking-tight mb-2">
          VYR Labs
        </h1>
        <p className="text-vyr-text-muted text-sm">
          Gestão cognitiva simplificada
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-vyr-text-muted text-sm mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3.5 bg-vyr-bg-surface border border-vyr-stroke-divider rounded-xl text-vyr-text-primary placeholder:text-vyr-text-muted focus:outline-none focus:border-vyr-accent-action transition-colors"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="block text-vyr-text-muted text-sm mb-2">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3.5 bg-vyr-bg-surface border border-vyr-stroke-divider rounded-xl text-vyr-text-primary placeholder:text-vyr-text-muted focus:outline-none focus:border-vyr-accent-action transition-colors"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-4 rounded-xl bg-vyr-accent-action text-white font-medium transition-all active:scale-[0.98] active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
        >
          {loading ? "Carregando..." : isSignUp ? "Criar conta" : "Entrar"}
        </button>
      </form>

      {/* Toggle sign up / sign in */}
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-8 text-vyr-text-muted text-sm transition-colors active:text-vyr-text-secondary"
      >
        {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
      </button>
    </div>
  );
}
