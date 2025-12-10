import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Select from "../../components/form/Select";
import Checkbox from "../../components/form/input/Checkbox";
import { useState } from "react";
import { signUp } from "aws-amplify/auth";
import AuthLayout from "../../layout/AuthPageLayout";
import { sha256 } from 'js-sha256';
import Toast from "../../components/common/Toast";
import { ToastData } from "../../components/common/Toast";

// ---- Helpers de senha (mesmos da outra página) ----
type PasswordCriteria = {
  lengthOk: boolean;
  numberOk: boolean;
  upperOk: boolean;
  lowerOk: boolean;
  specialOk: boolean;
};

const getPasswordCriteria = (value: string): PasswordCriteria => ({
  lengthOk: value.length >= 8,
  numberOk: /\d/.test(value),
  upperOk: /[A-Z]/.test(value),
  lowerOk: /[a-z]/.test(value),
  specialOk: /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(value),
});

const getPasswordScore = (c: PasswordCriteria) =>
  [c.lengthOk, c.numberOk, c.upperOk, c.lowerOk, c.specialOk].filter(Boolean)
    .length;

const isStrongPassword = (value: string): boolean => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;
  return regex.test(value);
};

const OkIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const XIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 20 20"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const SignUp = () => {
  localStorage.setItem("theme", "dark");
  const [toastData, setToastData] = useState<ToastData>({ open: false, title: "", message: "", color: "info" });
  const [gender, setGender] = useState("Masculino");
  const [errorMessage, setErrorMessage] = useState("");

  // estados de senha
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const criteria = getPasswordCriteria(password);
  const score = getPasswordScore(criteria);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "");
    const name = String(formData.get("name") || "");
    const username = String(formData.get("username") || "");
    const birthdate = String(formData.get("birthdate") || "");

    // validações de senha reaproveitando a mecânica
    if (!isStrongPassword(password)) {
      setErrorMessage(
        "A senha deve ter no mínimo 8 caracteres e conter número, letra maiúscula, letra minúscula e caractere especial."
      );
      return;
    }

    const birth = new Date(birthdate);
    const today = new Date();

    // calcula data mínima: hoje - 18 anos
    const minAllowed = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    // se a data de nascimento for maior que a data mínima => menor de 18
    if (birth > minAllowed) {
      setErrorMessage("Você deve ter pelo menos 18 anos para se cadastrar.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      return;
    }

    if (!gender) {
      setErrorMessage("Selecione um gênero");
      return;
    }
    const hashedEmail = sha256(email.trim().toLowerCase());
    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name,
            birthdate,
            gender,
            picture:
              `https://gravatar.com/avatar/${hashedEmail}`,
          },
        },
      });

      setToastData({ open: true, title: "Sucesso", message: "Cadastro realizado! Verifique seu e-mail para confirmar sua conta.", color: "success" });
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.message || "Erro ao realizar cadastro. Tente novamente.";
      setErrorMessage(msg);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-xl mx-auto text-light-text dark:text-dark-text">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-md p-6 sm:p-8">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Cadastro
              </h1>
            </div>
            <form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
              <div className="h-[50vh] sm:h-[60vh] pr-2 overflow-y-auto custom-scrollbar md:grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" required />
                </div>
                <div className="md:col-span-1">
                  <Label className="mt-3">Nome</Label>
                  <Input name="name" type="text" required />
                </div>
                <div className="md:col-span-1">
                  <Label className="mt-3">Nome de Usuário</Label>
                  <Input name="username" type="text" required />
                </div>
                <div className="md:col-span-1">
                  <Label className="mt-3">Data de Nascimento</Label>
                  <Input name="birthdate" type="date" required />
                </div>
                <div className="md:col-span-1">
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
                </div>

                {/* Senha + confirmação com toggle de mostrar */}
                <div className="md:col-span-1">
                  <Label className="mt-3">Senha</Label>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="mt-2">
                    <Checkbox
                      label="Mostrar senha"
                      checked={showPassword}
                      onChange={(v: boolean) => setShowPassword(v)}
                    />
                  </div>
                </div>
                <div className="md:col-span-1">
                  <Label className="mt-3">Confirmar Senha</Label>
                  <Input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {/* Checklist dinâmico de força da senha */}
                <div className="md:col-span-2 mt-2 space-y-1" aria-live="polite">
                  <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        score <= 2
                          ? "bg-red-500"
                          : score <= 4
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-xs text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      {criteria.lengthOk ? (
                        <OkIcon className="size-4 text-emerald-600" />
                      ) : (
                        <XIcon className="size-4 text-gray-400" />
                      )}
                      Mínimo de 8 caracteres
                    </li>
                    <li className="flex items-center gap-2">
                      {criteria.numberOk ? (
                        <OkIcon className="size-4 text-emerald-600" />
                      ) : (
                        <XIcon className="size-4 text-gray-400" />
                      )}
                      Pelo menos 1 número
                    </li>
                    <li className="flex items-center gap-2">
                      {criteria.upperOk ? (
                        <OkIcon className="size-4 text-emerald-600" />
                      ) : (
                        <XIcon className="size-4 text-gray-400" />
                      )}
                      Pelo menos 1 letra maiúscula
                    </li>
                    <li className="flex items-center gap-2">
                      {criteria.lowerOk ? (
                        <OkIcon className="size-4 text-emerald-600" />
                      ) : (
                        <XIcon className="size-4 text-gray-400" />
                      )}
                      Pelo menos 1 letra minúscula
                    </li>
                    <li className="flex items-center gap-2 sm:col-span-2">
                      {criteria.specialOk ? (
                        <OkIcon className="size-4 text-emerald-600" />
                      ) : (
                        <XIcon className="size-4 text-gray-400" />
                      )}
                      Pelo menos 1 caractere especial
                    </li>
                  </ul>
                </div>

                {errorMessage && (
                  <div className="md:col-span-2">
                    <p className="text-red-500 mt-4 mb-2 text-md text-center">
                      {errorMessage}
                    </p>
                  </div>
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
              <p className="mt-4 text-sm text-center">
                Já possui uma conta?{" "}
                <a
                  href="/login"
                  className="text-brand-500 hover:underline"
                >
                  Entrar
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toast
        open={toastData.open}
        title={toastData.title}
        message={toastData.message}
        color={toastData.color}
        onClose={() => setToastData((prev) => ({ ...prev, open: false }))}
      />
    </AuthLayout>
  );
};

export default SignUp;