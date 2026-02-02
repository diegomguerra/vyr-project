// VYR Labs - Checkpoint (Modal/Página curta)
// Copy ajustado: "Como você percebe este momento agora?"

import { useState } from "react";
import { X } from "lucide-react";

interface CheckpointProps {
  onSave: (note?: string) => void;
  onDismiss: () => void;
}

export default function Checkpoint({ onSave, onDismiss }: CheckpointProps) {
  const [note, setNote] = useState("");

  const handleSave = () => {
    onSave(note.trim() || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-vyr-bg-surface rounded-t-3xl px-6 py-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-vyr-text-muted text-xs tracking-wider uppercase">
            Checkpoint do sistema
          </p>
          <button
            onClick={onDismiss}
            className="p-2 -mr-2 rounded-full transition-colors active:bg-vyr-bg-primary"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-vyr-text-muted" />
          </button>
        </div>

        {/* Pergunta principal */}
        <h2 className="text-vyr-text-primary text-lg font-medium mb-6">
          Como você percebe este momento agora?
        </h2>

        {/* Campo de observação */}
        <div className="mb-6">
          <label className="block text-vyr-text-muted text-sm mb-2">
            Observação (opcional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Descreva brevemente..."
            className="w-full h-24 px-4 py-3 bg-vyr-bg-primary border border-vyr-stroke-divider rounded-xl text-vyr-text-primary placeholder:text-vyr-text-muted resize-none focus:outline-none focus:border-vyr-accent-action transition-colors"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 px-4 py-3.5 rounded-xl border border-vyr-stroke-divider text-vyr-text-secondary font-medium transition-colors active:bg-vyr-bg-primary"
          >
            Agora não
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3.5 rounded-xl bg-vyr-accent-action text-white font-medium transition-all active:scale-[0.98] active:opacity-90"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}
