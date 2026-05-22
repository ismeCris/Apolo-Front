{/* COLUNA DA DIREITA: CARD PRINCIPAL LONGO */}
<div className="col-span-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 flex flex-col h-full min-h-[580px]">
  <h3 className="text-sm font-medium text-center pt-2 text-zinc-200">Análise rápida</h3>
  <p className="text-center text-xs text-zinc-500 mb-4">Desempenho geral do sistema</p>

  {/* Gráfico Principal de Rosca (Taxa de Resolução) */}


  {/* 4 MINI GRÁFICOS MAIS ESTREITOS E MAIS ALTOS */}
  <div className="flex flex-col gap-4 mt-6 flex-1 content-start">
    {[
      { 
        label: 'Resolução', 
        pct: taxaResolucao, 
        corCirculo: 'stroke-emerald-400', 
        corTexto: 'text-emerald-400' 
      },
      { 
        label: 'Sem atendente', 
        pct: total ? Math.round((tickets.filter(t => !t.assigned_to).length / total) * 100) : 0, 
        corCirculo: 'stroke-amber-400', 
        corTexto: 'text-amber-400' 
      },
      { 
        label: 'Urgentes', 
        pct: total ? Math.round((tickets.filter(t => t.priority === 'urgent').length / total) * 100) : 0, 
        corCirculo: 'stroke-red-400', 
        corTexto: 'text-red-400' 
      },
      { 
        label: 'Aguardando', 
        pct: total ? Math.round((tickets.filter(t => t.status === 'waiting').length / total) * 100) : 0, 
        corCirculo: 'stroke-zinc-400', 
        corTexto: 'text-zinc-400' 
      },
    ].map(item => {
      // Cálculo matemático do perímetro do círculo SVG para o efeito de "fill" progressivo
      const raio = 18;
      const circunferencia = 2 * Math.PI * raio;
      const strokeDashoffset = circunferencia - (item.pct / 100) * circunferencia;

      return (
        <div 
          key={item.label} 
          className="w-48 h-32 mx-auto bg-[#1a1a2e]/50 border border-[#27273a] rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300"
        >
          
          {/* Círculo de Progresso SVG */}
          <div className="relative w-14 h-14 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
              {/* Círculo de fundo (Trilha apagada) */}
              <circle cx="20" cy="20" r={raio} className="stroke-[#27273a] fill-transparent stroke-[3.5]" />
              {/* Círculo de progresso ativo */}
              <circle 
                cx="20" 
                cy="20" 
                r={raio} 
                className={`fill-transparent stroke-[3.5] transition-all duration-500 ease-out ${item.corCirculo}`}
                strokeDasharray={circunferencia}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            {/* Texto da porcentagem no centro do mini círculo */}
            <span className="absolute text-xs font-bold text-white">{item.pct}%</span>
          </div>

          {/* Nome do Indicador */}
          <span className="text-xs text-zinc-400 font-medium tracking-tight line-clamp-1">
            {item.label}
          </span>
        </div>
      );
    })}
  </div>
</div>