export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      action_logs: {
        Row: {
          action: Database["public"]["Enums"]["vyr_action"]
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["vyr_action"]
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["vyr_action"]
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      checkpoints: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      computed_states: {
        Row: {
          action_reason: string | null
          clareza: number | null
          created_at: string | null
          date: string
          dominant_pillar: string | null
          energia: number | null
          estabilidade: number | null
          id: string
          limiting_pillar: string | null
          recommended_action: Database["public"]["Enums"]["vyr_action"] | null
          state_label: string | null
          user_id: string
          vyr_score: number | null
        }
        Insert: {
          action_reason?: string | null
          clareza?: number | null
          created_at?: string | null
          date: string
          dominant_pillar?: string | null
          energia?: number | null
          estabilidade?: number | null
          id?: string
          limiting_pillar?: string | null
          recommended_action?: Database["public"]["Enums"]["vyr_action"] | null
          state_label?: string | null
          user_id: string
          vyr_score?: number | null
        }
        Update: {
          action_reason?: string | null
          clareza?: number | null
          created_at?: string | null
          date?: string
          dominant_pillar?: string | null
          energia?: number | null
          estabilidade?: number | null
          id?: string
          limiting_pillar?: string | null
          recommended_action?: Database["public"]["Enums"]["vyr_action"] | null
          state_label?: string | null
          user_id?: string
          vyr_score?: number | null
        }
        Relationships: []
      }
      daily_reviews: {
        Row: {
          closing_line: string | null
          created_at: string | null
          date: string
          id: string
          narrative_end: string | null
          narrative_middle: string | null
          narrative_start: string | null
          user_id: string
          value_generated: string | null
        }
        Insert: {
          closing_line?: string | null
          created_at?: string | null
          date: string
          id?: string
          narrative_end?: string | null
          narrative_middle?: string | null
          narrative_start?: string | null
          user_id: string
          value_generated?: string | null
        }
        Update: {
          closing_line?: string | null
          created_at?: string | null
          date?: string
          id?: string
          narrative_end?: string | null
          narrative_middle?: string | null
          narrative_start?: string | null
          user_id?: string
          value_generated?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          id: string
          insights_enabled: boolean
          push_enabled: boolean
          reminders_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          insights_enabled?: boolean
          push_enabled?: boolean
          reminders_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          insights_enabled?: boolean
          push_enabled?: boolean
          reminders_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      participantes: {
        Row: {
          altura_cm: number | null
          avatar_url: string | null
          codigo: string
          condicoes_saude: string[] | null
          consumo_alcool: string | null
          consumo_cafeina: string | null
          created_at: string | null
          data_nascimento: string
          frequencia_exercicio: string | null
          horario_acordar: string | null
          horario_dormir: string | null
          horas_sono_media: number | null
          id: string
          medicamentos_uso: string | null
          nivel_estresse_geral: number | null
          nivel_experiencia_suplementos: string | null
          nome_publico: string
          objetivo_principal: string | null
          onboarding_completo: boolean | null
          onboarding_etapa: number | null
          perfil_atividade:
            | Database["public"]["Enums"]["perfil_atividade"]
            | null
          peso_kg: number | null
          pratica_exercicio: boolean | null
          qualidade_sono_geral: number | null
          rotina_trabalho: Database["public"]["Enums"]["rotina_trabalho"] | null
          sexo: Database["public"]["Enums"]["sexo_tipo"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          altura_cm?: number | null
          avatar_url?: string | null
          codigo: string
          condicoes_saude?: string[] | null
          consumo_alcool?: string | null
          consumo_cafeina?: string | null
          created_at?: string | null
          data_nascimento?: string
          frequencia_exercicio?: string | null
          horario_acordar?: string | null
          horario_dormir?: string | null
          horas_sono_media?: number | null
          id?: string
          medicamentos_uso?: string | null
          nivel_estresse_geral?: number | null
          nivel_experiencia_suplementos?: string | null
          nome_publico: string
          objetivo_principal?: string | null
          onboarding_completo?: boolean | null
          onboarding_etapa?: number | null
          perfil_atividade?:
            | Database["public"]["Enums"]["perfil_atividade"]
            | null
          peso_kg?: number | null
          pratica_exercicio?: boolean | null
          qualidade_sono_geral?: number | null
          rotina_trabalho?:
            | Database["public"]["Enums"]["rotina_trabalho"]
            | null
          sexo?: Database["public"]["Enums"]["sexo_tipo"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          altura_cm?: number | null
          avatar_url?: string | null
          codigo?: string
          condicoes_saude?: string[] | null
          consumo_alcool?: string | null
          consumo_cafeina?: string | null
          created_at?: string | null
          data_nascimento?: string
          frequencia_exercicio?: string | null
          horario_acordar?: string | null
          horario_dormir?: string | null
          horas_sono_media?: number | null
          id?: string
          medicamentos_uso?: string | null
          nivel_estresse_geral?: number | null
          nivel_experiencia_suplementos?: string | null
          nome_publico?: string
          objetivo_principal?: string | null
          onboarding_completo?: boolean | null
          onboarding_etapa?: number | null
          perfil_atividade?:
            | Database["public"]["Enums"]["perfil_atividade"]
            | null
          peso_kg?: number | null
          pratica_exercicio?: boolean | null
          qualidade_sono_geral?: number | null
          rotina_trabalho?:
            | Database["public"]["Enums"]["rotina_trabalho"]
            | null
          sexo?: Database["public"]["Enums"]["sexo_tipo"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          user_id?: string
        }
        Relationships: []
      }
      referencias_populacionais: {
        Row: {
          faixa_max: number
          faixa_min: number
          id: string
          idade_max: number | null
          idade_min: number | null
          metrica: string
          sexo: Database["public"]["Enums"]["sexo_tipo"] | null
        }
        Insert: {
          faixa_max: number
          faixa_min: number
          id?: string
          idade_max?: number | null
          idade_min?: number | null
          metrica: string
          sexo?: Database["public"]["Enums"]["sexo_tipo"] | null
        }
        Update: {
          faixa_max?: number
          faixa_min?: number
          id?: string
          idade_max?: number | null
          idade_min?: number | null
          metrica?: string
          sexo?: Database["public"]["Enums"]["sexo_tipo"] | null
        }
        Relationships: []
      }
      registros_dose: {
        Row: {
          created_at: string | null
          data: string
          efeito_indesejado: Database["public"]["Enums"]["severidade"] | null
          escala_1: number | null
          escala_2: number | null
          escala_3: number | null
          horario_tomada: string | null
          id: string
          janela: Database["public"]["Enums"]["janela_dose"]
          observacoes: string | null
          participante_id: string
          sintomas: string[] | null
          tomou: boolean | null
        }
        Insert: {
          created_at?: string | null
          data: string
          efeito_indesejado?: Database["public"]["Enums"]["severidade"] | null
          escala_1?: number | null
          escala_2?: number | null
          escala_3?: number | null
          horario_tomada?: string | null
          id?: string
          janela: Database["public"]["Enums"]["janela_dose"]
          observacoes?: string | null
          participante_id: string
          sintomas?: string[] | null
          tomou?: boolean | null
        }
        Update: {
          created_at?: string | null
          data?: string
          efeito_indesejado?: Database["public"]["Enums"]["severidade"] | null
          escala_1?: number | null
          escala_2?: number | null
          escala_3?: number | null
          horario_tomada?: string | null
          id?: string
          janela?: Database["public"]["Enums"]["janela_dose"]
          observacoes?: string | null
          participante_id?: string
          sintomas?: string[] | null
          tomou?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_dose_participante_id_fkey"
            columns: ["participante_id"]
            isOneToOne: false
            referencedRelation: "participantes"
            referencedColumns: ["id"]
          },
        ]
      }
      resumos_diarios: {
        Row: {
          cafeina_doses: number | null
          created_at: string | null
          data: string
          despertares: number | null
          estresse_dia: number | null
          id: string
          latencia_sono_min: number | null
          participante_id: string
          qualidade_sono: number | null
          recuperacao_ao_acordar: number | null
          sonolencia_diurna: number | null
        }
        Insert: {
          cafeina_doses?: number | null
          created_at?: string | null
          data: string
          despertares?: number | null
          estresse_dia?: number | null
          id?: string
          latencia_sono_min?: number | null
          participante_id: string
          qualidade_sono?: number | null
          recuperacao_ao_acordar?: number | null
          sonolencia_diurna?: number | null
        }
        Update: {
          cafeina_doses?: number | null
          created_at?: string | null
          data?: string
          despertares?: number | null
          estresse_dia?: number | null
          id?: string
          latencia_sono_min?: number | null
          participante_id?: string
          qualidade_sono?: number | null
          recuperacao_ao_acordar?: number | null
          sonolencia_diurna?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "resumos_diarios_participante_id_fkey"
            columns: ["participante_id"]
            isOneToOne: false
            referencedRelation: "participantes"
            referencedColumns: ["id"]
          },
        ]
      }
      ring_daily_data: {
        Row: {
          created_at: string | null
          day: string
          id: string
          metrics: Json | null
          source_provider: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day: string
          id?: string
          metrics?: Json | null
          source_provider?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          day?: string
          id?: string
          metrics?: Json | null
          source_provider?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_baselines: {
        Row: {
          computed_at: string | null
          days_used: number | null
          hrv_mean: number | null
          hrv_std: number | null
          id: string
          rhr_mean: number | null
          rhr_std: number | null
          sleep_duration_mean: number | null
          sleep_duration_std: number | null
          sleep_quality_mean: number | null
          sleep_quality_std: number | null
          spo2_mean: number | null
          spo2_std: number | null
          stress_mean: number | null
          stress_std: number | null
          temp_mean: number | null
          temp_std: number | null
          user_id: string
        }
        Insert: {
          computed_at?: string | null
          days_used?: number | null
          hrv_mean?: number | null
          hrv_std?: number | null
          id?: string
          rhr_mean?: number | null
          rhr_std?: number | null
          sleep_duration_mean?: number | null
          sleep_duration_std?: number | null
          sleep_quality_mean?: number | null
          sleep_quality_std?: number | null
          spo2_mean?: number | null
          spo2_std?: number | null
          stress_mean?: number | null
          stress_std?: number | null
          temp_mean?: number | null
          temp_std?: number | null
          user_id: string
        }
        Update: {
          computed_at?: string | null
          days_used?: number | null
          hrv_mean?: number | null
          hrv_std?: number | null
          id?: string
          rhr_mean?: number | null
          rhr_std?: number | null
          sleep_duration_mean?: number | null
          sleep_duration_std?: number | null
          sleep_quality_mean?: number | null
          sleep_quality_std?: number | null
          spo2_mean?: number | null
          spo2_std?: number | null
          stress_mean?: number | null
          stress_std?: number | null
          temp_mean?: number | null
          temp_std?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_consents: {
        Row: {
          accepted_privacy: boolean | null
          accepted_terms: boolean | null
          consent_version: string
          created_at: string | null
          id: string
          legal_basis: string | null
          scope: Json | null
          user_id: string
        }
        Insert: {
          accepted_privacy?: boolean | null
          accepted_terms?: boolean | null
          consent_version: string
          created_at?: string | null
          id?: string
          legal_basis?: string | null
          scope?: Json | null
          user_id: string
        }
        Update: {
          accepted_privacy?: boolean | null
          accepted_terms?: boolean | null
          consent_version?: string
          created_at?: string | null
          id?: string
          legal_basis?: string | null
          scope?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          external_user_id: string | null
          id: string
          last_error: string | null
          last_sync_at: string | null
          meta: Json | null
          provider: string
          refresh_token: string | null
          scopes: string[] | null
          status: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          external_user_id?: string | null
          id?: string
          last_error?: string | null
          last_sync_at?: string | null
          meta?: Json | null
          provider: string
          refresh_token?: string | null
          scopes?: string[] | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          external_user_id?: string | null
          id?: string
          last_error?: string | null
          last_sync_at?: string | null
          meta?: Json | null
          provider?: string
          refresh_token?: string | null
          scopes?: string[] | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          error: string | null
          event_type: string | null
          id: string
          idempotency_key: string | null
          payload_hash: string | null
          provider: string
          signature_valid: boolean | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          event_type?: string | null
          id?: string
          idempotency_key?: string | null
          payload_hash?: string | null
          provider: string
          signature_valid?: boolean | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error?: string | null
          event_type?: string | null
          id?: string
          idempotency_key?: string | null
          payload_hash?: string | null
          provider?: string
          signature_valid?: boolean | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      janela_dose: "DIA" | "TARDE" | "NOITE"
      perfil_atividade:
        | "CONDUCAO"
        | "ANALISE"
        | "ENSINO"
        | "EXECUCAO"
        | "CRIACAO"
      rotina_trabalho: "REUNIOES" | "FOCO" | "MISTO"
      severidade: "NENHUM" | "LEVE" | "MODERADO" | "FORTE"
      sexo_tipo: "MASCULINO" | "FEMININO" | "OUTRO" | "NAO_INFORMAR"
      vyr_action: "BOOT" | "HOLD" | "CLEAR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      janela_dose: ["DIA", "TARDE", "NOITE"],
      perfil_atividade: [
        "CONDUCAO",
        "ANALISE",
        "ENSINO",
        "EXECUCAO",
        "CRIACAO",
      ],
      rotina_trabalho: ["REUNIOES", "FOCO", "MISTO"],
      severidade: ["NENHUM", "LEVE", "MODERADO", "FORTE"],
      sexo_tipo: ["MASCULINO", "FEMININO", "OUTRO", "NAO_INFORMAR"],
      vyr_action: ["BOOT", "HOLD", "CLEAR"],
    },
  },
} as const
