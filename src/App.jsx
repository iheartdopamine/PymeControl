import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ClientsView from './components/ClientsView';
import ProductsView from './components/ProductsView';
import InvoiceBuilderView from './components/InvoiceBuilderView';
import { initialClients, initialProducts, initialInvoices } from './data/mockData';

/**
 * Componente Principal App:
 * - Controla el estado global de la aplicación (clientes, productos, presupuestos).
 * - Sincroniza los datos con el almacenamiento local (localStorage).
 * - Gestiona la pestaña de navegación activa.
 */
export default function App() {
  // Pestaña activa de la navegación
  const [activeTab, setActiveTab] = useState('dashboard');

  // Carga inicial del estado desde localStorage o desde mockData si está vacío
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('pyme_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('pyme_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('pyme_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  // Guardar en localStorage cada vez que se actualizan los datos
  useEffect(() => {
    localStorage.setItem('pyme_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('pyme_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pyme_invoices', JSON.stringify(invoices));
  }, [invoices]);

  /**
   * Función para reiniciar la aplicación a los datos iniciales de prueba
   */
  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer los datos de demostración iniciales?')) {
      localStorage.removeItem('pyme_clients');
      localStorage.removeItem('pyme_products');
      localStorage.removeItem('pyme_invoices');
      setClients(initialClients);
      setProducts(initialProducts);
      setInvoices(initialInvoices);
    }
  };

  /**
   * Renderizado condicional del módulo activo segun los componentes reales
   */
  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            clients={clients} 
            products={products} 
            invoices={invoices} 
            setActiveTab={setActiveTab} 
          />
        );
      case 'clientes':
        return (
          <ClientsView 
            clients={clients} 
            setClients={setClients} 
          />
        );
      case 'productos':
        return (
          <ProductsView 
            products={products} 
            setProducts={setProducts} 
          />
        );
      case 'presupuestos':
        return (
          <InvoiceBuilderView 
            clients={clients} 
            products={products} 
            setProducts={setProducts}
            invoices={invoices} 
            setInvoices={setInvoices} 
          />
        );
      default:
        return (
          <DashboardView 
            clients={clients} 
            products={products} 
            invoices={invoices} 
            setActiveTab={setActiveTab} 
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans antialiased text-slate-800">
      {/* Navegación Lateral */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado Superior */}
          <header className="mb-6 pb-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 m-0">
                Sistema de Administración Comercial
              </h1>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                Gestión de Clientes, Catálogo de Precios y Cotizaciones
              </p>
            </div>
            
            {/* Acciones y estado del almacenamiento */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleResetData}
                className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
              >
                Restablecer Demo
              </button>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Almacenamiento Local Activo
              </span>
            </div>
          </header>

          {/* Renderizado Dinámico del Módulo Seleccionado */}
          {renderActiveModule()}
        </div>
      </main>
    </div>
  );
}