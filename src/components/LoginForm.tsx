
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileUp, UserCircle } from "lucide-react";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [authMethod, setAuthMethod] = useState<"rfc" | "certificate">("rfc");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      if (authMethod === "rfc" && username && password) {
        toast({
          title: "Autenticación exitosa",
          description: "Conexión establecida con el SAT",
        });
        onLoginSuccess();
      } else if (authMethod === "certificate" && certificateFile && keyFile && password) {
        toast({
          title: "Autenticación con certificado exitosa",
          description: "Conexión establecida con el SAT",
        });
        onLoginSuccess();
      } else {
        toast({
          title: "Error de autenticación",
          description: "Por favor verifique sus credenciales",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">SAT XML Fetcher Pro</CardTitle>
        <CardDescription>
          Seleccione su método de autenticación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4">
            <Button 
              variant={authMethod === "rfc" ? "default" : "outline"}
              onClick={() => setAuthMethod("rfc")}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              RFC y Contraseña
            </Button>
            <Button 
              variant={authMethod === "certificate" ? "default" : "outline"}
              onClick={() => setAuthMethod("certificate")}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Certificado Digital
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMethod === "rfc" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">RFC o e.firma</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su RFC o e.firma"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Certificado (.cer)</Label>
                <Input
                  type="file"
                  accept=".cer"
                  onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Llave Privada (.key)</Label>
                <Input
                  type="file"
                  accept=".key"
                  onChange={(e) => setKeyFile(e.target.files?.[0] || null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-password">Contraseña</Label>
                <Input
                  id="cert-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña de certificado"
                  required
                />
              </div>
            </>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Autenticando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-gray-500">
        Este es un sistema de demostración para descargar XML del SAT
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
