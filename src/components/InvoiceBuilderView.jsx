// src/components/InvoiceBuilderView.jsx
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Calculator, Download } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

export default function InvoiceBuilderView({ clients, products, setProducts, invoices, setInvoices, setCurrentTab }) {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [items, setItems] = useState([]);
  const [taxRate] = useState(21); // 21% IVA por defecto

  // Agregar nueva fila de item
  const handleAddItem = () => {
    setItems([...items, { productId: '', name: '', quantity: 1, price: 0, total: 0 }]);
  };

  // Cambio de producto en una fila
  const handleProductChange = (index, productId) => {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;

    const updatedItems = [...items];
    updatedItems[index] = {
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
      total: product.price
    };
    setItems(updatedItems);
  };

  // Cambio de cantidad
  const handleQuantityChange = (index, qty) => {
    const quantity = Math.max(1, Number(qty));
    const updatedItems = [...items];
    const item = updatedItems[index];
    item.quantity = quantity;
    item.total = item.price * quantity;
    setItems(updatedItems);
  };

  // Eliminar fila
  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Cálculos financieros
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  // Emitir y Guardar Presupuesto
  const handleSaveInvoice = (exportPdf = false) => {
    const client = clients.find(c => c.id === Number(selectedClientId));
    if (!client || items.length === 0) return;

    const invoiceId = `PRE-2026-00${invoices.length + 1}`;
    const newInvoice = {
      id: invoiceId,
      clientId: client.id,
      clientName: client.name,
      subtotal,
      taxAmount,
      total: grandTotal,
      status: 'Pendiente',
      date: new Date().toISOString().split('T')[0],
      itemsCount: items.length,
      itemsDetail: items
    };

    // Actualizar stock de los productos cotizados
    const updatedProducts = products.map(product => {
      const matchItem = items.find(i => i.productId === product.id);
      if (matchItem) {
        return { ...product, stock: Math.max(0, product.stock - matchItem.quantity) };
      }
      return product;
    });

    setProducts(updatedProducts);
    setInvoices([newInvoice, ...invoices]);

    if (exportPdf) {
      generateInvoicePDF(newInvoice, client, items);
    }

    setCurrentTab('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Generar Nuevo Presupuesto</h2>
        <p className="text-sm text-slate-500">Selecciona el cliente y los items para armar la cotización oficial.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
        {/* Selección de Cliente */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            1. Cliente Destinatario *
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-sky-500"
          >
            <option value="">-- Seleccionar Cliente --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.contact})</option>
            ))}
          </select>
        </div>

        {/* Detalle de Productos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Ítems del Presupuesto *
            </label>
            <button
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Item
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
              <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No has agregado items a la cotización.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <select
                      value={item.productId}
                      onChange={(e) => handleProductChange(index, e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm"
                    >
                      <option value="">Seleccionar producto/servicio</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - ${p.price.toLocaleString('es-AR')} (Stock: {p.stock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-md text-sm text-center"
                    />
                  </div>
                  <div className="w-full sm:w-32 text-right font-bold text-slate-800 text-sm py-2 sm:py-0">
                    ${item.total.toLocaleString('es-AR')}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg self-end sm:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen Final */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 pt-4 flex flex-col items-end space-y-2">
            <div className="flex justify-between w-64 text-sm text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between w-64 text-sm text-slate-600 items-center">
              <span>IVA ({taxRate}%):</span>
              <span className="font-semibold">${taxAmount.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between w-64 text-lg font-bold text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Final:</span>
              <span className="text-sky-600">${grandTotal.toLocaleString('es-AR')}</span>
            </div>
          </div>
        )}

        {/* Botones de Emisión */}
        <div className="pt-4 flex flex-wrap justify-end gap-3">
          <button
            disabled={!selectedClientId || items.length === 0}
            onClick={() => handleSaveInvoice(false)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              !selectedClientId || items.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Guardar Presupuesto
          </button>

          <button
            disabled={!selectedClientId || items.length === 0}
            onClick={() => handleSaveInvoice(true)}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all ${
              !selectedClientId || items.length === 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md'
            }`}
          >
            <Download className="w-4 h-4" /> Guardar y Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}