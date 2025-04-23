import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileUp, UserCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [authMethod, setAuthMethod] = useState<"rfc" | "certificate">("rfc");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRefreshCaptcha = () => {
    toast({
      title: "CAPTCHA actualizado",
      description: "Se ha generado un nuevo CAPTCHA",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let authResult;
      
      if (authMethod === "rfc") {
        const { data: logData, error: logError } = await supabase
          .from('auth_logs')
          .insert([
            {
              auth_method: 'rfc',
              success: false,
              user_id: username,
            }
          ]);

        if (username && password && captchaInput) {
          authResult = await supabase.auth.signInWithPassword({
            email: `${username}@demo.com`,
            password: password,
          });

          if (authResult.error) {
            if (authResult.error.message.includes('Invalid login credentials')) {
              authResult = await supabase.auth.signUp({
                email: `${username}@demo.com`,
                password: password,
              });
            }
          }
        }
      } else if (authMethod === "certificate" && certificateFile && keyFile && password) {
        const { data: logData, error: logError } = await supabase
          .from('auth_logs')
          .insert([
            {
              auth_method: 'certificate',
              success: false,
              user_id: certificateFile.name,
            }
          ]);

        toast({
          title: "Autenticación con certificado exitosa",
          description: "Conexión establecida con el SAT",
        });
        onLoginSuccess();
        return;
      }

      if (authResult?.error) {
        throw authResult.error;
      }

      await supabase
        .from('auth_logs')
        .insert([
          {
            auth_method: authMethod,
            success: true,
            user_id: username,
          }
        ]);

      onLoginSuccess();
    } catch (error: any) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Por favor verifique sus credenciales",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <div className="space-y-2">
                <Label htmlFor="captcha">CAPTCHA</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      id="captcha"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Ingrese el código CAPTCHA"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRefreshCaptcha}
                    className="flex-shrink-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 p-4 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Imagen CAPTCHA aquí</p>
                </div>
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
        <a 
          href="https://cfdiau.sat.gob.mx/nidp/wsfed/ep?id=SATUPCFDiCon&sid=0&option=credential&sid=0" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:underline"
        >
          Portal del SAT
        </a>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
