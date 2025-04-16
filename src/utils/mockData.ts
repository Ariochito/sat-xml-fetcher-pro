
export interface XMLDocument {
  id: string;
  name: string;
  type: 'factura' | 'nomina' | 'pago' | 'otro';
  date: string;
  amount: number;
  issuer: string;
  receiver: string;
  content: string;
}

export const mockXMLDocuments: XMLDocument[] = [
  {
    id: "FAC-2023-0001",
    name: "Factura-A12345",
    type: "factura",
    date: "2023-11-15",
    amount: 1250.50,
    issuer: "Empresa ABC S.A. de C.V.",
    receiver: "Cliente XYZ S.A.",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" Version="3.3" Serie="A" Folio="12345" Fecha="2023-11-15T10:30:00" FormaPago="01" Moneda="MXN" Total="1250.50" TipoDeComprobante="I">
  <cfdi:Emisor Rfc="ABC010101ABC" Nombre="Empresa ABC S.A. de C.V." RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="XYZ020202XYZ" Nombre="Cliente XYZ S.A." UsoCFDI="G01"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="43211500" Cantidad="1" ClaveUnidad="H87" Descripción="Computadora portátil" ValorUnitario="1250.50" Importe="1250.50">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="1250.50" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="200.08"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
</cfdi:Comprobante>`
  },
  {
    id: "NOM-2023-0002",
    name: "Nomina-B54321",
    type: "nomina",
    date: "2023-11-01",
    amount: 15000.00,
    issuer: "Empresa ABC S.A. de C.V.",
    receiver: "Empleado Juan Pérez",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:nomina12="http://www.sat.gob.mx/nomina12" Version="3.3" Serie="B" Folio="54321" Fecha="2023-11-01T09:15:00" FormaPago="99" Moneda="MXN" Total="15000.00" TipoDeComprobante="N">
  <cfdi:Emisor Rfc="ABC010101ABC" Nombre="Empresa ABC S.A. de C.V." RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="PEJJ890101XYZ" Nombre="Empleado Juan Pérez" UsoCFDI="P01"/>
  <cfdi:Complemento>
    <nomina12:Nomina TipoNomina="O" FechaPago="2023-11-01" FechaInicialPago="2023-10-16" FechaFinalPago="2023-10-31" NumDiasPagados="15">
      <nomina12:Receptor Curp="PEJJ890101HDFXXX01" NumSeguridadSocial="12345678901" FechaInicioRelLaboral="2020-01-15" Antigüedad="P3Y9M16D" TipoContrato="01" TipoRegimen="02" NumEmpleado="EMP001" Departamento="IT" Puesto="Desarrollador" RiesgoPuesto="1" PeriodicidadPago="04" SalarioDiarioIntegrado="1000.00"/>
      <nomina12:Percepciones TotalSueldos="15000.00">
        <nomina12:Percepcion TipoPercepcion="001" Clave="001" Concepto="Sueldo" ImporteGravado="15000.00" ImporteExento="0.00"/>
      </nomina12:Percepciones>
    </nomina12:Nomina>
  </cfdi:Complemento>
</cfdi:Comprobante>`
  },
  {
    id: "PAG-2023-0003",
    name: "Pago-C98765",
    type: "pago",
    date: "2023-11-20",
    amount: 5780.25,
    issuer: "Cliente XYZ S.A.",
    receiver: "Empresa ABC S.A. de C.V.",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" xmlns:pago10="http://www.sat.gob.mx/Pagos" Version="3.3" Serie="C" Folio="98765" Fecha="2023-11-20T14:45:00" FormaPago="99" Moneda="XXX" Total="0" TipoDeComprobante="P">
  <cfdi:Emisor Rfc="XYZ020202XYZ" Nombre="Cliente XYZ S.A." RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="ABC010101ABC" Nombre="Empresa ABC S.A. de C.V." UsoCFDI="P01"/>
  <cfdi:Complemento>
    <pago10:Pagos Version="1.0">
      <pago10:Pago FechaPago="2023-11-20T14:45:00" FormaDePagoP="03" MonedaP="MXN" Monto="5780.25">
        <pago10:DoctoRelacionado IdDocumento="FAC-2023-0001" Serie="A" Folio="12345" MonedaDR="MXN" MetodoDePagoDR="PPD" NumParcialidad="1" ImpSaldoAnt="5780.25" ImpPagado="5780.25" ImpSaldoInsoluto="0.00"/>
      </pago10:Pago>
    </pago10:Pagos>
  </cfdi:Complemento>
</cfdi:Comprobante>`
  },
  {
    id: "OTR-2023-0004",
    name: "Otro-D13579",
    type: "otro",
    date: "2023-11-25",
    amount: 3450.75,
    issuer: "Proveedor DEF S.A.",
    receiver: "Empresa ABC S.A. de C.V.",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/3" Version="3.3" Serie="D" Folio="13579" Fecha="2023-11-25T16:20:00" FormaPago="01" Moneda="MXN" Total="3450.75" TipoDeComprobante="I">
  <cfdi:Emisor Rfc="DEF030303DEF" Nombre="Proveedor DEF S.A." RegimenFiscal="601"/>
  <cfdi:Receptor Rfc="ABC010101ABC" Nombre="Empresa ABC S.A. de C.V." UsoCFDI="G03"/>
  <cfdi:Conceptos>
    <cfdi:Concepto ClaveProdServ="31161500" Cantidad="3" ClaveUnidad="H87" Descripción="Material de oficina" ValorUnitario="1150.25" Importe="3450.75">
      <cfdi:Impuestos>
        <cfdi:Traslados>
          <cfdi:Traslado Base="3450.75" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.160000" Importe="552.12"/>
        </cfdi:Traslados>
      </cfdi:Impuestos>
    </cfdi:Concepto>
  </cfdi:Conceptos>
</cfdi:Comprobante>`
  }
];
