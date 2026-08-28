import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FileText, 
  ShieldCheck 
} from 'lucide-react';

/**
 * Componente Sidebar:
 * Maneja la navegación lateral del sistema.
 * Recibe el tab activo actual (activeTab) y la función para cambiarlo (setActiveTab).
 */
export default function Sidebar({ activeTab, setActiveTab }) {
  // Lista de items de navegación con su ID, etiqueta e icono de Lucide
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'productos', label: 'Productos / Servicios', icon: Package },
    { id: 'presupuestos', label: 'Presupuestos', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Encabezado del Menú Lateral / Logotipo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
        <div className="bg-sky-600 text-white p-2 rounded-lg shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          {/* Tamaños fijados para prevenir desbordes de fuente */}
          <h1 className="font-bold text-white text-base leading-snug truncate m-0">
            PymeControl
          </h1>
          <p className="text-xs text-slate-400 truncate m-0">
            Gestión Comercial
          </p>
        </div>
      </div>

      {/* Enlaces de Navegación Principal */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Pie del Menú Lateral */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        <p className="truncate m-0">PymeControl v1.0.0</p>
        <p className="truncate m-0">Entorno Local Demo</p>
      </div>
    </aside>
  );
}