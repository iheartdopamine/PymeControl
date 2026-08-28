# PymeControl - Sistema de Administración Comercial y CRM Minimalista

Sistema de gestión interna para pequeñas y medianas empresas orientado a la administración de clientes, catálogo de productos, emisión de presupuestos y seguimiento de ventas.

## Características Principales

- Panel de Control (Dashboard): Métricas dinámicas en tiempo real sobre ventas aprobadas, cotizaciones pendientes y alertas de bajo stock.
- Gestión de Clientes: Registro, búsqueda interactiva y control de estado de cuentas de clientes.
- Catálogo de Productos y Servicios: Administración de listas de precios y stock.
- Creador de Presupuestos: Selección de cliente, incorporación dinámica de productos, cálculo automático de impuestos (IVA) y descuento de inventario.
- Exportación de Documentos: Generación e impresión de presupuestos en formato PDF.
- Persistencia de Datos: Sincronización client-side mediante localStorage.

## Stack Tecnológico

- Frontend: React 18+ (Vite)
- Estilos: Tailwind CSS v4
- Iconografía: Lucide React
- Generación de PDF: jsPDF y jsPDF-AutoTable

## Instalación y Ejecución Local

1. Clonar el repositorio

2. Instalar dependencias

3. Iniciar el entorno de desarrollo

## Estructura del Proyecto

```text
src/
├── components/
│   ├── Sidebar.jsx             # Menú de navegación lateral
│   ├── DashboardView.jsx       # Vista del panel principal de métricas
│   ├── MetricCard.jsx          # Tarjetas reutilizables de indicadores KPI
│   ├── ClientsView.jsx         # Gestión e historial de clientes
│   ├── ProductsView.jsx        # Catálogo de productos/servicios y control de stock
│   └── InvoiceBuilderView.jsx  # Generador de presupuestos y exportador a PDF
├── data/
│   └── mockData.js             # Datos de prueba iniciales
├── utils/
│   └── pdfGenerator.js         # Utilidad para exportación e impresión en PDF
├── App.jsx                     # Enrutador y gestor de estado global
└── index.css                   # Configuración y estilos base de Tailwind CSS
```

---

## Guía de Integración con Base de Datos Real

Actualmente la aplicación gestiona la persistencia de datos localmente mediante `localStorage`. Si deseas conectar el frontend con un servidor Backend y una base de datos relacional (como MySQL o PostgreSQL), sigue estos pasos:

### 1. Diseñar el Esquema de la Base de Datos

Crea las tablas relacionales para clientes, productos e historial de presupuestos/facturas:

```sql
-- Tabla de Clientes
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos / Servicios
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Productos',
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Presupuestos / Cotizaciones
CREATE TABLE invoices (
    id VARCHAR(36) PRIMARY KEY,
    number VARCHAR(50) UNIQUE NOT NULL,
    client_id VARCHAR(36) REFERENCES clients(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detalle de Productos en Presupuestos
CREATE TABLE invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id VARCHAR(36) REFERENCES invoices(id) ON DELETE CASCADE,
    product_id VARCHAR(36) REFERENCES products(id),
    product_name VARCHAR(255),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL
);
```

### 2. Configurar una API REST Backend (Node.js / Express)

Crea un servidor Node.js/Express que exponga endpoints HTTP para operar sobre la base de datos:

- `GET /api/clients` - Obtener todos los clientes.
- `POST /api/clients` - Crear un nuevo cliente.
- `PUT /api/clients/:id` - Actualizar un cliente existente.
- `DELETE /api/clients/:id` - Eliminar un cliente.
- `GET /api/products` - Obtener catálogo de productos.
- `POST /api/products` - Crear producto.
- `GET /api/invoices` - Obtener historial de cotizaciones.
- `POST /api/invoices` - Registrar una nueva cotización.

### 3. Reemplazar `localStorage` por `fetch` / `axios` en React

Sustituye la lógica de lectura y escritura local en `App.jsx` y en las vistas correspondientes por llamadas a la API:

1. **Carga inicial de datos (`App.jsx`)**:

```jsx
useEffect(() => {
  async function fetchData() {
    try {
      const [resClients, resProducts, resInvoices] = await Promise.all([
        fetch('http://localhost:3000/api/clients').then(r => r.json()),
        fetch('http://localhost:3000/api/products').then(r => r.json()),
        fetch('http://localhost:3000/api/invoices').then(r => r.json())
      ]);
      setClients(resClients);
      setProducts(resProducts);
      setInvoices(resInvoices);
    } catch (error) {
      console.error('Error al cargar datos desde la API:', error);
    }
  }
  fetchData();
}, []);
```

2. **Acciones de creación, edición y borrado**:

Reemplazar las modificaciones directas a los arrays de estado local por peticiones HTTP (`POST`, `PUT`, `DELETE`) hacia el servidor backend.
