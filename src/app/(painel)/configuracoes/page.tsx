'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import api from '@/lib/axios';

export default function ConfiguracoesPage() {
  const [tenant, setTenant] = useState<any>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [form, setForm] = useState({
    name: '',
    currency: '',
    locale: '',
    timezone: '',
    logoUrl: '',
  });
const src = qrCode?.startsWith('data:image/png;base64,')
  ? qrCode
  : `data:image/png;base64,${qrCode}`;
  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : null;

  useEffect(() => {
    console.log('🚀 useEffect rodou com tenantId:', tenantId);
    if (tenantId) fetchTenant();
  }, [tenantId]);

  async function fetchTenant() {
    try {
      console.log('🔍 Buscando tenant:', tenantId);
      const { data } = await api.get(`/tenants/${tenantId}`);
      console.log('✅ Tenant carregado:', data);

      setTenant(data);
      setForm({
        name: data.name || '',
        currency: data.currency || '',
        locale: data.locale || '',
        timezone: data.timezone || '',
        logoUrl: data.logoUrl || '',
      });

      if (!data.whatsappConnected) gerarQRCode();
    } catch (error) {
      console.error('❌ Erro ao buscar tenant:', error);
    }
  }

  async function gerarQRCode() {
  try {
    setLoadingQR(true);
    console.log('📲 Gerando QR Code...');
    const { data } = await api.get(`/tenants/${tenantId}/whatsapp/qrcode`);
    
    if (data === 'connected') {
      setQrCode(null);
    } else if (data === 'not_ready') {
      console.log('⏳ QR ainda não pronto. Tentando novamente em 2s...');
      setTimeout(gerarQRCode, 2000); // tenta novamente após 2s
    } else {
      console.log('📦 QR Code recebido:', data);
      setQrCode(data);
    }
  } catch (error) {
    console.error('❌ Erro ao gerar QR code:', error);
  } finally {
    setLoadingQR(false);
  }
}

  async function salvarConfiguracoes() {
    try {
      console.log('💾 Salvando configurações:', form);
      await api.patch(`/tenants/${tenantId}`, form);
      alert('Configurações salvas com sucesso!');
      fetchTenant();
    } catch (err) {
      console.error('❌ Erro ao salvar configurações:', err);
      alert('Erro ao salvar as configurações');
    }
  }

  function handleInputChange(e: any) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">⚙️ Configurações da Academia</h1>

      {!tenant && (
        <div className="text-red-500 mb-6">❗ Tenant não carregado. Verifique o tenant_id no localStorage e a API.</div>
      )}

      <div className="mb-6 space-y-4">
        <div>
          <label>Nome:</label>
          <input
            className="w-full bg-zinc-800 p-2 rounded"
            name="name"
            value={form.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Moeda:</label>
          <input
            className="w-full bg-zinc-800 p-2 rounded"
            name="currency"
            value={form.currency}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Idioma (locale):</label>
          <input
            className="w-full bg-zinc-800 p-2 rounded"
            name="locale"
            value={form.locale}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Fuso horário:</label>
          <input
            className="w-full bg-zinc-800 p-2 rounded"
            name="timezone"
            value={form.timezone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Logo (URL):</label>
          <input
            className="w-full bg-zinc-800 p-2 rounded"
            name="logoUrl"
            value={form.logoUrl}
            onChange={handleInputChange}
          />
        </div>
        {form.logoUrl && (
          <div className="mt-2">
            <Image src={form.logoUrl} alt="Logo" width={100} height={100} />
          </div>
        )}
      </div>

      <button
        onClick={salvarConfiguracoes}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Salvar
      </button>

      <div className="mt-10 border-t border-zinc-700 pt-6">
        <h2 className="text-xl font-semibold mb-4">🔗 Integração WhatsApp</h2>

        {!tenant ? (
          <p>Carregando status do WhatsApp...</p>
        ) : tenant.whatsappConnected ? (
          <div className="text-green-400 font-bold">✅ Conectado</div>
        ) : (
          <div className="text-red-400 font-bold">❌ Desconectado</div>
        )}

        {!tenant?.whatsappConnected && (
          <div className="mt-4 space-y-4">
            {loadingQR ? (
            <p>Gerando QR Code...</p>
            ) : qrCode ? (
            <img src={src} alt="QR Code do WhatsApp" />
            ) : (
            <p>Nenhum QR Code gerado.</p>
            )}

            <button
              onClick={gerarQRCode}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Gerar novo QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}