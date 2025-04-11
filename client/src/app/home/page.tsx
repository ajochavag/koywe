'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createQuote, getQuoteById } from '@/services/QuoteService';
import { QuoteResponse } from '@/models/quote/quote';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [quoteResult, setQuoteResult] = useState<QuoteResponse | null>(null);

  const [quoteId, setQuoteId] = useState('');
  const [quoteDetails, setQuoteDetails] = useState<QuoteResponse | null>(null);

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trimmedAmount = amount.trim();
      const trimmedFrom = from.trim().toUpperCase();
      const trimmedTo = to.trim().toUpperCase();
  
      const data = await createQuote({
        amount: parseFloat(trimmedAmount),
        from: trimmedFrom,
        to: trimmedTo,
      });
  
      setQuoteResult(data);
    } catch (error) {
      alert('Error al crear la cotización');
      console.error(error);
    }
  };
  
  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const trimmedId = quoteId.trim();
      const data = await getQuoteById(trimmedId);
      setQuoteDetails(data);
      setQuoteId('');
    } catch (error) {
      alert('Cotización no encontrada o expirada');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('KOWEY-JHjskEJEk3ksojñ-SWAP');
    router.push('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Imagen (oculta en móvil) */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/fondo.jpg"
          alt="Fondo"
          layout="fill"
          objectFit="cover"
          priority
        />

      </div>

      <div className="bg-black text-white flex flex-col items-center justify-center w-full md:w-1/2 py-10 px-6">
        <h1
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: "var(--color-secundario)" }}
        >
          Cotizador de Divisas
        </h1>

 

        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Crear cotización */}
          <form
            onSubmit={handleCreateQuote}
            className="bg-[var(--color-secundario)] p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: "var(--color-principal)" }}>
              Crear cotización
            </h2>

            <div className="space-y-3">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Monto"
                className="w-full p-2 rounded-lg border text-black focus:outline-none"
              />

              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Desde (e.g. USD)"
                className="w-full p-2 rounded-lg border text-black focus:outline-none"
              />

              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Hacia (e.g. CLP)"
                className="w-full p-2 rounded-lg border text-black focus:outline-none"
              />

              <button
                type="submit"
                className="w-full bg-[var(--color-principal)] hover:bg-emerald-900 text-white py-2 rounded-lg transition"
              >
                Cotizar
              </button>
            </div>

            {quoteResult && (
              <div className="mt-4 text-sm space-y-1 text-black">
                <p><strong>ID:</strong> {quoteResult.id}</p>
                <p><strong>Tasa:</strong> {quoteResult.rate}</p>
                <p><strong>Total:</strong> {quoteResult.convertedAmount}</p>
              </div>
            )}
          </form>

          {/* Buscar cotización */}
          <form
            onSubmit={handleGetQuote}
            className="bg-[var(--color-secundario)] p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: "var(--color-principal)" }}>
              Buscar cotización
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                value={quoteId}
                onChange={(e) => setQuoteId(e.target.value)}
                placeholder="ID de cotización"
                className="w-full p-2 rounded-lg border text-black focus:outline-none"
              />

              <button
                type="submit"
                className="w-full bg-[var(--color-principal)] hover:bg-emerald-900 text-white py-2 rounded-lg transition"
              >
                Buscar
              </button>
            </div>

            {quoteDetails && (
              <div className="mt-4 text-sm text-black space-y-1">
                <p><strong>ID:</strong> {quoteDetails.id}</p>
                <p><strong>Monto:</strong> {quoteDetails.amount}</p>
                <p><strong>De:</strong> {quoteDetails.from}</p>
                <p><strong>A:</strong> {quoteDetails.to}</p>
                <p><strong>Tasa:</strong> {quoteDetails.rate}</p>
                <p><strong>Total:</strong> {quoteDetails.convertedAmount}</p>
                <p><strong>Expira:</strong> {new Date(quoteDetails.expiresAt).toLocaleString()}</p>
              </div>
            )}
          </form>
          <div className="w-full flex justify-end mb-4">
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
               Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );    
}
