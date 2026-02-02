import { VYR_COLORS, VYR_LABELS, VYR_TYPOGRAPHY } from "@/brand";

export default function BrandExport() {
  return (
    <div 
      className="min-h-screen bg-white text-black print:bg-white"
      style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily }}
    >
      {/* Print styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-break { page-break-before: always; }
          .no-break { page-break-inside: avoid; }
        }
        @page { margin: 1.2cm; size: A4; }
      `}</style>

      <div className="max-w-4xl mx-auto p-8 print:p-0">
        
        {/* Cover Page */}
        <header className="text-center py-16 border-b-2 border-black mb-12 no-break">
          <p className="text-[10px] tracking-[0.5em] text-gray-400 mb-6" style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}>
            BRAND IDENTITY GUIDELINE
          </p>
          <h1 
            className="text-8xl tracking-[0.6em] mb-4"
            style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
          >
            VYR
          </h1>
          <p className="text-xs tracking-[0.3em] text-gray-500 mt-6" style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}>
            COGNITIVE INFRASTRUCTURE SYSTEM
          </p>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-[10px] text-gray-400 tracking-wider">
              Versão 1.0 · Janeiro 2026 · Documento Confidencial
            </p>
          </div>
        </header>

        {/* Table of Contents */}
        <section className="mb-16 no-break">
          <h2 className="text-xs tracking-[0.3em] text-gray-500 mb-6" style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}>
            ÍNDICE
          </h2>
          <div className="space-y-2 text-sm">
            {[
              { num: "01", title: "Marca Mãe — VYR" },
              { num: "02", title: "Sistema Tipográfico" },
              { num: "03", title: "Paleta de Cores" },
              { num: "04", title: "Sistema de Labels" },
              { num: "05", title: "Cores dos Produtos" },
              { num: "06", title: "Embalagens — Sachets" },
              { num: "07", title: "Embalagens — Caixas" },
              { num: "08", title: "VYR NODE — Hardware" },
              { num: "09", title: "Hierarquia Visual" },
              { num: "10", title: "Princípios de Design" },
              { num: "11", title: "Aplicações" },
              { num: "12", title: "Checklist de Validação" },
            ].map((item) => (
              <div key={item.num} className="flex items-baseline gap-4 py-1 border-b border-gray-100">
                <span className="text-gray-300 font-mono text-xs">{item.num}</span>
                <span className="text-gray-600">{item.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 1: Logo */}
        <section className="mb-16 page-break no-break">
          <SectionHeader number="01" title="MARCA MÃE — VYR" />
          
          <div className="mt-8 space-y-8">
            {/* Logo on dark */}
            <div>
              <p className="text-xs text-gray-500 mb-3">Versão primária (fundo escuro)</p>
              <div className="bg-black text-white p-16 text-center">
                <span 
                  className="text-6xl tracking-[0.5em]"
                  style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
                >
                  VYR
                </span>
              </div>
            </div>

            {/* Logo on light */}
            <div>
              <p className="text-xs text-gray-500 mb-3">Versão secundária (fundo claro)</p>
              <div className="bg-gray-100 text-black p-16 text-center border">
                <span 
                  className="text-6xl tracking-[0.5em]"
                  style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
                >
                  VYR
                </span>
              </div>
            </div>
            
            {/* Logo specs */}
            <div className="grid grid-cols-2 gap-8 mt-8 p-6 bg-gray-50">
              <div>
                <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">ESPECIFICAÇÕES</h4>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li><span className="text-gray-400">Fonte:</span> JetBrains Mono</li>
                  <li><span className="text-gray-400">Peso:</span> Medium (500)</li>
                  <li><span className="text-gray-400">Letter-spacing:</span> 0.35em</li>
                  <li><span className="text-gray-400">Caixa:</span> Alta (maiúsculas)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">REGRAS DE USO</h4>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span> Sem ícones ou símbolos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span> Sem ilustrações
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">✗</span> Sem gradientes no logo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span> Puramente tipográfico
                  </li>
                </ul>
              </div>
            </div>

            {/* Clear space */}
            <div>
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">ÁREA DE PROTEÇÃO</h4>
              <div className="bg-gray-100 p-8 inline-block">
                <div className="border-2 border-dashed border-gray-300 p-8">
                  <span 
                    className="text-3xl tracking-[0.5em] text-black"
                    style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
                  >
                    VYR
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Manter margem mínima equivalente à altura da letra "V" em todos os lados.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Typography */}
        <section className="mb-16 page-break no-break">
          <SectionHeader number="02" title="SISTEMA TIPOGRÁFICO" />
          
          <div className="mt-8 space-y-10">
            {/* Primary typeface */}
            <div className="border-b pb-8">
              <div className="flex items-baseline justify-between mb-6">
                <h4 className="text-xs tracking-wider text-gray-500 font-medium">TIPOGRAFIA PRIMÁRIA — LOGO & LABELS</h4>
                <span className="text-xs text-gray-400">JetBrains Mono</span>
              </div>
              <p 
                className="text-4xl tracking-[0.3em] mb-4"
                style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
              >
                ABCDEFGHIJKLM
              </p>
              <p 
                className="text-4xl tracking-[0.3em] mb-4"
                style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
              >
                NOPQRSTUVWXYZ
              </p>
              <p 
                className="text-2xl tracking-[0.2em] text-gray-500 mb-6"
                style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
              >
                0123456789
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-sm p-4 bg-gray-50">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Peso</p>
                  <p className="font-medium">Medium (500)</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Letter-spacing</p>
                  <p className="font-medium">0.35em</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Uso</p>
                  <p className="font-medium">Logo, labels, títulos</p>
                </div>
              </div>
            </div>
            
            {/* Secondary typeface */}
            <div>
              <div className="flex items-baseline justify-between mb-6">
                <h4 className="text-xs tracking-wider text-gray-500 font-medium">TIPOGRAFIA SECUNDÁRIA — CORPO</h4>
                <span className="text-xs text-gray-400">Inter</span>
              </div>
              <p className="text-2xl mb-4" style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </p>
              <p className="text-2xl mb-4" style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily }}>
                abcdefghijklmnopqrstuvwxyz
              </p>
              <p className="text-xl text-gray-500 mb-6" style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily }}>
                0123456789 !@#$%^&*()
              </p>

              <div className="grid grid-cols-4 gap-4 text-sm p-4 bg-gray-50">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Regular</p>
                  <p style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily, fontWeight: 400 }}>Aa Bb Cc</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Medium</p>
                  <p style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily, fontWeight: 500 }}>Aa Bb Cc</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Semibold</p>
                  <p style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily, fontWeight: 600 }}>Aa Bb Cc</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Bold</p>
                  <p style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily, fontWeight: 700 }}>Aa Bb Cc</p>
                </div>
              </div>
            </div>

            {/* Typography hierarchy */}
            <div className="p-6 bg-gray-50">
              <h4 className="text-xs tracking-wider text-gray-500 mb-6 font-medium">HIERARQUIA TIPOGRÁFICA</h4>
              <div className="space-y-4">
                <div className="flex items-baseline gap-8">
                  <span className="text-xs text-gray-400 w-20">H1</span>
                  <span className="text-4xl font-medium" style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}>VYR SYSTEM</span>
                </div>
                <div className="flex items-baseline gap-8">
                  <span className="text-xs text-gray-400 w-20">H2</span>
                  <span className="text-2xl font-medium" style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}>Seção Principal</span>
                </div>
                <div className="flex items-baseline gap-8">
                  <span className="text-xs text-gray-400 w-20">H3</span>
                  <span className="text-lg font-medium" style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily }}>Subtítulo</span>
                </div>
                <div className="flex items-baseline gap-8">
                  <span className="text-xs text-gray-400 w-20">Body</span>
                  <span className="text-base" style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily }}>Texto de corpo regular</span>
                </div>
                <div className="flex items-baseline gap-8">
                  <span className="text-xs text-gray-400 w-20">Small</span>
                  <span className="text-sm text-gray-600" style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily }}>Texto auxiliar</span>
                </div>
                <div className="flex items-baseline gap-8">
                  <span className="text-xs text-gray-400 w-20">Caption</span>
                  <span className="text-xs text-gray-500 tracking-wider uppercase" style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}>Label técnico</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Color Palette */}
        <section className="mb-16 page-break no-break">
          <SectionHeader number="03" title="PALETA DE CORES" />
          
          <div className="mt-8 space-y-8">
            {/* Core colors */}
            <div>
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">CORES FUNDAMENTAIS</h4>
              <div className="grid grid-cols-2 gap-4">
                <ColorSwatchLarge name="BLACK" hex={VYR_COLORS.black} description="Fundo principal, textos" />
                <ColorSwatchLarge name="WHITE" hex={VYR_COLORS.white} description="Fundo claro, textos invertidos" />
              </div>
            </div>

            {/* Gray scale */}
            <div>
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">ESCALA DE CINZAS</h4>
              <div className="grid grid-cols-6 gap-2">
                <ColorSwatch name="100" hex={VYR_COLORS.gray[100]} color={VYR_COLORS.gray[100]} light />
                <ColorSwatch name="200" hex={VYR_COLORS.gray[200]} color={VYR_COLORS.gray[200]} light />
                <ColorSwatch name="300" hex={VYR_COLORS.gray[300]} color={VYR_COLORS.gray[300]} light />
                <ColorSwatch name="400" hex={VYR_COLORS.gray[400]} color={VYR_COLORS.gray[400]} />
                <ColorSwatch name="500" hex={VYR_COLORS.gray[500]} color={VYR_COLORS.gray[500]} />
                <ColorSwatch name="600" hex={VYR_COLORS.gray[600]} color={VYR_COLORS.gray[600]} />
              </div>
              <div className="grid grid-cols-6 gap-2 mt-2">
                <ColorSwatch name="700" hex={VYR_COLORS.gray[700]} color={VYR_COLORS.gray[700]} />
                <ColorSwatch name="800" hex={VYR_COLORS.gray[800]} color={VYR_COLORS.gray[800]} />
                <ColorSwatch name="900" hex={VYR_COLORS.gray[900]} color={VYR_COLORS.gray[900]} />
                <ColorSwatch name="Cold Blue" hex={VYR_COLORS.coldBlue} color={VYR_COLORS.coldBlue} />
                <div></div>
                <div></div>
              </div>
            </div>

            {/* Color restrictions */}
            <div className="p-6 bg-gray-50">
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">RESTRIÇÕES CROMÁTICAS</h4>
              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="font-medium mb-2 text-red-700">✗ Evitar</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Gradientes emocionais</li>
                    <li>• Roxo, rosa ou cores vibrantes</li>
                    <li>• Cores com alta saturação</li>
                    <li>• Paletas "wellness" ou "lifestyle"</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2 text-green-700">✓ Priorizar</p>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Neutralidade técnica</li>
                    <li>• Contraste funcional</li>
                    <li>• Sobriedade cromática</li>
                    <li>• Cores que não "gritam"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Label System */}
        <section className="mb-16 no-break">
          <SectionHeader number="04" title="SISTEMA DE LABELS" />
          
          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-6">
              Labels são identificadores funcionais, não marcas independentes. Seguem a mesma tipografia da marca mãe, 
              posicionados após o prefixo VYR.
            </p>

            {/* Migration table */}
            <div className="mb-8">
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">MIGRAÇÃO DE NOMENCLATURA</h4>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-black">
                    <th className="text-left py-3 pr-4">ANTIGO</th>
                    <th className="text-left py-3 pr-4">ATUAL</th>
                    <th className="text-left py-3">COR ASSOCIADA</th>
                  </tr>
                </thead>
                <tbody>
                  <LabelRow old="NZT Dia" newLabel="VYR BOOT" color={VYR_COLORS.gray[100]} colorName="Gray 100" />
                  <LabelRow old="NZT Tarde" newLabel="VYR HOLD" color={VYR_COLORS.gray[600]} colorName="Gray 600" />
                  <LabelRow old="NZT Noite" newLabel="VYR CLEAR" color={VYR_COLORS.coldBlue} colorName="Cold Blue" />
                  <LabelRow old="Pacote Completo" newLabel="VYR SYSTEM" color={VYR_COLORS.gray[800]} colorName="Gray 800" />
                  <LabelRow old="Smart Ring" newLabel="VYR NODE" color={VYR_COLORS.black} colorName="Black" />
                </tbody>
              </table>
            </div>

            {/* Label structure */}
            <div className="p-6 bg-gray-50">
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">ESTRUTURA DO LABEL</h4>
              <div className="flex items-center gap-4 mb-4">
                <span 
                  className="text-2xl tracking-[0.35em]"
                  style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
                >
                  VYR
                </span>
                <span className="text-gray-300">+</span>
                <span 
                  className="text-2xl tracking-[0.2em] text-gray-500"
                  style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
                >
                  SUBLABEL
                </span>
              </div>
              <p className="text-xs text-gray-500">
                O sublabel usa o mesmo peso tipográfico, mas com letter-spacing reduzido (0.2em vs 0.35em) 
                para hierarquia visual.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Product Colors */}
        <section className="mb-16 page-break no-break">
          <SectionHeader number="05" title="CORES DOS PRODUTOS" />
          
          <div className="mt-8 space-y-6">
            {/* BOOT */}
            <ProductColorBlock 
              label="VYR BOOT"
              subtitle="Manhã · Ativação"
              bgColor={VYR_LABELS.BOOT.color}
              textColor={VYR_LABELS.BOOT.textColor}
              specs={{
                background: { name: "Gray 100", hex: VYR_COLORS.gray[100] },
                text: { name: "Black", hex: VYR_COLORS.black },
              }}
            />

            {/* HOLD */}
            <ProductColorBlock 
              label="VYR HOLD"
              subtitle="Tarde · Sustentação"
              bgColor={VYR_LABELS.HOLD.color}
              textColor={VYR_LABELS.HOLD.textColor}
              specs={{
                background: { name: "Gray 600", hex: VYR_COLORS.gray[600] },
                text: { name: "White", hex: VYR_COLORS.white },
              }}
            />

            {/* CLEAR */}
            <ProductColorBlock 
              label="VYR CLEAR"
              subtitle="Noite · Recuperação"
              bgColor={VYR_LABELS.CLEAR.color}
              textColor={VYR_LABELS.CLEAR.textColor}
              specs={{
                background: { name: "Cold Blue", hex: VYR_COLORS.coldBlue },
                text: { name: "White", hex: VYR_COLORS.white },
              }}
            />
          </div>
        </section>

        {/* Section 6: Sachets */}
        <section className="mb-16 page-break no-break">
          <SectionHeader number="06" title="EMBALAGENS — SACHETS" />
          
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <SachetMockup variant="BOOT" />
              <SachetMockup variant="HOLD" />
              <SachetMockup variant="CLEAR" />
            </div>

            {/* Sachet specs */}
            <div className="grid grid-cols-2 gap-8 p-6 bg-gray-50">
              <div>
                <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">ESPECIFICAÇÕES FÍSICAS</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li><span className="text-gray-400">Formato:</span> Vertical</li>
                  <li><span className="text-gray-400">Proporção:</span> 3:5</li>
                  <li><span className="text-gray-400">Material:</span> Metalizado fosco</li>
                  <li><span className="text-gray-400">Acabamento:</span> Soft-touch</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">ELEMENTOS VISUAIS</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Logo VYR centralizado</li>
                  <li>• Sublabel abaixo do logo</li>
                  <li>• Muito espaço negativo</li>
                  <li>• Sem ilustrações ou ícones</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Boxes */}
        <section className="mb-16 no-break">
          <SectionHeader number="07" title="EMBALAGENS — CAIXAS" />
          
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <BoxMockup variant="BOOT" />
              <BoxMockup variant="HOLD" />
              <BoxMockup variant="CLEAR" />
            </div>

            {/* System box */}
            <div>
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">VYR SYSTEM — CAIXA COMPLETA</h4>
              <div 
                className="aspect-[2/1] flex items-center justify-center"
                style={{ backgroundColor: VYR_COLORS.gray[800] }}
              >
                <div className="text-center">
                  <span 
                    className="text-3xl tracking-[0.4em] text-white"
                    style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
                  >
                    VYR
                  </span>
                  <br />
                  <span 
                    className="text-lg tracking-[0.25em] text-gray-400"
                    style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}
                  >
                    SYSTEM
                  </span>
                </div>
              </div>
            </div>

            {/* Box specs */}
            <div className="p-6 bg-gray-50">
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">CARACTERÍSTICAS OBRIGATÓRIAS</h4>
              <ul className="text-sm text-gray-600 space-y-1 grid grid-cols-2 gap-2">
                <li>• Visual minimalista e industrial</li>
                <li>• Premium técnico</li>
                <li>• Muito espaço vazio</li>
                <li>• Informação mínima</li>
                <li>• Nenhuma promessa emocional</li>
                <li>• Cores sólidas, sem gradientes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8: VYR NODE */}
        <section className="mb-16 page-break no-break">
          <SectionHeader number="08" title="VYR NODE — HARDWARE" />
          
          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <div 
                className="aspect-square bg-black flex items-center justify-center"
              >
                <div 
                  className="w-40 h-40 rounded-full border-8 border-gray-800 flex items-center justify-center shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #262626 0%, #0A0A0A 50%, #171717 100%)' }}
                >
                  <span 
                    className="text-[10px] tracking-[0.25em] text-gray-500"
                    style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}
                  >
                    VYR
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Representação visual do anel VYR NODE</p>
            </div>
            <div className="text-sm space-y-6">
              <div>
                <h4 className="text-xs tracking-wider text-gray-500 mb-3 font-medium">FILOSOFIA DE DESIGN</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Instrumento técnico, não acessório de moda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Discreto e minimal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Sem LEDs chamativos ou cores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Logo VYR gravado sutilmente</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs tracking-wider text-gray-500 mb-3 font-medium">ESPECIFICAÇÕES TÉCNICAS</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><span className="text-gray-400">Material:</span> Titânio</li>
                  <li><span className="text-gray-400">Acabamento:</span> Brushed black</li>
                  <li><span className="text-gray-400">Sensores:</span> PPG, HRV, SpO2, Temp</li>
                  <li><span className="text-gray-400">Bateria:</span> 7 dias</li>
                  <li><span className="text-gray-400">Resistência:</span> 100m</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs tracking-wider text-gray-500 mb-3 font-medium">COR APLICADA</h4>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8" style={{ backgroundColor: VYR_COLORS.black, border: '1px solid #333' }} />
                  <div>
                    <p className="text-xs text-gray-400">Black</p>
                    <p className="font-mono text-xs">{VYR_COLORS.black}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Visual Hierarchy */}
        <section className="mb-16 no-break">
          <SectionHeader number="09" title="HIERARQUIA VISUAL" />
          
          <div className="mt-8 space-y-8">
            {/* Brand hierarchy */}
            <div className="p-6 bg-gray-50">
              <h4 className="text-xs tracking-wider text-gray-500 mb-6 font-medium">ESTRUTURA DA MARCA</h4>
              <div className="flex items-center justify-center gap-8 text-center">
                <div>
                  <div 
                    className="w-24 h-24 bg-black flex items-center justify-center mb-3"
                  >
                    <span 
                      className="text-white text-lg tracking-[0.3em]"
                      style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily, fontWeight: 500 }}
                    >
                      VYR
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Marca Mãe</p>
                </div>
                <span className="text-gray-300 text-2xl">→</span>
                <div className="grid grid-cols-2 gap-3">
                  {(["BOOT", "HOLD", "CLEAR", "NODE"] as const).map((variant) => (
                    <div key={variant} className="text-center">
                      <div 
                        className="w-16 h-16 flex items-center justify-center mb-2"
                        style={{ 
                          backgroundColor: VYR_LABELS[variant].color,
                          border: variant === "BOOT" ? "1px solid #ccc" : "none"
                        }}
                      >
                        <span 
                          className="text-[8px] tracking-[0.15em]"
                          style={{ 
                            fontFamily: VYR_TYPOGRAPHY.logo.fontFamily,
                            color: VYR_LABELS[variant].textColor
                          }}
                        >
                          {variant}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">{variant}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-brands */}
            <div>
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">EXTENSÕES DA MARCA</h4>
              <div className="grid grid-cols-3 gap-4">
                {(["LABS", "NUTRITION", "SCIENCE"] as const).map((ext) => (
                  <div 
                    key={ext}
                    className="p-4 text-center"
                    style={{ 
                      backgroundColor: VYR_LABELS[ext].color,
                      border: ext === "NUTRITION" ? "1px solid #ccc" : "none"
                    }}
                  >
                    <span 
                      className="text-sm tracking-[0.2em] block"
                      style={{ 
                        fontFamily: VYR_TYPOGRAPHY.logo.fontFamily,
                        color: VYR_LABELS[ext].textColor
                      }}
                    >
                      VYR {ext}
                    </span>
                    <span 
                      className="text-[8px] tracking-wider block mt-1 opacity-60"
                      style={{ color: VYR_LABELS[ext].textColor }}
                    >
                      {VYR_LABELS[ext].tagline}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 10: Design Principles */}
        <section className="mb-16 page-break no-break">
          <SectionHeader number="10" title="PRINCÍPIOS DE DESIGN" />
          
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50">
                <h4 className="font-medium mb-4 text-green-700 text-sm">✓ VYR DEVE PARECER</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Um sistema integrado</li>
                  <li>Uma infraestrutura silenciosa</li>
                  <li>Algo técnico e controlado</li>
                  <li>Respeitável e confiável</li>
                  <li>Neutro e funcional</li>
                </ul>
              </div>
              <div className="p-6 bg-gray-50">
                <h4 className="font-medium mb-4 text-red-700 text-sm">✗ VYR NÃO DEVE PARECER</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Amigável ou acolhedor</li>
                  <li>Explicativo ou didático</li>
                  <li>Motivacional ou inspirador</li>
                  <li>Emocional ou expressivo</li>
                  <li>Wellness ou lifestyle</li>
                </ul>
              </div>
            </div>

            {/* Core statement */}
            <div className="p-8 bg-black text-white text-center">
              <p className="text-xl italic" style={{ fontFamily: VYR_TYPOGRAPHY.body.fontFamily }}>
                "VYR não seduz. VYR se impõe como sistema."
              </p>
            </div>

            {/* Keywords */}
            <div>
              <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">PALAVRAS-CHAVE DA MARCA</h4>
              <div className="flex flex-wrap gap-2">
                {["Sistema", "Infraestrutura", "Técnico", "Silencioso", "Neutro", "Preciso", "Funcional", "Discreto", "Constante", "Método"].map((word) => (
                  <span 
                    key={word} 
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm"
                    style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 11: Applications */}
        <section className="mb-16 no-break">
          <SectionHeader number="11" title="APLICAÇÕES" />
          
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Digital */}
              <div className="p-6 bg-gray-50">
                <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">DIGITAL</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Website institucional</li>
                  <li>• Aplicativo móvel</li>
                  <li>• Dashboard web</li>
                  <li>• E-mails transacionais</li>
                  <li>• Redes sociais</li>
                </ul>
              </div>
              
              {/* Physical */}
              <div className="p-6 bg-gray-50">
                <h4 className="text-xs tracking-wider text-gray-500 mb-4 font-medium">FÍSICO</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Embalagens (sachets e caixas)</li>
                  <li>• Hardware (VYR NODE)</li>
                  <li>• Material impresso</li>
                  <li>• Sinalização</li>
                  <li>• Uniformes/vestuário</li>
                </ul>
              </div>
            </div>

            {/* Do's and Don'ts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-green-200 p-4">
                <p className="text-xs text-green-700 font-medium mb-3">✓ PERMITIDO</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Usar logo em fundos sólidos</p>
                  <p>• Variar entre versão clara e escura</p>
                  <p>• Aplicar em materiais metálicos/foscos</p>
                </div>
              </div>
              <div className="border border-red-200 p-4">
                <p className="text-xs text-red-700 font-medium mb-3">✗ PROIBIDO</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Distorcer proporções do logo</p>
                  <p>• Adicionar sombras ou efeitos 3D</p>
                  <p>• Usar cores fora da paleta</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 12: Checklist */}
        <section className="mb-16 page-break no-break">
          <SectionHeader number="12" title="CHECKLIST DE VALIDAÇÃO" />
          
          <div className="mt-8 text-sm">
            <p className="text-gray-600 mb-6">
              Use esta lista para validar qualquer aplicação da marca VYR. 
              Todos os itens devem ser verificados antes da aprovação final.
            </p>
            <div className="grid grid-cols-1 gap-1">
              <CheckItem text="Logo VYR é puramente tipográfico (sem ícones ou símbolos)" />
              <CheckItem text="Tipografia usa JetBrains Mono para logo e labels" />
              <CheckItem text="Tipografia usa Inter para textos de corpo" />
              <CheckItem text="Paleta é neutra (preto, branco, cinzas, azul frio sutil)" />
              <CheckItem text="Sem gradientes emocionais ou cores vibrantes" />
              <CheckItem text="Labels seguem estrutura VYR + SUBLABEL" />
              <CheckItem text="Embalagens são minimalistas com muito espaço vazio" />
              <CheckItem text="NODE parece instrumento técnico (não acessório de moda)" />
              <CheckItem text="Identidade transmite silêncio e respeito técnico" />
              <CheckItem text="Nenhuma promessa emocional visível" />
              <CheckItem text="Sistema prevalece sobre produto individual" />
              <CheckItem text="Área de proteção do logo está respeitada" />
            </div>
          </div>
        </section>

        {/* CSS Tokens Reference */}
        <section className="mb-16 no-break">
          <SectionHeader number="ANEXO" title="TOKENS CSS" />
          
          <div className="mt-8 p-6 bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto">
            <pre>{`/* VYR Design Tokens */

:root {
  /* Colors */
  --vyr-black: ${VYR_COLORS.black};
  --vyr-white: ${VYR_COLORS.white};
  --vyr-gray-100: ${VYR_COLORS.gray[100]};
  --vyr-gray-200: ${VYR_COLORS.gray[200]};
  --vyr-gray-300: ${VYR_COLORS.gray[300]};
  --vyr-gray-400: ${VYR_COLORS.gray[400]};
  --vyr-gray-500: ${VYR_COLORS.gray[500]};
  --vyr-gray-600: ${VYR_COLORS.gray[600]};
  --vyr-gray-700: ${VYR_COLORS.gray[700]};
  --vyr-gray-800: ${VYR_COLORS.gray[800]};
  --vyr-gray-900: ${VYR_COLORS.gray[900]};
  --vyr-cold-blue: ${VYR_COLORS.coldBlue};

  /* Typography */
  --font-logo: 'JetBrains Mono', monospace;
  --font-body: 'Inter', sans-serif;
  --logo-weight: 500;
  --logo-spacing: 0.35em;
  --label-spacing: 0.2em;

  /* Product Colors */
  --vyr-boot-bg: ${VYR_LABELS.BOOT.color};
  --vyr-boot-text: ${VYR_LABELS.BOOT.textColor};
  --vyr-hold-bg: ${VYR_LABELS.HOLD.color};
  --vyr-hold-text: ${VYR_LABELS.HOLD.textColor};
  --vyr-clear-bg: ${VYR_LABELS.CLEAR.color};
  --vyr-clear-text: ${VYR_LABELS.CLEAR.textColor};
}`}</pre>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-black pt-8 mt-16 text-center text-xs text-gray-500">
          <p style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }} className="tracking-[0.3em] mb-2">
            VYR SYSTEMS
          </p>
          <p>Brand Identity Guideline · Versão 1.0</p>
          <p className="mt-4">© 2026 VYR · Todos os direitos reservados</p>
          <p className="mt-2 text-gray-400">Documento gerado para validação e aprovação interna</p>
        </footer>

      </div>

      {/* Print button - hidden when printing */}
      <div className="fixed bottom-8 right-8 print:hidden flex gap-3">
        <button 
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors shadow-lg"
          style={{ fontFamily: VYR_TYPOGRAPHY.logo.fontFamily }}
        >
          EXPORTAR PDF
        </button>
      </div>
    </div>
  );
}

// Helper Components

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b-2 border-black pb-3">
      <span 
        className="text-sm text-gray-400" 
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {number}
      </span>
      <h2 
        className="text-sm tracking-[0.15em] font-medium"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {title}
      </h2>
    </div>
  );
}

