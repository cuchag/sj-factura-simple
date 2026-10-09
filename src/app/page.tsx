import { calcularTotales, tipoComprobante, validarCuit } from "@/lib/facturacion";

function Ejemplo() {
  const tipo = tipoComprobante("monotributo", "consumidor_final");
  const totales = calcularTotales(
    [{ cantidad: 2, precioUnitarioCents: 15_000_00, alicuota: 21 }],
    tipo,
  );
  return (
    <ul>
      <li>Monotributista que factura a consumidor final: <strong>Factura {tipo}</strong></li>
      <li>2 servicios de $ 15.000: total <strong>{ars(totales.totalCents)}</strong> (sin IVA discriminado)</li>
      <li>CUIT 20-12345678-6: <strong>{validarCuit("20-12345678-6") ? "válido" : "inválido"}</strong></li>
    </ul>
  );
}

export default function Page() {
  return (
    <main className="page">
      <header className="top">
        <p className="eyebrow">San Juan · En construcción</p>
        <h1>Factura Simple · San Juan</h1>
      </header>
      <section className="card">
        <h2>Qué es</h2>
        <p>Facturación electrónica simple para monotributistas y pequeños contribuyentes de San Juan, pensada para venderse a través de estudios contables.</p>
        <p className="muted">Desde el 1/11/2026 ARCA obliga a emitir comprobantes electrónicos a nuevos grupos de pequeños contribuyentes (RG 5893/2026), con una segunda etapa en marzo de 2027.</p>
      </section>
      <section className="card">
        <h2>Reglas de negocio ya implementadas</h2>
        <Ejemplo />
      </section>
      <section className="card">
        <h2>Próximos pasos</h2>
        <ol>
          <li>Alta de clientes y emisión de comprobantes (borrador, sin enviar a ARCA).</li>
          <li>Panel para estudios contables: varios contribuyentes por cuenta.</li>
          <li>Integración real con los web services de ARCA (requiere certificado digital de cada contribuyente).</li>
        </ol>
      </section>
    </main>
  );
}

function ars(cents: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(cents / 100);
}
