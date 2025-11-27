import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import { useState } from "react";
import { signUp } from "aws-amplify/auth"

const SignUp = () => {
  localStorage.setItem("theme", "dark");
  const [gender, setGender] = useState("Masculino");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "");
    const name = String(formData.get("name") || "");
    const username = String(formData.get("username") || "");
    const birthdate = String(formData.get("birthdate") || "");
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    if (!gender) {
      setErrorMessage("Selecione um gênero");
      return;
    }

    try {
      // aqui você escolhe se o username será o campo username ou o próprio email
      await signUp({
        username, // ou: username: email
        password,
        options: {
          userAttributes: {
            email,
            name,
            birthdate, // "YYYY-MM-DD" (igual vem do input date)
            gender,    // "male" | "female" | "other"
            picture: "https://extra-images-storage.s3.sa-east-1.amazonaws.com/contexto.webp"
          },
        },
      });

      alert(
        "Cadastro realizado com sucesso! Verifique seu e-mail para o código de confirmação."
      );
      // se quiser, pode redirecionar:
      window.location.href = "/confirm-signup";
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.message || "Erro ao realizar cadastro. Tente novamente.";
      setErrorMessage(msg);
    }
  };
  return (
    <div className="h-[100vh] flex flex-col items-center justify-center bg-gray-600 px-4">
      <div className="p-6 borderborder-dark-border rounded-2xl bg-dark-bg-alt text-dark-text mx-auto max-w-lg w-full">
        <h3 className="title-text text-2xl">Cadastro</h3>
        <form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
          <div className="h-[50vh] pr-2 overflow-y-auto custom-scrollbar">
          <Label>Email</Label>
          <Input name="email" type="email" required />
          <Label className="mt-3">Nome</Label>
          <Input name="name" type="text" required />
          <Label className="mt-3">Nome de Usuário</Label>
          <Input name="username" type="text" required />
          <Label className="mt-3">Data de Nascimento</Label>
          <Input name="birthdate" type="date" required />
          <Label className="mt-3">Gênero</Label>
          <Select
            options={[
              { value: "Masculino", label: "Masculino" },
              { value: "Feminino", label: "Feminino" },
              { value: "Outro", label: "Outro" },
            ]}
            value={gender}
            onChange={setGender}
            placeholder="Selecione o gênero"
            required
          />
          <Label className="mt-3">Senha</Label>
          <Input name="password" type="password" required minLength={6} />
          <Label className="mt-3">Confirmar Senha</Label>
          <Input name="confirmPassword" type="password" required />
          {errorMessage && (
            <p className="text-red-500 mt-4 mb-2 text-md text-center">{errorMessage}</p>
          )}
          </div>
          <Button
            type="submit"
            className="mt-4 bg-button-primary text-white py-2 px-4 rounded hover:bg-brand-700 transition-colors"
          >
            Cadastrar
          </Button>
        </form>
        <div>
          <p className="mt-4 text-sm text-center text-dark-text">
            Já possui uma conta? <a href="/login" className="text-brand-500 hover:underline">Entrar</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;