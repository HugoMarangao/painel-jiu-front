"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function HistoricoRelatoriosPage() {
  const [relatorios, setRelatorios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await api.get("/relatorios/historico");
      setRelatorios(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-white text-center p-6">Carregando histórico...</div>;

  return (
    <main className="bg-gradient-to-b from-black via-zinc-900 to-zinc-800 min-h-screen p-6 text-white animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">📚 Histórico de Relatórios</h1>

      <div className="grid gap-6">
        {relatorios.map((r) => (
          <div
            key={r.id}
            className="bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">
                📅 {r.mes.toUpperCase()} / {r.ano}
              </h2>
              <span className="text-xs text-zinc-400">
                {format(new Date(r.criadoEm), "dd 'de' MMMM yyyy HH:mm", { locale: ptBR })}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
              <Info label="👤 Alunos Ativos" value={r.totalAlunos} />
              <Info label="🎓 Instrutores" value={r.totalInstrutores} />
              <Info label="📅 Aulas" value={r.totalAulas} />
              <Info label="📌 Presenças" value={r.presencasNoMes} />
              <Info label="🆕 Novos Alunos" value={r.novosAlunos} />
              <Info label="💰 Receita" value={`R$ ${r.totalRecebido.toFixed(2)}`} />
            </div>

            <p className="text-sm text-zinc-300 whitespace-pre-line italic leading-relaxed border-l-4 border-indigo-500 pl-4">
              🧠 {r.resumoIa}
            </p>

            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm shadow"
                onClick={async () => {
                  await api.get("/relatorios/enviar-whatsapp");
                  alert("✅ Enviado via WhatsApp");
                }}
              >
                Enviar WhatsApp
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm shadow"
                onClick={async () => {
                  await api.get("/relatorios/teste-email");
                  alert("📧 Enviado por e-mail");
                }}
              >
                Enviar E-mail
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-zinc-800 p-4 rounded-lg text-center">
      <p className="text-zinc-400 text-xs">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  );
}