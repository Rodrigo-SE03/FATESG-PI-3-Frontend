import { CheckCircle, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../../layout/AuthPageLayout";
import { useEffect, useState } from "react";
import { confirmSignUp } from "aws-amplify/auth";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const confirmAccount = async () => {
      const code = searchParams.get("code");
      const username = searchParams.get("username");

      if (!code || !username) {
        setStatus("error");
        setErrorMessage("Parâmetros de confirmação inválidos.");
        return;
      }

      try {
        await confirmSignUp({
          username,
          confirmationCode: code,
        });
        setStatus("success");
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        const msg =
          err?.message || "Erro ao confirmar cadastro. Verifique o código e tente novamente.";
        setErrorMessage(msg);
      }
    };

    confirmAccount();
  }, [searchParams]);

  return (
    <AuthLayout>
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto text-light-text dark:text-dark-text">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              {status === "loading" && (
                <>
                  <h1 className="mb-4 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                    Verificando Conta
                  </h1>
                  <LoadingSpinner />
                  <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                    Aguarde enquanto confirmamos sua conta...
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <h1 className="mb-4 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                    Conta Verificada
                  </h1>
                  <CheckCircle
                    className="text-green-500 dark:text-green-400"
                    size={64}
                    strokeWidth={2}
                  />
                  <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                    Sua conta foi verificada.{" "}
                    <Link
                      to="/login"
                      className="text-brand-500 hover:underline font-medium"
                    >
                      Entrar
                    </Link>
                  </p>
                </>
              )}

              {status === "error" && (
                <>
                  <h1 className="mb-4 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                    Erro na Verificação
                  </h1>
                  <XCircle
                    className="text-red-500 dark:text-red-400"
                    size={64}
                    strokeWidth={2}
                  />
                  <p className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                    {errorMessage}
                  </p>
                  <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    <Link
                      to="/login"
                      className="text-brand-500 hover:underline font-medium"
                    >
                      Voltar para login
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Confirmation;