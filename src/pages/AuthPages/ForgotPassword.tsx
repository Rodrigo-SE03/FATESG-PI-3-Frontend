import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { useState } from "react";
import { resetPassword } from "aws-amplify/auth";
import AuthLayout from "../../layout/AuthPageLayout";

const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const identifier = String(formData.get("identifier") || "");

    if (!identifier) {
      setErrorMessage("Preencha seu usuário ou email.");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword({
        username: identifier,
      });

      setSuccessMessage(
        "Email de recuperação enviado! Verifique sua caixa de entrada e spam."
      );
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.message || "Erro ao solicitar recuperação de senha. Tente novamente.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto text-light-text dark:text-dark-text">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-6 sm:p-8">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Esqueceu sua senha?
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Informe seu usuário ou email para receber o link de recuperação
              </p>
            </div>

            <form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
              <Label>Usuário ou Email</Label>
              <Input
                name="identifier"
                type="text"
                className="text-dark-text"
                required
                disabled={isLoading}
              />

              {errorMessage && (
                <p className="text-red-500 mt-4 mb-2 text-md text-center">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p className="text-green-500 mt-4 mb-2 text-md text-center">
                  {successMessage}
                </p>
              )}

              <Button type="submit" className="mt-4" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>

            <div>
              <p className="mt-4 text-sm text-center">
                Lembrou sua senha?{" "}
                <a href="/login" className="text-brand-500 hover:underline">
                  Entrar
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
