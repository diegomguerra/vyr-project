import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Mail } from "lucide-react";
import brainIcon from "@/assets/brain-icon.png";

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email obrigatório", description: "Informe seu email.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setSent(true);
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Algo deu errado.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] safe-area-inset flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <button onClick={onBack} className="flex items-center gap-1 text-[#A7ADB8] transition-opacity active:opacity-60">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Voltar ao login</span>
        </button>

        <div className="flex items-center gap-3">
          <img src={brainIcon} alt="VYR Brain" className="w-12 h-12 rounded-lg" />
          <div>
            <h2 className="text-xl font-semibold text-[#ECEEF2] font-mono tracking-wide">Recuperar senha</h2>
            <p className="text-xs text-[#A7ADB8] font-mono mt-1">Enviaremos um link para seu email</p>
          </div>
        </div>

        <div className="bg-[#14161B] border border-[#232733] rounded-2xl p-6 sm:p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#232733] flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-[#ECEEF2]" />
              </div>
              <h3 className="text-lg font-medium text-[#ECEEF2]">Email enviado</h3>
              <p className="text-sm text-[#A7ADB8]">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
              <Button onClick={onBack} variant="outline" className="w-full border-[#232733] text-[#ECEEF2] h-11">
                Voltar ao login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-xs text-[#A7ADB8]">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0E0F12] border-[#232733] text-[#ECEEF2] text-sm placeholder:text-[#A7ADB8]/40"
                  autoComplete="email"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-[#ECEEF2] hover:bg-[#A7ADB8] text-[#0E0F12] text-sm font-medium h-11">
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
