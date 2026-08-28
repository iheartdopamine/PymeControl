// src/components/DashboardView.jsx
import React from 'react';
import { DollarSign, Clock, Users, AlertTriangle, ArrowUpRight, Download } from 'lucide-react';
import MetricCard from './MetricCard';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export default function DashboardView({ setCurrentTab, invoices, clients, products }) {
  // Cálculo de métricas en tiempo real basadas en las props
  const totalSalesMonth = invoices
    .filter(inv => inv.status === 'Aprobado')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingInvoicesCount = invoices.filter(inv => inv.status === 'Pendiente').length;
  const activeClientsCount = clients.filter(c => c.status === 'Activo').length;
  const lowStockProductsCount = products.filter(p => p.stock <= 5).length;

  // Descarga rápida de PDF desde la lista reciente
  const handleQuickDownloadPDF = (invoice) => {
    const client = clients.find(c => c.id === invoice.clientId);
    const mockItems = invoice.itemsDetail || [
      { name: 'Detalle de Cotización General', quantity: 1, price: invoice.subtotal || invoice.total * 0.79, total: invoice.subtotal || invoice.total * 0.79 }
    ];
    generateInvoicePDF(invoice, client, mockItems);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
        <p className="text-sm text-slate-500">Resumen operativo general de la empresa en tiempo real.</p>
      </div>

      {/* Grid de Tarjetas de Métricas Dinámicas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ventas Totales (Aprobadas)"
          value={`$${totalSalesMonth.toLocaleString('es-AR')}`}
          subtitle="Basado en cotizaciones cerradas"
          icon={DollarSign}
          colorClass="text-emerald-600 bg-emerald-50"
        />
        <MetricCard
          title="Presupuestos Pendientes"
          value={pendingInvoicesCount}
          subtitle="Requieren seguimiento"
          icon={Clock}
          colorClass="text-amber-600 bg-amber-50"
        />
        <MetricCard
          title="Clientes Activos"
          value={activeClientsCount}
          subtitle="En la base de datos"
          icon={Users}
          colorClass="text-sky-600 bg-sky-50"
        />
        <MetricCard
          title="Alertas de Stock"
          value={lowStockProductsCount}
          subtitle="Items con 5 o menos unidades"
          icon={AlertTriangle}
          colorClass="text-rose-600 bg-rose-50"
        />
      </div>

      {/* Tabla de Presupuestos Recientes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Presupuestos Recientes</h3>
            <p className="text-xs text-slate-500">Últimas cotizaciones registradas</p>
          </div>
          <button
            onClick={() => setCurrentTab('invoices')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Ver todos / Crear <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Código</th>
                <th className="px-6 py-3 font-semibold">Cliente</th>
                <th className="px-6 py-3 font-semibold">Fecha</th>
                <th className="px-6 py-3 font-semibold">Total</th>
                <th className="px-6 py-3 font-semibold">Estado</th>
                <th className="px-6 py-3 font-semibold text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.slice(0, 5).map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{invoice.clientName}</td>
                  <td className="px-6 py-4 text-slate-500">{invoice.date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    ${invoice.total.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' :
                      invoice.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleQuickDownloadPDF(invoice)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}