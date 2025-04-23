
import React from 'react';
import { Button } from "@/components/ui/button";
import { XMLDocument } from "@/utils/mockData";
import { Download } from "lucide-react";

interface XMLDownloaderProps {
  document?: XMLDocument;
  selectedDocuments?: XMLDocument[];
  onDownloadMultiple?: (documents: XMLDocument[]) => void;
}

const XMLDownloader: React.FC<XMLDownloaderProps> = ({
  document,
  selectedDocuments,
  onDownloadMultiple,
}) => {
  const downloadSingleXML = (doc: XMLDocument) => {
    const blob = new Blob([doc.content], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${doc.name}.xml`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleMultipleDownloads = (docs: XMLDocument[]) => {
    docs.forEach(doc => downloadSingleXML(doc));
  };

  if (document) {
    return (
      <Button onClick={() => downloadSingleXML(document)} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Descargar XML
      </Button>
    );
  }

  if (selectedDocuments && selectedDocuments.length > 0 && onDownloadMultiple) {
    return (
      <Button onClick={() => onDownloadMultiple(selectedDocuments)} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Descargar {selectedDocuments.length} XMLs
      </Button>
    );
  }

  return null;
};

// Export the component and utility functions
export default XMLDownloader;

// Export utility functions separately
export const downloadUtils = {
  downloadSingleXML: (doc: XMLDocument) => {
    const blob = new Blob([doc.content], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${doc.name}.xml`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },
  
  downloadMultipleXMLs: (docs: XMLDocument[]) => {
    docs.forEach(doc => {
      const blob = new Blob([doc.content], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${doc.name}.xml`;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
};
