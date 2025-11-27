import { useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { confirmSignUp } from "aws-amplify/auth";

const ConfirmSignUp = () => {
  localStorage.setItem("theme", "dark");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(e.currentTarget);
    const username = String(formData.get("username") || "");
    const code = String(formData.get("code") || "");

    if (!username || !code) {
      setErrorMessage("Preencha usuário e código.");
      return;
    }

    try {
      await confirmSignUp({
        username,
        confirmationCode: code,
      });

      setSuccessMessage("Conta confirmada com sucesso! Você já pode fazer login.");
      // se quiser redirecionar direto:
      // window.location.href = "/login";
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.message || "Erro ao confirmar cadastro. Verifique o código e tente novamente.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center bg-gray-600 px-4">
      <div className="p-6 borderborder-dark-border rounded-2xl bg-dark-bg-alt text-dark-text mx-auto max-w-lg w-full">
        <h3 className="title-text text-2xl">Confirmar Cadastro</h3>
        <form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
          <div className="h-[40vh] pr-2 overflow-y-auto custom-scrollbar">
            <Label>Nome de Usuário</Label>
            <Input name="username" type="text" required />

            <Label className="mt-3">Código de Confirmação</Label>
            <Input name="code" type="text" required />

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
          </div>

          <Button
            type="submit"
            className="mt-4 bg-button-primary text-white py-2 px-4 rounded hover:bg-brand-700 transition-colors"
          >
            Confirmar
          </Button>
        </form>

        <div>
          <p className="mt-4 text-sm text-center text-dark-text">
            Já confirmou sua conta?{" "}
            <a href="/login" className="text-brand-500 hover:underline">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSignUp;