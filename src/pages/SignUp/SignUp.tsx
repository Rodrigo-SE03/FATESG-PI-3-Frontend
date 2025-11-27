import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import { useState } from "react";
import api from "../../auth/Api";

const SignUp = () => {
  localStorage.setItem("theme", "dark");
  const [gender, setGender] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrorMessage("");
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setErrorMessage("As senhas não coincidem");
      return;
    }
    else {
      alert("Cadastro realizado com sucesso!");
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
          <Label>Nome</Label>
          <Input name="name" type="text" required />
          <Label>Nome de Usuário</Label>
          <Input name="username" type="text" required />
          <Label className="mt-3">Data de Nascimento</Label>
          <Input name="birthdate" type="date" required />
          <Label className="mt-3">Gênero</Label>
          <Select
            options={[
              { value: "male", label: "Masculino" },
              { value: "female", label: "Feminino" },
              { value: "other", label: "Outro" },
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
            Entrar
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