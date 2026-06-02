import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatDate } from "./functions";

/* ----------------- Exportación de Beneficiarios ----------------- */

export const exportToPDFBeneficiaries = async (data, benefitType, spokepersons = [], logoUrl = null) => {
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  const isGas = benefitType === "Gas Comunal";
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  try {
    const logoBase64 = await getBase64Image(logoUrl || '/src/assets/araguaney-img.png');
    doc.addImage(logoBase64, 'PNG', 15, 10, 35, 35);
    doc.addImage(logoBase64, 'PNG', pageWidth - 50, 10, 35, 35);
  } catch (error) {
    console.warn("No se pudo cargar la imagen del Araguaney", error);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("COMUNIDAD EL ARAGUANEY", pageWidth / 2, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("República Bolivariana de Venezuela", pageWidth / 2, 45, { align: "center" });
  doc.text("Ministerio del Poder para las comunas y Movimientos Sociales", pageWidth / 2, 50, { align: "center" });
  doc.text("Rubio-Municipio Junín-Estado Táchira", pageWidth / 2, 55, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("REPORTE DE ENTREGA DE BENEFICIOS", pageWidth / 2, 70, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Beneficio: ${benefitType || "General"}`, 15, 80);
  doc.text(`Fecha de reporte: ${date}`, 15, 87);

  // Generación de la tabla
  const tableColumn = ["Nombre", "Cédula", "Estado", "Cantidad"];
  if (isGas) tableColumn.push("Nº Bombona");

  const tableRows = data.map((b) => {
    const row = [
      b.name,
      b.documentId,
      b.status === "delivered" ? "ENTREGADO" : "PENDIENTE",
      b.status === "delivered" ? (b.quantity || 1) : "-",
    ];
    if (isGas) {
      row.push(b.status === "delivered" ? (b.cylinderNumber || "-") : "-");
    }
    return row;
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 95,
    theme: "grid",
    headStyles: { fillColor: [25, 118, 210] }, // Color Primary de MUI
  });

  const finalY = doc.lastAutoTable.finalY + 30;
  let signatureY = finalY;

  // Add new page if not enough space
  if (signatureY > pageHeight - 40) {
    doc.addPage();
    signatureY = 40;
  }

  const vocerosToPrint = spokepersons.slice(0, 3);
  if (vocerosToPrint.length > 0) {
    const signatureWidth = 50;
    const totalWidth = (signatureWidth * vocerosToPrint.length);
    const totalSpacing = pageWidth - totalWidth;
    const spacing = totalSpacing / (vocerosToPrint.length + 1);

    vocerosToPrint.forEach((v, i) => {
      const xPos = spacing + (i * (signatureWidth + spacing));
      doc.line(xPos, signatureY, xPos + signatureWidth, signatureY);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text((v.fullName || `${v.first_name || ""} ${v.last_name || ""}`).toUpperCase(), xPos + signatureWidth / 2, signatureY + 5, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.text(`${v.documentId || v.id_number}`, xPos + signatureWidth / 2, signatureY + 10, { align: "center" });
    });
  }

  doc.save(`Reporte_Beneficios_${benefitType}_${date}.pdf`);
};

export const exportToExcelBeneficiaries = (data, benefitType) => {
  const date = new Date().toLocaleDateString();
  const isGas = benefitType === "Gas Comunal";

  // Transformar datos para Excel
  const excelData = data.map((b) => {
    const row = {
      "Nombre Completo": b.name,
      Cédula: b.documentId,
      "Estado de Entrega": b.status === "delivered" ? "Entregado" : "Pendiente",
      "Cantidad": b.status === "delivered" ? (b.quantity || 1) : "-",
    };
    if (isGas) {
      row["Nº Bombona"] = b.status === "delivered" ? (b.cylinderNumber || "-") : "-";
    }
    row["Fecha Reporte"] = date;
    return row;
  });

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

const getBase64Image = (imgUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = imgUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (e) => reject(e);
    });
};

export const exportToPDFCitizens = async (data, logoUrl) => {
  const orderedData = orderByHouseNumber(data);
  const doc = new jsPDF();
  const date = new Date().toLocaleDateString();
  const pageWidth = doc.internal.pageSize.getWidth();

  try {
    const logoBase64 = await getBase64Image(logoUrl || '/src/assets/araguaney-img.png');
    doc.addImage(logoBase64, 'PNG', 15, 10, 35, 35);
    doc.addImage(logoBase64, 'PNG', pageWidth - 50, 10, 35, 35);
  } catch (error) {
    console.warn("No se pudo cargar la imagen del Araguaney", error);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("COMUNIDAD EL ARAGUANEY", pageWidth / 2, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("República Bolivariana de Venezuela", pageWidth / 2, 45, { align: "center" });
  doc.text("Ministerio del Poder para las comunas y Movimientos Sociales", pageWidth / 2, 50, { align: "center" });
  doc.text("Rubio-Municipio Junín-Estado Táchira", pageWidth / 2, 55, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("REPORTE DE CIUDADANOS", pageWidth / 2, 70, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${date}`, 15, 80);

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
    startY: 85,
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

/* ----------------- Exportación de Certificados ----------------- */

export const exportResidencyCertificate = async (data, spokepersons, logoUrl) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const date = new Date(data.issueDate || new Date());
  
  const day = date.getDate();
  const month = date.toLocaleString('es-ES', { month: 'long' });
  const year = date.getFullYear();

  try {
    const logoBase64 = await getBase64Image(logoUrl || '/src/assets/araguaney-img.png');
    doc.addImage(logoBase64, 'PNG', 15, 10, 35, 35);
    doc.addImage(logoBase64, 'PNG', pageWidth - 50, 10, 35, 35);
  } catch (error) {
    console.warn("No se pudo cargar la imagen del Araguaney", error);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("COMUNIDAD EL ARAGUANEY", pageWidth / 2, 25, { align: "center" });
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("República Bolivariana de Venezuela", pageWidth / 2, 45, { align: "center" });
  doc.text("Ministerio del Poder para las comunas y Movimientos Sociales", pageWidth / 2, 50, { align: "center" });
  doc.text("Rubio-Municipio Junín-Estado Táchira", pageWidth / 2, 55, { align: "center" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Constancia de residencia", pageWidth / 2, 70, { align: "center" });
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Oficio N.º A CR ${year}`, 15, 80);

  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Determinar nacionalidad basada en el prefijo de la cédula
  const nationality = data.documentId?.startsWith("E-") ? "EXTRANJERA" : "VENEZOLANA";
  
  const mainText = `Nosotros, voceros del consejo comunal EL ARAGUANEY abajo firmantes registrados bajo el código SITUR R-CCOC-18-06-01-034542, RIF número C505665081, Sector 2 código de C.L.P.P. 126 ubicado RUBIO Municipio JUNIN del Estado Táchira. En uso de las atribuciones legales que nos confiere la ley orgánica del Poder Popular y la la ley orgánica de los consejos comunales, por medio de la presente hacemos constar que el ciudadano: ${data.fullName.toUpperCase()}, Titular de cedula de identidad N.º ${data.documentId} de nacionalidad ${nationality}, tiene residencia de habitación en esta comunidad en la siguiente dirección ${data.address.toUpperCase()}, desde hace ${data.residencyYears} años y ${data.residencyMonths} meses.`;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(mainText, margin, 100, { 
    maxWidth: contentWidth, 
    align: "justify" 
  });

  const footerText = `Constancia que se expide a solicitud de la parte interesada para tramites legales a los ${day} días del mes de ${month} de ${year}.`;
  doc.text(footerText, margin, 160, {
    maxWidth: contentWidth
  });
  
  doc.setFont("helvetica", "bold");
  doc.text("VA SIN ENMIENDA", margin, 175);
  
  doc.text("Por el consejo comunal", pageWidth / 2, 190, { align: "center" });
  doc.text("Sello", pageWidth / 2, 215, { align: "center" });

  const vocerosToPrint = spokepersons.slice(0, 3);
  const signatureY = 265;
  const signatureWidth = 50;
  const totalWidth = (signatureWidth * vocerosToPrint.length);
  const totalSpacing = pageWidth - totalWidth;
  const spacing = totalSpacing / (vocerosToPrint.length + 1);

  vocerosToPrint.forEach((v, i) => {
    const xPos = spacing + (i * (signatureWidth + spacing));
    doc.line(xPos, signatureY, xPos + signatureWidth, signatureY);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text((v.fullName || `${v.first_name || ""} ${v.last_name || ""}`).toUpperCase(), xPos + signatureWidth / 2, signatureY + 5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(`${v.documentId || v.id_number}`, xPos + signatureWidth / 2, signatureY + 10, { align: "center" });
  });

  doc.save(`Constancia_Residencia_${data.fullName.replace(/\s+/g, '_')}.pdf`);
};
