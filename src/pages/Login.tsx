import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { LoginLayout } from "@/components/LoginLayout";
import ForgotPassword from "@/pages/ForgotPassword";

export default function Login() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Campos obrigatórios", description: "Por favor, preencha email e senha.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Senha muito curta", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          if (error.message.includes("already registered")) {
            toast({ title: "Email já cadastrado", description: "Este email já está em uso. Tente fazer login.", variant: "destructive" });
          } else throw error;
        } else {
          toast({ title: "Conta criada", description: "Verifique seu email para confirmar o cadastro." });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({ title: "Credenciais inválidas", description: "Email ou senha incorretos.", variant: "destructive" });
          } else throw error;
        }
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Algo deu errado.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setOauthLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast({ title: "Erro", description: (error as any).message || "Erro ao conectar.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Erro", description: err.message || "Algo deu errado.", variant: "destructive" });
    } finally {
      setOauthLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <LoginLayout
      email={email}
      password={password}
      isLoading={loading}
      isSignUp={isSignUp}
      oauthLoading={oauthLoading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      onToggleSignUp={() => setIsSignUp(!isSignUp)}
      onForgotPassword={() => setShowForgotPassword(true)}
      onGoogleLogin={() => handleOAuth("google")}
      onAppleLogin={() => handleOAuth("apple")}
    />
  );
}