function ColorSwatch({ name, hex, color, light }: { name: string; hex: string; color: string; light?: boolean }) {
  return (
    <div className="text-center">
      <div 
        className="h-12 mb-2"
        style={{ 
          backgroundColor: color,
          border: light ? '1px solid #e5e5e5' : 'none'
        }}
      />
      <p className="text-[9px] tracking-wider">{name}</p>
      <p className="text-[9px] text-gray-400 font-mono">{hex}</p>
    </div>
  );
}

function ColorSwatchLarge({ name, hex, description }: { name: string; hex: string; description: string }) {
  const isLight = hex === VYR_COLORS.white || hex === VYR_COLORS.gray[100];
  return (
    <div className="flex gap-4 items-center p-4 bg-gray-50">
      <div 
        className="w-20 h-20 flex-shrink-0"
        style={{ 
          backgroundColor: hex,
          border: isLight ? '1px solid #e5e5e5' : 'none'
        }}
      />
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="font-mono text-xs text-gray-500">{hex}</p>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>
    </div>
  );
}

function LabelRow({ old, newLabel, color, colorName }: { old: string; newLabel: string; color: string; colorName: string }) {
  const isLight = color === VYR_COLORS.gray[100] || color === VYR_COLORS.white;
  return (
    <tr className="border-b border-gray-200">
      <td className="py-3 pr-4 text-gray-400 line-through">{old}</td>
      <td className="py-3 pr-4 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{newLabel}</td>
      <td className="py-3">
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6" 
            style={{ 
              backgroundColor: color, 
              border: isLight ? '1px solid #ccc' : 'none' 
            }} 
          />
          <div>
            <span className="text-gray-600 text-sm">{colorName}</span>
            <span className="text-gray-400 text-xs ml-2 font-mono">{color}</span>
          </div>
        </div>
      </td>
    </tr>
  );
}

