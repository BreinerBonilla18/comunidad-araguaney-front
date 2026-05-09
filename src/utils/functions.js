export function normalizeText(value) {
  return (value ?? "").toString().trim();
}

export function isEmpty(value) {
  return !normalizeText(value);
}

export function validateFullName(value) {
  const v = normalizeText(value);
  if (!v) return "Este campo es requerido";
  if (/[0-9]/.test(v)) return "No se permiten números";
  if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\s]+$/.test(v)) return "Solo letras";

  const parts = v.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return "Ingresa nombre y apellido";
  return "";
}

export function normalizeVenezuelanDocumentId(value) {
  const v = normalizeText(value).toUpperCase();
  if (!v) return "";

  const noSpaces = v.replace(/\s+/g, "");
  const match = noSpaces.match(/^(V|E)?-?(\d+)$/);
  if (!match) return "";
  const prefix = match[1] || "";
  const digits = match[2] || "";
  return `${prefix}${prefix ? "-" : ""}${digits}`;
}

export function validateVenezuelanDocumentId(value) {
  const raw = normalizeText(value);
  if (!raw) return "Este campo es requerido";

  const normalized = normalizeVenezuelanDocumentId(raw);
  if (!normalized) return "Formato inválido";

  const digits = normalized.replace(/^(V|E)-/, "").replace(/\D/g, "");
  if (digits.length < 6 || digits.length > 9) return "Longitud inválida";
  if (/^0+$/.test(digits)) return "Número inválido";

  return "";
}

export function validateBirthDate(value) {
  const v = normalizeText(value);
  if (!v) return "Este campo es requerido";

  const date = new Date(v);
  if (isNaN(date.getTime())) return "Fecha inválida";

  const now = new Date();
  if (date.getTime() > now.getTime()) return "No puede ser futura";
  if (date.getFullYear() < 1900) return "Fecha inválida";

  return "";
}

export function validateAddress(value) {
  const v = normalizeText(value);
  if (!v) return "Este campo es requerido";
  return "";
}

export function validateProjectName(value) {
  const v = normalizeText(value);
  if (!v) return "Este campo es requerido";
  if (v.length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (v.length > 100) return "El nombre no puede exceder 100 caracteres";
  return "";
}

export function validateEstimatedCost(value) {
  const v = normalizeText(value);
  if (!v) return "Este campo es requerido";
  
  // Remove currency symbols and spaces for validation
  const cleanValue = v.replace(/[^0-9.]/g, '');
  if (!cleanValue) return "Ingrese un valor válido";
  
  const numericValue = parseFloat(cleanValue);
  if (isNaN(numericValue)) return "Ingrese un número válido";
  if (numericValue <= 0) return "El costo debe ser mayor a 0";
  if (numericValue > 999999999) return "El costo es demasiado elevado";
  
  return "";
}

export function formatDate(dateString) {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
}