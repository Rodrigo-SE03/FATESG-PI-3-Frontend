import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import api from "../../auth/Api";

const SignIn = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log("Submitting:", { email, password });
  };

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center bg-gray-600 px-4">
      <div className="p-6 borderborder-dark-border rounded-2xl bg-dark-bg-alt text-dark-text mx-auto max-w-lg w-full">
        <h3 className="title-text text-2xl">Entrar</h3>
        <form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
          <Label>Email</Label>
          <Input name="email" type="email" required />
          <Label className="mt-3">Senha</Label>
          <Input name="password" type="password" required />
          <button
            type="submit"
            className="mt-4 bg-button-primary text-white py-2 px-4 rounded hover:bg-brand-700 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;