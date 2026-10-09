import { describe, expect, it } from "vitest";
import {
  calcularTotales,
  formatearCuit,
  requiereIdentificarConsumidor,
  tipoComprobante,
  validarCuit,
} from "./facturacion";

describe("validarCuit", () => {
  it("acepta CUIT válidos con o sin guiones", () => {
    expect(validarCuit("20-12345678-6")).toBe(true);
    expect(validarCuit("20123456786")).toBe(true);
    expect(validarCuit("30-71234567-1")).toBe(true);
  });
  it("rechaza dígito verificador incorrecto o largo inválido", () => {
    expect(validarCuit("20-12345678-9")).toBe(false);
    expect(validarCuit("123")).toBe(false);
  });
  it("formatea con guiones", () => {
    expect(formatearCuit("20123456786")).toBe("20-12345678-6");
  });
});

describe("tipoComprobante", () => {
  it("monotributo y exento emiten C", () => {
    expect(tipoComprobante("monotributo", "responsable_inscripto")).toBe("C");
    expect(tipoComprobante("exento", "consumidor_final")).toBe("C");
  });
  it("responsable inscripto: A a otro RI, B al resto", () => {
    expect(tipoComprobante("responsable_inscripto", "responsable_inscripto")).toBe("A");
    expect(tipoComprobante("responsable_inscripto", "monotributo")).toBe("B");
    expect(tipoComprobante("responsable_inscripto", "consumidor_final")).toBe("B");
  });
});

describe("calcularTotales", () => {
  const items = [
    { cantidad: 2, precioUnitarioCents: 10_000_00, alicuota: 21 as const },
    { cantidad: 1, precioUnitarioCents: 5_000_00, alicuota: 10.5 as const },
  ];
  it("discrimina IVA en A y B", () => {
    expect(calcularTotales(items, "A")).toEqual({
      netoCents: 25_000_00,
      ivaCents: 4_200_00 + 525_00,
      totalCents: 29_725_00,
    });
  });
  it("no suma IVA en C", () => {
    expect(calcularTotales(items, "C").totalCents).toBe(25_000_00);
  });
});

describe("requiereIdentificarConsumidor", () => {
  it("exige identificar desde 10 millones", () => {
    expect(requiereIdentificarConsumidor(9_999_999_00)).toBe(false);
    expect(requiereIdentificarConsumidor(10_000_000_00)).toBe(true);
  });
});
