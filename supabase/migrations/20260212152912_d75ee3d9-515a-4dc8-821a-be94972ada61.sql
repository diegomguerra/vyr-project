
-- ============================================================
-- VYR Full Supabase Stack
-- New tables + RLS + Trigger + User Roles
-- ============================================================

-- 1. ENUM for VYR actions
CREATE TYPE public.vyr_action AS ENUM ('BOOT', 'HOLD', 'CLEAR');

-- 2. ENUM for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 3. ENUM for sexo
CREATE TYPE public.sexo_tipo AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMAR');

-- 4. ENUM for perfil_atividade
CREATE TYPE public.perfil_atividade AS ENUM ('CONDUCAO', 'ANALISE', 'ENSINO', 'EXECUCAO', 'CRIACAO');

-- 5. ENUM for rotina_trabalho
CREATE TYPE public.rotina_trabalho AS ENUM ('REUNIOES', 'FOCO', 'MISTO');

-- 6. ENUM for janela_dose
CREATE TYPE public.janela_dose AS ENUM ('DIA', 'TARDE', 'NOITE');

-- 7. ENUM for severidade
CREATE TYPE public.severidade AS ENUM ('NENHUM', 'LEVE', 'MODERADO', 'FORTE');

-- ============================================================
-- EXISTING TABLES (recreated for new Cloud project)
-- ============================================================

-- participantes
CREATE TABLE public.participantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  codigo TEXT NOT NULL,
  nome_publico TEXT NOT NULL,
  sexo sexo_tipo DEFAULT 'NAO_INFORMAR',
  data_nascimento DATE NOT NULL DEFAULT '1990-01-01',
  altura_cm REAL,
  peso_kg REAL,
  perfil_atividade perfil_atividade,
  rotina_trabalho rotina_trabalho,
  objetivo_principal TEXT,
  nivel_experiencia_suplementos TEXT,
  condicoes_saude TEXT[],
  medicamentos_uso TEXT,
  pratica_exercicio BOOLEAN,
  frequencia_exercicio TEXT,
  consumo_cafeina TEXT,
  consumo_alcool TEXT,
  horario_dormir TEXT,
  horario_acordar TEXT,
  horas_sono_media REAL,
  qualidade_sono_geral INT,
  nivel_estresse_geral INT,
  onboarding_etapa INT DEFAULT 0,
  onboarding_completo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.participantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own participante"
  ON public.participantes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own participante"
  ON public.participantes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own participante"
  ON public.participantes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- referencias_populacionais
CREATE TABLE public.referencias_populacionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metrica TEXT NOT NULL,
  sexo sexo_tipo,
  idade_min INT,
  idade_max INT,
  faixa_min REAL NOT NULL,
  faixa_max REAL NOT NULL
);

ALTER TABLE public.referencias_populacionais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read referencias"
  ON public.referencias_populacionais FOR SELECT
  TO authenticated
  USING (true);

-- registros_dose
CREATE TABLE public.registros_dose (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participante_id UUID REFERENCES public.participantes(id) ON DELETE CASCADE NOT NULL,
  data DATE NOT NULL,
  janela janela_dose NOT NULL,
  tomou BOOLEAN DEFAULT false,
  horario_tomada TEXT,
  escala_1 INT,
  escala_2 INT,
  escala_3 INT,
  efeito_indesejado severidade DEFAULT 'NENHUM',
  sintomas TEXT[],
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (participante_id, data, janela)
);

ALTER TABLE public.registros_dose ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own registros_dose"
  ON public.registros_dose FOR ALL
  TO authenticated
  USING (participante_id IN (SELECT id FROM public.participantes WHERE user_id = auth.uid()))
  WITH CHECK (participante_id IN (SELECT id FROM public.participantes WHERE user_id = auth.uid()));

-- resumos_diarios
CREATE TABLE public.resumos_diarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participante_id UUID REFERENCES public.participantes(id) ON DELETE CASCADE NOT NULL,
  data DATE NOT NULL,
  latencia_sono_min INT,
  despertares INT,
  qualidade_sono INT,
  recuperacao_ao_acordar INT,
  sonolencia_diurna INT,
  estresse_dia INT,
  cafeina_doses INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (participante_id, data)
);

