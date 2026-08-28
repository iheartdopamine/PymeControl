// src/data/mockData.js

export const initialClients = [
  { id: 1, name: "Distribuidora San Martín", contact: "Carlos Gómez", email: "contacto@sanmartin.com", phone: "+54 380 4123456", status: "Activo" },
  { id: 2, name: "Comercial La Rioja", contact: "María Fernández", email: "ventas@comerciallarioja.com", phone: "+54 380 4654321", status: "Activo" },
  { id: 3, name: "Logística del Norte", contact: "Roberto Rossi", email: "info@logisticanorte.com", phone: "+54 380 4987654", status: "Inactivo" },
  { id: 4, name: "Supermercado El Centenario", contact: "Ana Martínez", email: "compras@elcentenario.com", phone: "+54 380 4555111", status: "Activo" }
];

export const initialProducts = [
  { id: 101, code: "SERV-01", name: "Servicio de Mantenimiento Web", category: "Servicios", price: 45000, stock: 99 },
  { id: 102, code: "SOFT-01", name: "Licencia Sistema POS / Ventas", category: "Software", price: 120000, stock: 15 },
  { id: 103, code: "CONS-01", name: "Consultoría de Digitalización", category: "Servicios", price: 85000, stock: 50 },
  { id: 104, code: "HARD-01", name: "Lector de Código de Barras USB", category: "Hardware", price: 38000, stock: 8 }
];

export const initialInvoices = [
  { id: "PRE-2026-001", clientId: 1, clientName: "Distribuidora San Martín", total: 165000, status: "Aprobado", date: "2026-08-15", itemsCount: 2 },
  { id: "PRE-2026-002", clientId: 2, clientName: "Comercial La Rioja", total: 45000, status: "Pendiente", date: "2026-08-20", itemsCount: 1 },
  { id: "PRE-2026-003", clientId: 4, clientName: "Supermercado El Centenario", total: 243000, status: "Aprobado", date: "2026-08-22", itemsCount: 3 },
  { id: "PRE-2026-004", clientId: 3, clientName: "Logística del Norte", total: 85000, status: "Rechazado", date: "2026-08-25", itemsCount: 1 },
  { id: "PRE-2026-005", clientId: 1, clientName: "Distribuidora San Martín", total: 120000, status: "Pendiente", date: "2026-08-27", itemsCount: 1 }
];

export const summaryMetrics = {
  totalSalesMonth: 573000,
  pendingInvoicesCount: 2,
  activeClientsCount: 3,
  lowStockProductsCount: 1
};