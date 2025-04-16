
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { type XMLDocument } from "@/utils/mockData";

interface XMLPreviewProps {
  document: XMLDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: (document: XMLDocument) => void;
}

const formatXML = (xml: string): string => {
  let formatted = '';
  let indent = '';
  const tab = '  ';
  xml.split(/>\s*</).forEach((node) => {
    if (node.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }
    formatted += indent + '<' + node + '>\n';
    if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) {
      indent += tab;
    }
  });
  return formatted.substring(1, formatted.length - 2);
};

const highlightXML = (xml: string): string => {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("[^"]*")/g, '<span class="value">$1</span>')
    .replace(/&lt;(\/?[a-zA-Z0-9:]+)(\s|&gt;)/g, '&lt;<span class="tag">$1</span>$2')
    .replace(/([a-zA-Z0-9:]+)=/g, '<span class="attr">$1</span>=');
};

const XMLPreview = ({ document, open, onOpenChange, onDownload }: XMLPreviewProps) => {
  const [copied, setCopied] = useState(false);
  
  if (!document) return null;
  
  const formattedXML = formatXML(document.content);
  const highlightedXML = highlightXML(formattedXML);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Vista previa: {document.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="formatted" className="flex-1 flex flex-col mt-4">
          <TabsList>
            <TabsTrigger value="formatted">Formateado</TabsTrigger>
            <TabsTrigger value="raw">XML Crudo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formatted" className="flex-1 mt-4">
            <ScrollArea className="h-[60vh] border rounded-md">
              <div className="p-4 xml-highlight">
                <pre dangerouslySetInnerHTML={{ __html: highlightedXML }} />
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="raw" className="flex-1 mt-4">
            <ScrollArea className="h-[60vh] border rounded-md">
              <div className="p-4 font-mono text-sm">
                <pre>{document.content}</pre>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4 flex justify-between">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copiado" : "Copiar XML"}
          </Button>
          <Button onClick={() => onDownload(document)}>
            <Download className="h-4 w-4 mr-2" />
            Descargar XML
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default XMLPreview;