ALTER TABLE public.resumos_diarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own resumos_diarios"
  ON public.resumos_diarios FOR ALL
  TO authenticated
  USING (participante_id IN (SELECT id FROM public.participantes WHERE user_id = auth.uid()))
  WITH CHECK (participante_id IN (SELECT id FROM public.participantes WHERE user_id = auth.uid()));

-- ring_daily_data
CREATE TABLE public.ring_daily_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  day DATE NOT NULL,
  source_provider TEXT DEFAULT 'qring',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, day, source_provider)
);

ALTER TABLE public.ring_daily_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own ring_daily_data"
  ON public.ring_daily_data FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- user_integrations
CREATE TABLE public.user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  provider TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  external_user_id TEXT,
  scopes TEXT[] DEFAULT '{}',
  meta JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own user_integrations"
  ON public.user_integrations FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- user_consents
CREATE TABLE public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  consent_version TEXT NOT NULL,
  accepted_terms BOOLEAN DEFAULT false,
  accepted_privacy BOOLEAN DEFAULT false,
  legal_basis TEXT DEFAULT 'consent',
  scope JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own user_consents"
  ON public.user_consents FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- webhook_logs
CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_type TEXT,
  signature_valid BOOLEAN DEFAULT false,
  payload_hash TEXT,
  idempotency_key TEXT,
  user_id UUID,
  status TEXT DEFAULT 'received',
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for webhook_logs"
  ON public.webhook_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- NEW TABLES
-- ============================================================

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- user_baselines
CREATE TABLE public.user_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  computed_at TIMESTAMPTZ DEFAULT now(),
  rhr_mean REAL, rhr_std REAL,
  hrv_mean REAL, hrv_std REAL,
  sleep_duration_mean REAL, sleep_duration_std REAL,
  sleep_quality_mean REAL, sleep_quality_std REAL,
  stress_mean REAL, stress_std REAL,
  spo2_mean REAL, spo2_std REAL,
  temp_mean REAL, temp_std REAL,
  days_used INT DEFAULT 0
);

ALTER TABLE public.user_baselines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own baselines"
  ON public.user_baselines FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- checkpoints
CREATE TABLE public.checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  note TEXT
);

ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own checkpoints"
  ON public.checkpoints FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- action_logs
CREATE TABLE public.action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action vyr_action NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own action_logs"
  ON public.action_logs FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- daily_reviews
CREATE TABLE public.daily_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  narrative_start TEXT,
  narrative_middle TEXT,
  narrative_end TEXT,
  value_generated TEXT,
  closing_line TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.daily_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own daily_reviews"
  ON public.daily_reviews FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- computed_states
CREATE TABLE public.computed_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  vyr_score REAL,
  state_label TEXT,
  energia REAL,
  clareza REAL,
  estabilidade REAL,
  dominant_pillar TEXT,
  limiting_pillar TEXT,
  recommended_action vyr_action,
  action_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, date)
);

ALTER TABLE public.computed_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own computed_states"
  ON public.computed_states FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- TRIGGER: Auto-create participante + role on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.participantes (user_id, codigo, nome_publico, sexo, data_nascimento)
  VALUES (
    NEW.id,
    'P' || floor(100 + random() * 900)::int,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    'NAO_INFORMAR',
    '1990-01-01'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_participantes_user ON public.participantes(user_id);
CREATE INDEX idx_ring_daily_data_user ON public.ring_daily_data(user_id);
CREATE INDEX idx_user_baselines_user ON public.user_baselines(user_id);
CREATE INDEX idx_checkpoints_user ON public.checkpoints(user_id);
CREATE INDEX idx_action_logs_user ON public.action_logs(user_id);
CREATE INDEX idx_daily_reviews_user_date ON public.daily_reviews(user_id, date);
CREATE INDEX idx_computed_states_user_date ON public.computed_states(user_id, date);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_participantes_updated_at
  BEFORE UPDATE ON public.participantes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ring_daily_data_updated_at
  BEFORE UPDATE ON public.ring_daily_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
