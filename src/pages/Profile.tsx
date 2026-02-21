// avoid stale auth in iOS WKWebView; ensure valid session before DB writes
import { useState, useEffect } from "react";
import { ChevronLeft, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { requireValidUserId } from "@/lib/auth-session";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/vyr/AvatarUpload";

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome_publico: "",
    data_nascimento: "",
    sexo: "NAO_INFORMAR",
    altura_cm: "",
    peso_kg: "",
    objetivo_principal: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("participantes")
      .select("nome_publico, data_nascimento, sexo, altura_cm, peso_kg, objetivo_principal, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setForm({
            nome_publico: data.nome_publico || "",
            data_nascimento: data.data_nascimento || "",
            sexo: data.sexo || "NAO_INFORMAR",
            altura_cm: data.altura_cm?.toString() || "",
            peso_kg: data.peso_kg?.toString() || "",
            objetivo_principal: data.objetivo_principal || "",
            avatar_url: (data as any).avatar_url || "",
          });
        }
        setLoading(false);
      });
  }, [user]);

  const handleSave = async () => {
    // avoid stale auth in iOS WKWebView; ensure valid session before DB writes
    const userId = await requireValidUserId();
    if (!userId) {
      toast({ title: "Sessão expirada", description: "Faça login novamente.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from("participantes")
        .update({
          nome_publico: form.nome_publico,
          data_nascimento: form.data_nascimento,
          sexo: form.sexo as any,
          altura_cm: form.altura_cm ? parseFloat(form.altura_cm) : null,
          peso_kg: form.peso_kg ? parseFloat(form.peso_kg) : null,
          objetivo_principal: form.objetivo_principal,
          avatar_url: form.avatar_url,
        } as any)
        .eq("user_id", userId);
      if (error) throw error;
      toast({ title: "Perfil salvo", description: "Dados atualizados com sucesso." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const sexOptions = [
    { value: "MASCULINO", label: "Masculino" },
    { value: "FEMININO", label: "Feminino" },
    { value: "OUTRO", label: "Outro" },
    { value: "NAO_INFORMAR", label: "Prefiro não informar" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-vyr-bg-primary flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-vyr-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vyr-bg-primary px-5 pt-6 pb-36 safe-area-top safe-area-left safe-area-right">
      <button onClick={onBack} className="flex items-center gap-1 text-vyr-text-muted mb-6 transition-opacity active:opacity-60">
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Voltar</span>
      </button>

      <h1 className="text-vyr-text-primary text-2xl font-semibold mb-6 animate-fade-in">Meu Perfil</h1>

      <div className="flex justify-center mb-6">
        <AvatarUpload
          currentUrl={form.avatar_url || null}
          onUploaded={(url) => setForm((f) => ({ ...f, avatar_url: url }))}
        />
      </div>

      <div className="space-y-4">
        <div className="bg-vyr-bg-surface rounded-2xl p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-vyr-text-muted">Nome público</Label>
            <Input
              value={form.nome_publico}
              onChange={(e) => setForm((f) => ({ ...f, nome_publico: e.target.value }))}
              className="bg-vyr-bg-primary border-vyr-stroke-divider text-vyr-text-primary text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-vyr-text-muted">Data de nascimento</Label>
            <Input
              type="date"
              value={form.data_nascimento}
              onChange={(e) => setForm((f) => ({ ...f, data_nascimento: e.target.value }))}
              className="bg-vyr-bg-primary border-vyr-stroke-divider text-vyr-text-primary text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-vyr-text-muted">Sexo</Label>
            <div className="grid grid-cols-2 gap-2">
              {sexOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm((f) => ({ ...f, sexo: opt.value }))}
                  className={`rounded-xl py-2.5 text-xs font-medium transition-all ${
                    form.sexo === opt.value
                      ? "bg-vyr-accent-action text-white"
                      : "bg-vyr-bg-primary text-vyr-text-secondary border border-vyr-stroke-divider"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs text-vyr-text-muted">Altura (cm)</Label>
              <Input
                type="number"
                value={form.altura_cm}
                onChange={(e) => setForm((f) => ({ ...f, altura_cm: e.target.value }))}
                className="bg-vyr-bg-primary border-vyr-stroke-divider text-vyr-text-primary text-sm"
                placeholder="175"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-vyr-text-muted">Peso (kg)</Label>
              <Input
                type="number"
                value={form.peso_kg}
                onChange={(e) => setForm((f) => ({ ...f, peso_kg: e.target.value }))}
                className="bg-vyr-bg-primary border-vyr-stroke-divider text-vyr-text-primary text-sm"
                placeholder="70"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-vyr-text-muted">Objetivo principal</Label>
            <Input
              value={form.objetivo_principal}
              onChange={(e) => setForm((f) => ({ ...f, objetivo_principal: e.target.value }))}
              className="bg-vyr-bg-primary border-vyr-stroke-divider text-vyr-text-primary text-sm"
              placeholder="Ex: Melhorar foco e concentração"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-vyr-accent-action hover:bg-vyr-accent-action/80 text-white h-12 rounded-xl font-medium"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}
