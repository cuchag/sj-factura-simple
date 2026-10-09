/**
 * Reglas básicas de facturación argentina usadas por el producto.
 * Fuente: régimen de factura electrónica de ARCA. Validar alícuotas y tipos vigentes.
 */

export type CondicionIva =
  | "responsable_inscripto"
  | "monotributo"
  | "exento"
  | "consumidor_final";

export type TipoComprobante = "A" | "B" | "C";

/** Alícuotas de IVA vigentes en Argentina (porcentaje). */
export const ALICUOTAS_IVA = [0, 2.5, 5, 10.5, 21, 27] as const;
export type AlicuotaIva = (typeof ALICUOTAS_IVA)[number];

/** Desde este monto ARCA exige identificar al consumidor final (RG 5866/2026, según prensa). */
export const UMBRAL_IDENTIFICACION_CONSUMIDOR_FINAL = 10_000_000;

/** Normaliza un CUIT/CUIL a 11 dígitos sin guiones, o null si no tiene 11 dígitos. */
export function normalizarCuit(valor: string): string | null {
  const digitos = valor.replace(/[\s-]/g, "");
  return /^\d{11}$/.test(digitos) ? digitos : null;
}

/** Valida CUIT/CUIL con el dígito verificador (módulo 11). */
export function validarCuit(valor: string): boolean {
  const cuit = normalizarCuit(valor);
  if (!cuit) return false;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((acc, peso, i) => acc + peso * Number(cuit[i]), 0);
  const resto = 11 - (suma % 11);
  const verificador = resto === 11 ? 0 : resto === 10 ? 9 : resto;
  return verificador === Number(cuit[10]);
}

export function formatearCuit(valor: string): string {
  const c = normalizarCuit(valor);
  return c ? `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}` : valor;
}

/** Qué letra de comprobante corresponde según emisor y receptor. */
export function tipoComprobante(emisor: CondicionIva, receptor: CondicionIva): TipoComprobante {
  if (emisor === "monotributo" || emisor === "exento") return "C";
  if (emisor === "responsable_inscripto") {
    return receptor === "responsable_inscripto" ? "A" : "B";
  }
  throw new Error("Un consumidor final no emite comprobantes");
}

/** Montos en centavos para no perder precisión. */
export function calcularTotales(
  items: { cantidad: number; precioUnitarioCents: number; alicuota: AlicuotaIva }[],
  tipo: TipoComprobante,
) {
  let netoCents = 0;
  let ivaCents = 0;
  for (const item of items) {
    const neto = Math.round(item.cantidad * item.precioUnitarioCents);
    netoCents += neto;
    // En factura C no se discrimina IVA.
    if (tipo !== "C") ivaCents += Math.round((neto * item.alicuota) / 100);
  }
  return { netoCents, ivaCents, totalCents: netoCents + ivaCents };
}

/** ¿Hay que pedir DNI/CUIT al consumidor final para esta operación? */
export function requiereIdentificarConsumidor(totalCents: number): boolean {
  return totalCents / 100 >= UMBRAL_IDENTIFICACION_CONSUMIDOR_FINAL;
}
