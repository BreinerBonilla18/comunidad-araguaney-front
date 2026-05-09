import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatDate } from "./functions";

/* ----------------- Exportación de Beneficiarios ----------------- */

export const exportToPDFBeneficiaries = (data, benefitType) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Configuración de encabezado
  doc.setFontSize(18);
  doc.text("REPORTE DE ENTREGA DE BENEFICIOS", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Beneficio: ${benefitType || "General"}`, 14, 30);
  doc.text(`Fecha de reporte: ${date}`, 14, 37);

  // Generación de la tabla
  const tableColumn = ["Nombre Completo", "Cédula", "Estado"];
  const tableRows = data.map((b) => [
    b.name,
    b.documentId,
    b.status === "delivered" ? "ENTREGADO" : "PENDIENTE",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    theme: "grid",
    headStyles: { fillColor: [25, 118, 210] }, // Color Primary de MUI
  });

  doc.save(`Reporte_Beneficios_${benefitType}_${date}.pdf`);
};

export const exportToExcelBeneficiaries = (data, benefitType) => {
  const date = new Date().toLocaleDateString();

  // Transformar datos para Excel
  const excelData = data.map((b) => ({
    "Nombre Completo": b.name,
    Cédula: b.documentId,
    "Estado de Entrega": b.status === "delivered" ? "Entregado" : "Pendiente",
    "Fecha Reporte": date,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Beneficiarios");

  XLSX.writeFile(workbook, `Reporte_${benefitType}_${date}.xlsx`);
};

/* ----------------- Exportación de Proyectos ----------------- */

export const exportToPDFProjects = (data) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Configuración de encabezado
  doc.setFontSize(18);
  doc.text("REPORTE DE PROYECTOS COMUNITARIOS", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${date}`, 14, 30);

  // Generación de la tabla
  const tableColumn = ["Nombre del Proyecto", "Descripción", "Estado", "Costo Estimado", "Fecha Inicio"];
  const tableRows = data.map((p) => [
    p.name,
    p.description,
    p.status === "completed" ? "Completado" : p.status === "in_progress" ? "En Proceso" : "Pendiente",
    p.estimated_cost,
    formatDate(p.start_date),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "grid",
    headStyles: { fillColor: [25, 118, 210] }, // Color Primary de MUI
  });

  doc.save(`Reporte_Proyectos_${date}.pdf`);
};

export const exportToExcelProjects = (data) => {
  const date = new Date().toLocaleDateString();

  // Transformar datos para Excel
  const excelData = data.map((p) => ({
    "Nombre del Proyecto": p.name,
    Descripción: p.description,
    Estado: p.status === "completed" ? "Completado" : p.status === "in_progress" ? "En Proceso" : "Pendiente",
    "Costo Estimado": p.estimated_cost,
    "Fecha Inicio": formatDate(p.start_date),
    "Fecha Reporte": date,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Proyectos");

  XLSX.writeFile(workbook, `Reporte_Proyectos_${date}.xlsx`);
};

/* ----------------- Exportación de Finanzas ----------------- */

const getTransactionType = (type) => {
  switch (type) {
    case "income":
      return "Ingreso";
    case "expense":
      return "Egreso";
    default:
      return "";
  }
};

export const exportToPDFFinances = (data) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Configuración de encabezado
  doc.setFontSize(18);
  doc.text("REPORTE DE FINANZAS COMUNITARIAS", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${date}`, 14, 30);
  // Generación de la tabla
  const tableColumn = ["Concepto", "Monto", "Tipo de Transacción" ,"Fecha"];
  const tableRows = data.map((f) => [
    f.description,
    f.amount,
    getTransactionType(f.transaction_type),
    formatDate(f.transaction_date),
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "grid",
    headStyles: { fillColor: [25, 118, 210] }, // Color Primary de MUI
  });

  doc.save(`Reporte_Finanzas_${date}.pdf`);
};

export const exportToExcelFinances = (data) => {
  const date = new Date().toLocaleDateString();

  // Transformar datos para Excel
  const excelData = data.map((f) => ({
    Concepto: f.description,
    Monto: f.amount,
    "Tipo de Transacción": getTransactionType(f.transaction_type),
    Fecha: formatDate(f.transaction_date),
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Finanzas");

  XLSX.writeFile(workbook, `Reporte_Finanzas_${date}.xlsx`);
};

/* ----------------- Exportación de Ciudadanos ----------------- */

//4-18, 4-32, 5-12, 5-13
const orderByHouseNumber = (data) => {
    return data.sort((a, b) => {
        const aNum = parseInt(a.house_number.split("-")[1]);
        const bNum = parseInt(b.house_number.split("-")[1]);
        return aNum - bNum;
    });
};

export const exportToPDFCitizens = (data) => {
  const orderedData = orderByHouseNumber(data);
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();

  // Configuración de encabezado
  doc.setFontSize(18);
  doc.text("REPORTE DE CIUDADANOS", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${date}`, 14, 30);

  // Generación de la tabla
  const tableColumn = ["Nombre Completo", "Cédula", "Teléfono", "Número de Casa", "Género"];
  const tableRows = orderedData.map((c) => [
    c.first_name + " " + c.last_name,
    c.id_number,
    c.phone_number,
    c.house_number,
    c.gender === "M" ? "Masculino" : "Femenino",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "grid",
    headStyles: { fillColor: [25, 118, 210] }, // Color Primary de MUI
  });

  doc.save(`Reporte_Ciudadanos_${date}.pdf`);
};

export const exportToExcelCitizens = (data) => {
  const date = new Date().toLocaleDateString();
  const orderedData = orderByHouseNumber(data);

  // Transformar datos para Excel
  const excelData = orderedData.map((c) => ({
    "Nombre Completo": c.first_name + " " + c.last_name,
    Cédula: c.id_number,
    Teléfono: c.phone_number,
    "Número de Casa": c.house_number,
    Género: c.gender === "M" ? "Masculino" : "Femenino",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ciudadanos");

  XLSX.writeFile(workbook, `Reporte_Ciudadanos_${date}.xlsx`);
};
