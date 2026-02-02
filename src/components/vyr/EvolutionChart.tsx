// VYR Labs - Gráfico de Evolução
// Linha/área mostrando VYR State dos últimos dias

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { HistoryDay } from "@/lib/vyr-types";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface EvolutionChartProps {
  /** Dados do histórico */
  history: HistoryDay[];
  /** Altura do gráfico */
  height?: number;
}

export function EvolutionChart({ 
  history, 
  height = 160 
}: EvolutionChartProps) {
  // Preparar dados para o gráfico (invertido para mostrar mais antigo primeiro)
  const chartData = useMemo(() => {
    return [...history].reverse().map((day) => {
      const date = new Date(day.date);
      const dayName = date.toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3);
      return {
        date: day.date,
        dayName,
        score: day.score,
        state: day.dominantState,
      };
    });
  }, [history]);

  const chartConfig = {
    score: {
      label: "VYR State",
      color: "hsl(var(--vyr-accent-action))",
    },
  };

  // Calcular range para o Y axis
  const scores = chartData.map((d) => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const yMin = Math.max(0, minScore - 10);
  const yMax = Math.min(100, maxScore + 10);

  return (
    <div className="w-full bg-vyr-bg-surface rounded-2xl p-4 animate-stagger-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-vyr-text-muted text-xs font-medium tracking-wider uppercase">
          Últimos {chartData.length} dias
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-vyr-accent-action" />
          <span className="text-vyr-text-muted text-xs">VYR State</span>
        </div>
      </div>
      
      <ChartContainer config={chartConfig} className="w-full" style={{ height }}>
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="0%" 
                stopColor="hsl(var(--vyr-accent-action))" 
                stopOpacity={0.4} 
              />
              <stop 
                offset="100%" 
                stopColor="hsl(var(--vyr-accent-action))" 
                stopOpacity={0.05} 
              />
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="dayName"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--vyr-text-muted))", fontSize: 11 }}
            dy={8}
          />
          
          <YAxis 
            domain={[yMin, yMax]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "hsl(var(--vyr-text-muted))", fontSize: 11 }}
            tickCount={4}
          />
          
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                labelFormatter={(value, payload) => {
                  if (payload && payload[0]) {
                    const data = payload[0].payload;
                    return new Date(data.date).toLocaleDateString("pt-BR", { 
                      day: "2-digit", 
                      month: "long" 
                    });
                  }
                  return value;
                }}
              />
            }
          />
          
          <Area
            type="monotone"
            dataKey="score"
            stroke="hsl(var(--vyr-accent-action))"
            strokeWidth={2}
            fill="url(#scoreGradient)"
            dot={{
              fill: "hsl(var(--vyr-accent-action))",
              strokeWidth: 0,
              r: 3,
            }}
            activeDot={{
              fill: "hsl(var(--vyr-accent-action))",
              stroke: "hsl(var(--vyr-bg-primary))",
              strokeWidth: 2,
              r: 5,
            }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
