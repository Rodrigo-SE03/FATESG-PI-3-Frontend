import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useAuth } from "../../auth/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const SignIn = () => {
  localStorage.setItem("theme", "dark");

  const { reloadUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const identifier = String(formData.get("identifier") || "");
    const password = String(formData.get("password") || "");

    if (!identifier || !password) {
      setErrorMessage("Preencha usuário/email e senha.");
      return;
    }

    try {
      await signIn({
        username: identifier,
        password,
      });

      // atualizar o contexto com dados reais do Cognito
      await reloadUser();

      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error(err);

      let msg =
        err?.message || "Erro ao fazer login. Verifique suas credenciais.";

      // opcional: mensagens mais amigáveis para Cognito
      if (msg.includes("User is not confirmed")) {
        msg = "Sua conta ainda não está confirmada. Verifique seu e-mail.";
      }
      if (msg.includes("Incorrect username or password")) {
        msg = "Usuário ou senha incorretos.";
      }

      setErrorMessage(msg);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-600 px-4">
      <div className="p-6 borderborder-dark-border rounded-2xl bg-dark-bg-alt text-dark-text mx-auto max-w-lg w-full">
        <h3 className="title-text text-2xl">Entrar</h3>

        <form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
          <Label className="text-dark-text">Usuário ou Email</Label>
          <Input name="identifier" type="text" className="text-dark-text" required />

          <Label className="mt-3 text-dark-text">Senha</Label>
          <Input name="password" type="password" className="text-dark-text" required />

          {errorMessage && (
            <p className="text-red-500 mt-4 mb-2 text-md text-center">
              {errorMessage}
            </p>
          )}

          <Button type="submit" className="mt-4">
            Entrar
          </Button>
        </form>

        <div>
          <p className="mt-4 text-sm text-center text-dark-text">
            Não tem uma conta?{" "}
            <a href="/signup" className="text-brand-500 hover:underline">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;