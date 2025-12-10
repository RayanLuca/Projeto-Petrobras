// Importa os hooks básicos do React
import { useState, useEffect } from 'react';

// Hook do React Router para navegação entre páginas
import { useNavigate } from 'react-router-dom';

// Hook de autenticação vindo do contexto da aplicação
import { useAuth } from '@/contexts/AuthContext';

// Componentes pré-prontos (shadcn/ui) usados no layout
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Biblioteca de notificações
import { toast } from 'sonner';

// Componente principal da página de Autenticação
export default function Auth() {

  // Estados do Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados do Cadastro
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [registerMatricula, setRegisterMatricula] = useState('');

  // Estado da Recuperação de Senha
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Autenticação e navegação
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Se já estiver autenticado, redireciona para o dashboard automaticamente
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Função chamada ao enviar o formulário de login
  const handleLogin = async (e) => {
    e.preventDefault(); // impede reload da página

    if (!loginEmail || !loginPassword) {
      toast.error('Preencha todos os campos');
      return;
    }

    const success = await login(loginEmail, loginPassword);
    if (success) navigate('/dashboard');
  };

  // Função para cadastrar um novo usuário
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validações básicas
    if (!registerName || !registerEmail || !registerPassword || !registerMatricula) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (registerPassword !== registerPasswordConfirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (registerPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    // Chama a função de registro da API
    const success = await register(
      registerName,
      registerEmail,
      registerPassword,
      registerMatricula
    );

    if (success) {
      // Limpa os estados
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterPasswordConfirm('');
      setRegisterMatricula('');
      toast.success('Agora você pode fazer login');
    }
  };

  // Função de recuperação de senha (simulada)
  const handleRecovery = (e) => {
    e.preventDefault();

    if (!recoveryEmail) {
      toast.error('Digite seu email');
      return;
    }

    // Simula envio de email de recuperação
    toast.success('Email de recuperação enviado! (simulado)');
    setRecoveryEmail('');
  };

  // Renderização do layout
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        // Imagem de fundo aplicada direto via style
        backgroundImage: `
          url("https://img.odcdn.com.br/wp-content/uploads/2021/07/HoloLens-Petrobras-1600x1080.jpeg")
        `
      }}
    >
      {/* Card semitransparente com blur */}
      <Card className="w-full max-w-md bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-2xl p-4">
        
        {/* Cabeçalho do card */}
        <CardHeader className="text-center space-y-3">

          {/* Logo centralizado */}
          <div className="mx-auto rounded-full flex items-center justify-center mb-2">
            <img 
              src="logobr.png" 
              alt="Logo"
              className="h-24 w-auto mx-auto"
            />
          </div>

          {/* Título do sistema */}
          <CardTitle className="text-4xl font-extrabold">Sistema de Estoque</CardTitle>
        </CardHeader>

        {/* Parte interna do card */}
        <CardContent className="text-lg">

          {/* Abas (Login, Cadastro, Recuperar) */}
          <Tabs defaultValue="login" className="w-full">

            {/* Botões das abas */}
            <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-md rounded-full text-lg">
              <TabsTrigger value="login" className="text-lg">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-lg">Cadastro</TabsTrigger>
              <TabsTrigger value="recovery" className="text-lg">Recuperar</TabsTrigger>
            </TabsList>

            {/* ABA LOGIN */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">

                {/* Campo Email */}
                <div className="space-y-1">
                  <Label className="text-lg font-medium">Email</Label>
                  <Input
                    className="bg-green-300/60 border border-green-700/70 rounded-full 
                               text-lg text-black placeholder:text-black/60 h-12 px-4"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                {/* Campo Senha */}
                <div className="space-y-1">
                  <Label className="text-lg font-medium">Senha</Label>
                  <Input
                    className="bg-green-300/60 border border-green-700/70 rounded-full 
                               text-lg text-black placeholder:text-black/60 h-12 px-4"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                {/* Botão Entrar */}
                <Button 
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-full text-lg h-12" 
                  type="submit"
                >
                  Entrar
                </Button>
              </form>
            </TabsContent>

            {/* ABA CADASTRO */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">

                {/* Nome completo */}
                <div className="space-y-1">
                  <Label className="text-lg font-medium">Nome Completo</Label>
                  <Input
                    className="bg-green-300/60 border border-green-700/70 rounded-full 
                               text-lg text-black placeholder:text-black/60 h-12 px-4"
                    placeholder="João da Silva"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>

                {/* Matrícula */}
                <div className="space-y-1">
                  <Label className="text-lg font-medium">Matrícula</Label>
                  <Input
                    className="bg-green-300/60 border border-green-700/70 rounded-full 
                               text-lg text-black placeholder:text-black/60 h-12 px-4"
                    placeholder="12345"
                    value={registerMatricula}
                    onChange={(e) => setRegisterMatricula(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label className="text-lg font-medium">Email</Label>
                  <Input
                    className="bg-green-300/60 border border-green-700/70 rounded-full 
                               text-lg text-black placeholder:text-black/60 h-12 px-4"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>

                {/* Senha */}
                <div className="space-y-1">
                  <Label className="text-lg font-medium">Senha</Label>
                  <Input
                    className="bg-green-300/60 border border-green-700/70 rounded-full 
                               text-lg text-black placeholder:text-black/60 h-12 px-4"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-1">
                  <Label className="text-lg font-medium">Confirmar Senha</Label>
                  <Input
                    className="bg-green-300/60 border border-green-700/70 rounded-full 
                               text-lg text-black placeholder:text-black/60 h-12 px-4"
                    type="password"
                    placeholder="••••••••"
                    value={registerPasswordConfirm}
                    onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
                  />
                </div>

                {/* Botão cadastrar */}
                <Button 
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-full text-lg h-12" 
                  type="submit"
                >
                  Cadastrar
                </Button>
              </form>
            </TabsContent>

            {/* ABA RECUPERAÇÃO */}
            <TabsContent value="recovery">
              <form onSubmit={handleRecovery} className="space-y-4 mt-4">

                <div className="space-y-1">
                  <Label className="text-lg font-medium">Email</Label>
                  <Input
                    className="bg-green-300/60 border border-green-700/70 rounded-full 
                               text-lg text-black placeholder:text-black/60 h-12 px-4"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-full text-lg h-12" 
                  type="submit"
                >
                  Enviar Link de Recuperação
                </Button>
              </form>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
