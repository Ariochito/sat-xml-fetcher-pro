import { useState } from "react";
import { mockXMLDocuments } from "@/utils/mockData";
import LoginForm from "@/components/LoginForm";
import DateRangeSelector from "@/components/DateRangeSelector";
import XMLTable from "@/components/XMLTable";
import XMLPreview from "@/components/XMLPreview";
import XMLDownloader, { downloadUtils } from "@/components/XMLDownloader";
import { XMLDocument } from "@/utils/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { FileDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [documents, setDocuments] = useState<XMLDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<XMLDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { downloadSingleXML, downloadMultipleXMLs } = downloadUtils;

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDocuments([]);
    setSelectedDocument(null);
  };

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setIsSearching(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Filter mock data based on date range (simple string comparison for demo)
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
      
      const filteredDocuments = mockXMLDocuments.filter(doc => {
        return doc.date >= startDateString && doc.date <= endDateString;
      });
      
      setDocuments(filteredDocuments);
      setIsSearching(false);
    }, 1000);
  };

  const handleViewDocument = (document: XMLDocument) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleDownloadSelected = (selectedDocs: XMLDocument[]) => {
    downloadMultipleXMLs(selectedDocs);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="w-full max-w-md mb-8 text-center">
          <div className="flex justify-center mb-4">
            <FileDown className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SAT XML Fetcher Pro</h1>
          <p className="text-gray-600">
            Aplicación para la descarga de documentos XML desde el portal del SAT
          </p>
        </div>
        
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FileDown className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">SAT XML Fetcher Pro</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <DateRangeSelector onDateRangeChange={(startDate, endDate) => {
          setIsSearching(true);
          
          // Simulate API call with a delay
          setTimeout(() => {
            // Filter mock data based on date range (simple string comparison for demo)
            const startDateString = startDate.toISOString().split('T')[0];
            const endDateString = endDate.toISOString().split('T')[0];
            
            const filteredDocuments = mockXMLDocuments.filter(doc => {
              return doc.date >= startDateString && doc.date <= endDateString;
            });
            
            setDocuments(filteredDocuments);
            setIsSearching(false);
          }, 1000);
        }} />
        
        {isSearching ? (
          <Card>
            <CardContent className="flex justify-center items-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Buscando documentos XML...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <XMLTable 
            documents={documents} 
            onViewDocument={handleViewDocument} 
            onDownloadSelected={handleDownloadSelected} 
          />
        )}
      </main>
      
      <XMLPreview 
        document={selectedDocument} 
        open={isPreviewOpen} 
        onOpenChange={setIsPreviewOpen}
        onDownload={downloadSingleXML}
      />
    </div>
  );
};

export default Index;