function ProductColorBlock({ 
  label, 
  subtitle, 
  bgColor, 
  textColor, 
  specs 
}: { 
  label: string; 
  subtitle: string;
  bgColor: string; 
  textColor: string;
  specs: { background: { name: string; hex: string }; text: { name: string; hex: string } };
}) {
  const isLight = bgColor === VYR_COLORS.gray[100] || bgColor === VYR_COLORS.white;
  return (
    <div className="grid grid-cols-[2fr_1fr] gap-4">
      <div 
        className="p-8 flex items-center justify-between"
        style={{ 
          backgroundColor: bgColor, 
          color: textColor,
          border: isLight ? '1px solid #ddd' : 'none'
        }}
      >
        <div>
          <span 
            className="text-2xl tracking-[0.3em]"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
          >
            {label}
          </span>
          <p className="text-xs opacity-60 mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="p-4 bg-gray-50 text-xs space-y-3">
        <div>
          <p className="text-gray-400 mb-1">Background</p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: specs.background.hex, border: isLight ? '1px solid #ccc' : 'none' }} />
            <span className="font-mono">{specs.background.hex}</span>
          </div>
        </div>
        <div>
          <p className="text-gray-400 mb-1">Text</p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4" style={{ backgroundColor: specs.text.hex, border: specs.text.hex === VYR_COLORS.white ? '1px solid #ccc' : 'none' }} />
            <span className="font-mono">{specs.text.hex}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SachetMockup({ variant }: { variant: "BOOT" | "HOLD" | "CLEAR" }) {
  const colors = {
    BOOT: { bg: VYR_COLORS.gray[100], text: VYR_COLORS.black },
    HOLD: { bg: VYR_COLORS.gray[600], text: VYR_COLORS.white },
    CLEAR: { bg: VYR_COLORS.coldBlue, text: VYR_COLORS.white },
  };
  const c = colors[variant];

  return (
    <div className="text-center">
      <div 
        className="aspect-[3/5] flex flex-col items-center justify-center p-6 relative"
        style={{ 
          backgroundColor: c.bg, 
          color: c.text,
          border: variant === "BOOT" ? "1px solid #ddd" : "none"
        }}
      >
        <span 
          className="text-lg tracking-[0.35em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
        >
          VYR
        </span>
        <span 
          className="text-sm tracking-[0.2em] opacity-70 mt-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {variant}
        </span>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="text-[8px] tracking-wider opacity-40">30 SACHETS</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-3 font-medium">VYR {variant}</p>
      <p className="text-[10px] text-gray-400 font-mono">{c.bg}</p>
    </div>
  );
}

function BoxMockup({ variant }: { variant: "BOOT" | "HOLD" | "CLEAR" }) {
  const colors = {
    BOOT: { bg: VYR_COLORS.gray[100], text: VYR_COLORS.black },
    HOLD: { bg: VYR_COLORS.gray[600], text: VYR_COLORS.white },
    CLEAR: { bg: VYR_COLORS.coldBlue, text: VYR_COLORS.white },
  };
  const c = colors[variant];

  return (
    <div className="text-center">
      <div 
        className="aspect-[4/3] flex flex-col items-center justify-center p-4"
        style={{ 
          backgroundColor: c.bg, 
          color: c.text,
          border: variant === "BOOT" ? "1px solid #ddd" : "none"
        }}
      >
        <span 
          className="text-base tracking-[0.35em]"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
        >
          VYR
        </span>
        <span 
          className="text-xs tracking-[0.2em] opacity-70 mt-1"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {variant}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-3 font-medium">Caixa {variant}</p>
    </div>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100">
      <div className="w-4 h-4 border-2 border-gray-400 flex-shrink-0" />
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
