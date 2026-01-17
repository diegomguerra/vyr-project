import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParticipanteData {
  objetivo_principal: string | null;
  perfil_atividade: string | null;
  rotina_trabalho: string | null;
  qualidade_sono_geral: number | null;
  nivel_estresse_geral: number | null;
  horas_sono_media: number | null;
  consumo_cafeina: string | null;
  consumo_alcool: string | null;
  frequencia_exercicio: string | null;
  condicoes_saude: string[] | null;
}

interface MetricsData {
  diaBaseline: number | null;
  diaAtual: number | null;
  tardeBaseline: number | null;
  tardeAtual: number | null;
  sonoBaseline: number | null;
  sonoAtual: number | null;
  diasAcompanhamento: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { participante, metrics } = await req.json() as { 
      participante: ParticipanteData; 
      metrics: MetricsData;
    };

    console.log('Generating insights for user:', user.id);
    console.log('Participante data:', JSON.stringify(participante));
    console.log('Metrics data:', JSON.stringify(metrics));

    const systemPrompt = `Você é um especialista em otimização cognitiva e bem-estar. Analise os dados do usuário e forneça insights personalizados.

REGRAS IMPORTANTES:
- Seja direto e prático
- Máximo 3-4 insights
- Cada insight deve ter: título curto, descrição de 1-2 frases, e tipo (positivo, atencao, neutro)
- Baseie-se nos dados reais fornecidos
- Considere correlações entre sono, estresse, foco e hábitos
- Não invente dados que não foram fornecidos
- Use linguagem acessível, evite jargões técnicos

FORMATO DE RESPOSTA (JSON):
{
  "insights": [
    {
      "titulo": "Título curto",
      "descricao": "Descrição prática do insight",
      "tipo": "positivo|atencao|neutro",
      "categoria": "sono|foco|estresse|habitos|geral"
    }
  ],
  "resumo": "Uma frase resumindo o estado geral do usuário"
}`;

    const userPrompt = `Analise os seguintes dados do usuário e gere insights personalizados:

PERFIL DO USUÁRIO:
- Objetivo principal: ${participante.objetivo_principal || 'Não informado'}
- Perfil de atividade: ${participante.perfil_atividade || 'Não informado'}
- Rotina de trabalho: ${participante.rotina_trabalho || 'Não informado'}
- Qualidade de sono (anamnese): ${participante.qualidade_sono_geral ?? 'Não informado'}/10
- Nível de estresse (anamnese): ${participante.nivel_estresse_geral ?? 'Não informado'}/10
- Horas de sono médias: ${participante.horas_sono_media ?? 'Não informado'}h
- Consumo de cafeína: ${participante.consumo_cafeina || 'Não informado'}
- Consumo de álcool: ${participante.consumo_alcool || 'Não informado'}
- Frequência de exercício: ${participante.frequencia_exercicio || 'Não informado'}
- Condições de saúde: ${participante.condicoes_saude?.join(', ') || 'Nenhuma informada'}

MÉTRICAS DE ACOMPANHAMENTO (${metrics.diasAcompanhamento} dias):
- Clareza mental (dia): Baseline ${metrics.diaBaseline ?? '—'} → Atual ${metrics.diaAtual ?? '—'}
- Foco (tarde): Baseline ${metrics.tardeBaseline ?? '—'} → Atual ${metrics.tardeAtual ?? '—'}  
- Qualidade do sono: Baseline ${metrics.sonoBaseline ?? '—'} → Atual ${metrics.sonoAtual ?? '—'}

Gere insights relevantes baseados nesses dados. Se houver pouca evolução ou dados insuficientes, sugira o que o usuário pode fazer para melhorar o acompanhamento.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Limite de requisições atingido. Tente novamente em alguns minutos.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Créditos insuficientes para gerar insights.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response:', content);

    // Parse JSON from response (handle markdown code blocks)
    let parsedContent;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch?.[1] || jsonMatch?.[0] || content;
      parsedContent = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      parsedContent = {
        insights: [{
          titulo: "Continue registrando",
          descricao: "Precisamos de mais dados para gerar insights personalizados. Continue fazendo seus registros diários.",
          tipo: "neutro",
          categoria: "geral"
        }],
        resumo: "Aguardando mais dados para análise completa."
      };
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-insights:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Erro ao gerar insights' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
