
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, FileArchive } from "lucide-react";
import { type XMLDocument } from "@/utils/mockData";

interface XMLTableProps {
  documents: XMLDocument[];
  onViewDocument: (document: XMLDocument) => void;
  onDownloadSelected: (documents: XMLDocument[]) => void;
}

const documentTypeColors = {
  factura: "bg-blue-100 text-blue-800",
  nomina: "bg-green-100 text-green-800",
  pago: "bg-purple-100 text-purple-800",
  otro: "bg-gray-100 text-gray-800"
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency: 'MXN' 
  }).format(amount);
};

const XMLTable = ({ documents, onViewDocument, onDownloadSelected }: XMLTableProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<XMLDocument[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments([...documents]);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectDocument = (document: XMLDocument) => {
    const isSelected = selectedDocuments.some(doc => doc.id === document.id);
    
    if (isSelected) {
      setSelectedDocuments(selectedDocuments.filter(doc => doc.id !== document.id));
      setSelectAll(false);
    } else {
      setSelectedDocuments([...selectedDocuments, document]);
      if (selectedDocuments.length + 1 === documents.length) {
        setSelectAll(true);
      }
    }
  };

  const isDocumentSelected = (document: XMLDocument) => {
    return selectedDocuments.some(doc => doc.id === document.id);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Documentos XML disponibles</CardTitle>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDownloadSelected(selectedDocuments)}
            disabled={selectedDocuments.length === 0}
            className="flex items-center"
          >
            <FileArchive className="mr-2 h-4 w-4" />
            Descargar seleccionados ({selectedDocuments.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll} 
                    aria-label="Seleccionar todos"
                  />
                </TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Emisor / Receptor</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No se encontraron documentos en el rango de fechas seleccionado
                  </TableCell>
                </TableRow>
              ) : (
                documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <Checkbox 
                        checked={isDocumentSelected(document)} 
                        onCheckedChange={() => handleSelectDocument(document)}
                        aria-label={`Seleccionar ${document.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{document.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={documentTypeColors[document.type]}>
                        {document.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{document.date}</TableCell>
                    <TableCell>{formatCurrency(document.amount)}</TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      <div className="truncate" title={document.issuer}>
                        <span className="font-medium">De:</span> {document.issuer}
                      </div>
                      <div className="truncate" title={document.receiver}>
                        <span className="font-medium">Para:</span> {document.receiver}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => onViewDocument(document)}
                          title="Vista previa"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => onDownloadSelected([document])}
                          title="Descargar"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default XMLTable;
