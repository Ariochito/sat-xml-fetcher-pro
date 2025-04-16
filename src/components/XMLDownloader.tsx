
import { XMLDocument } from "@/utils/mockData";
import { useToast } from "@/components/ui/use-toast";

interface XMLDownloaderProps {
  onDownloadComplete?: () => void;
}

const XMLDownloader = ({ onDownloadComplete }: XMLDownloaderProps) => {
  const { toast } = useToast();

  const downloadSingleXML = (document: XMLDocument) => {
    try {
      // Create a blob with the XML content
      const blob = new Blob([document.content], { type: 'text/xml' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.name}.xml`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Descarga completada",
        description: `El archivo ${document.name}.xml ha sido descargado correctamente.`,
      });
      
      if (onDownloadComplete) {
        onDownloadComplete();
      }
      
      return true;
    } catch (error) {
      console.error("Error downloading XML:", error);
      
      toast({
        title: "Error de descarga",
        description: "No se pudo descargar el archivo XML.",
        variant: "destructive",
      });
      
      return false;
    }
  };

  const downloadMultipleXMLs = async (documents: XMLDocument[]) => {
    if (documents.length === 0) {
      toast({
        title: "Aviso",
        description: "No hay documentos seleccionados para descargar.",
      });
      return;
    }
    
    if (documents.length === 1) {
      // If there's only one document, use the single download function
      downloadSingleXML(documents[0]);
      return;
    }
    
    try {
      toast({
        title: "Preparando descarga",
        description: `Preparando ${documents.length} archivos para descarga...`,
      });
      
      // In a real application, we would create a zip file here
      // For this demo, we'll download them sequentially with a delay
      
      for (let i = 0; i < documents.length; i++) {
        // eslint-disable-next-line no-loop-func
        setTimeout(() => {
          downloadSingleXML(documents[i]);
          
          if (i === documents.length - 1 && onDownloadComplete) {
            onDownloadComplete();
          }
        }, i * 500);
      }
      
    } catch (error) {
      console.error("Error downloading multiple XMLs:", error);
      
      toast({
        title: "Error de descarga",
        description: "No se pudieron descargar los archivos XML seleccionados.",
        variant: "destructive",
      });
    }
  };

  return {
    downloadSingleXML,
    downloadMultipleXMLs
  };
};

export default XMLDownloader;
