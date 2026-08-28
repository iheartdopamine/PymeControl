// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Genera y descarga un archivo PDF con el presupuesto estructurado de forma profesional.
 * @param {Object} invoice - Datos del presupuesto emitido.
 * @param {Object} client - Información completa del cliente destinatario.
 * @param {Array} items - Detalle de los productos/servicios cotizados.
 */
export const generateInvoicePDF = (invoice, client, items) => {
  const doc = new jsPDF();

  // Encabezado del Documento / Branding Pyme
  doc.setFillColor(15, 23, 42); // Color slate-900
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PRESUPUESTO / COTIZACIÓN', 14, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N°: ${invoice.id}`, 140, 18);
  doc.text(`Fecha: ${invoice.date}`, 140, 25);

  // Datos de la Empresa y del Cliente
  doc.setTextColor(51, 65, 85); // Slate-700
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('EMISOR:', 14, 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('PymeControl Soluciones Digitales', 14, 52);
  doc.text('Contacto: administración@pymecontrol.com', 14, 58);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CLIENTE DESTINATARIO:', 120, 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(client ? client.name : invoice.clientName, 120, 52);
  doc.text(`Contacto: ${client ? client.contact : 'N/D'}`, 120, 58);
  doc.text(`Email: ${client ? client.email : 'N/D'}`, 120, 64);
  doc.text(`Teléfono: ${client ? client.phone : 'N/D'}`, 120, 70);

  // Tabla de Items (Usando jspdf-autotable)
  const tableRows = items.map(item => [
    item.name,
    item.quantity.toString(),
    `$${item.price.toLocaleString('es-AR')}`,
    `$${item.total.toLocaleString('es-AR')}`
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Descripción / Producto', 'Cant.', 'Precio Unitario', 'Subtotal']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillStyle: 'F', fillColor: [3, 105, 161], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    }
  });

  // Totales al final de la tabla
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`SUBTOTAL: $${invoice.subtotal.toLocaleString('es-AR')}`, 140, finalY);
  doc.text(`IVA (21%): $${invoice.taxAmount.toLocaleString('es-AR')}`, 140, finalY + 7);
  
  doc.setFontSize(12);
  doc.setTextColor(3, 105, 161); // Brand Sky-700
  doc.text(`TOTAL FINAL: $${invoice.total.toLocaleString('es-AR')}`, 140, finalY + 16);

  // Pie de Página
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Este documento es una cotización comercial sin validez fiscal directa.', 14, 280);

  // Descarga directa del documento PDF
  doc.save(`${invoice.id}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`);
};