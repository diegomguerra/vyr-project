import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Brain } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      setIsSignUp(true);
    }
  }, [searchParams]);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/painel", { replace: true });
      }
    };
    checkAuth();
  }, [navigate]);

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

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/painel`,
          },
        });

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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

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
        } else {
          navigate("/painel", { replace: true });
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen vyr-gradient-bg flex items-center justify-center p-4 safe-area-inset">
      {/* Subtle radial glow */}
      <div className="fixed inset-0 vyr-gradient-radial opacity-30 pointer-events-none" />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-vyr-graphite to-vyr-accent flex items-center justify-center shadow-xl shadow-vyr-accent/20">
            <Brain className="w-8 h-8 text-vyr-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-vyr-white font-mono tracking-wide">VYR Labs</h1>
            <p className="text-xs text-vyr-gray-500 font-mono mt-1">
              Performance cognitiva mensurável
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="vyr-card-graphite p-6 sm:p-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-vyr-white">
                {isSignUp ? "Criar conta" : "Entrar"}
              </h2>
              <p className="text-xs text-vyr-gray-500 font-mono">
                {isSignUp ? "Registre-se para começar" : "Acesse sua conta"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs text-vyr-gray-400">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-vyr-gray-500 hover:text-vyr-white transition-colors"
              >
                {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-vyr-gray-600 font-mono">
          Clareza mental é construída com consistência.
        </p>
      </div>
    </div>
  );
}
