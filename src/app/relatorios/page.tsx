"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
// topo do arquivo
import { toast } from "react-toastify";
export default function RelatoriosPage() {
  const [dados, setDados] = useState<any>(null);
  const [comparacaoAlunos, setComparacaoAlunos] = useState<any>(null);
  const [comparacaoReceita, setComparacaoReceita] = useState<any>(null);
  const [resumoIA, setResumoIA] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [relatorio, alunos, receita, resumo] = await Promise.all([
        api.get("/relatorios/mensal"),
        api.get("/relatorios/comparativo/alunos"),
        api.get("/relatorios/comparativo/financeiro"),
        api.get("/relatorios/resumo-inteligente"),
      ]);
      setDados(relatorio.data);
      setComparacaoAlunos(alunos.data);
      setComparacaoReceita(receita.data);
      setResumoIA(resumo.data || "");
    }
    fetchData();
  }, []);

  if (!dados) return <div className="text-center text-white">Carregando...</div>;

  return (
    <main className="bg-black min-h-screen text-white p-8 font-sans animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        📊 Relatório Mensal - {dados.mes.toUpperCase()}
      </h1>
<div className="flex justify-end mb-4">
  <a
    href="/relatorios/historico"
    className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg shadow text-sm transition"
  >
    📂 Ver Histórico de Relatórios
  </a>
</div>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-center">
        <InfoCard label="👤 Alunos ativos" value={dados.totalAlunos} color="text-cyan-300" />
        <InfoCard label="🎓 Instrutores" value={dados.totalInstrutores} color="text-orange-300" />
        <InfoCard label="📅 Aulas" value={dados.totalAulas} color="text-lime-300" />
        <InfoCard label="📌 Presenças" value={dados.presencasNoMes} color="text-emerald-300" />
        <InfoCard label="🆕 Novos alunos" value={dados.novosAlunos} color="text-purple-300" />
        <InfoCard
          label="💰 Receita"
          value={`R$ ${dados.totalRecebido.toFixed(2)}`}
          color="text-yellow-400"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 p-4 rounded-2xl shadow-md">
          <h2 className="font-bold text-lg mb-2">📈 Novos Alunos</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={[
                { name: "Mês Passado", valor: comparacaoAlunos?.mesAnterior || 0 },
                { name: "Este Mês", valor: comparacaoAlunos?.mesAtual || 0 },
              ]}
            >
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="valor" fill="#6366F1" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 p-4 rounded-2xl shadow-md">
          <h2 className="font-bold text-lg mb-2">💵 Receita Mensal</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={[
                { name: "Mês Passado", valor: comparacaoReceita?.mesAnterior || 0 },
                { name: "Este Mês", valor: comparacaoReceita?.mesAtual || 0 },
              ]}
            >
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-gray-900 p-6 rounded-2xl shadow-md mb-6">
        <h2 className="font-bold text-lg mb-2">🧠 Resumo Inteligente</h2>
        <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
          {resumoIA}
        </p>
        <div className="flex gap-4 justify-end mt-6">
          <button
  onClick={async () => {
    try {
      await api.get("/relatorios/enviar-whatsapp");
      toast.success("✅ Relatório enviado via WhatsApp!");
    } catch (error) {
      console.error(error);
      toast.error("❌ Erro ao enviar relatório por WhatsApp");
    }
  }}
  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
>
  Enviar por WhatsApp
</button>

          <button
            onClick={async () => {
              await api.get("/relatorios/teste-email");
              alert("📧 Relatório enviado por e-mail");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          >
            Enviar por E-mail
          </button>
        </div>
      </section>

      <footer className="text-center text-xs text-gray-600 mt-6">
        Sistema de Jiu-Jitsu SaaS • Visão estratégica e automação inteligente ⚙️
      </footer>
    </main>
  );
}

function InfoCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-md hover:scale-105 transition-transform duration-300">
      <p className="text-gray-400">{label}</p>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}