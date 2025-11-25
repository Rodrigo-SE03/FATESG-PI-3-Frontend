import { useEffect, useMemo, useState } from "react";
import Button from "../button/Button";

export type WelcomeStep = {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
};

const welcomeSteps: WelcomeStep[] = [
  {
    imageSrc: "/images/welcomeModal/dashboard.png",
    title: "Seja bem-vindo ao Concillia",
    description:
      "Explore soluções inovadoras para alavancar seu negócio online no universo do Concillia",
  },
  {
    imageSrc: "images/welcomeModal/integracoes.png",
    title: "Conecte integrações",
    description: "Conecte seu marketplace e ERP para consolidar tudo em um só lugar",
  },
  {
    imageSrc: "images/welcomeModal/tabelas.png",
    title: "Acompanhe os relatórios",
    description: "Monitore faturamento, lucro e métricas chave em tempo real",
  },
];

interface WelcomeModalProps {
  steps?: WelcomeStep[];
  initialStep?: number;
  onNextStep?: (nextIndex: number) => void;
  onSkip?: (currentIndex: number) => void;
  onFinish?: () => void;
  className?: string;

  nextLabel?: string;
  skipLabel?: string;
}

export function WelcomeModal({
  steps= welcomeSteps,
  initialStep = 0,
  onNextStep,
  onSkip,
  onFinish,
  className,
  nextLabel,
  skipLabel,
}: WelcomeModalProps) {
  const safeInitial = useMemo(() => {
    if (!steps?.length) return 0;
    return Math.min(Math.max(initialStep, 0), steps.length - 1);
  }, [initialStep, steps]);

  const [index, setIndex] = useState(safeInitial);

  useEffect(() => {
    setIndex(safeInitial);
  }, [safeInitial]);

  if (!steps || steps.length === 0) return null;

  const isLast = index === steps.length - 1;
  const step = steps[index];

  const handleNext = () => {
    if (isLast) {
      onFinish?.();
      return;
    }
    const next = Math.min(index + 1, steps.length - 1);
    setIndex(next);
    onNextStep?.(next);
  };

  const handleSkip = () => {
    onSkip?.(index);
  };

  return (
    <div className={`flex flex-col items-center text-center gap-4 sm:gap-5 ${className ?? ""}`}>
      {/* Imagem */}
      {step.imageSrc && (
        <div className="w-full">
          <img
            src={step.imageSrc}
            alt={step.imageAlt ?? step.title}
            className="w-full h-auto rounded-t-3xl border border-black/5 dark:border-white/10"
          />
        </div>
      )}

      {/* Título e descrição */}
      <div className="px-2">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {step.title}
        </h2>
        <p className="mt-2 text-l text-gray-600 dark:text-gray-300">
          {step.description}
        </p>
      </div>

      {/* Dots */}
      <div
        className="mt-2 flex items-center gap-2"
        role="tablist"
        aria-label="Passos de boas-vindas"
      >
        {steps.map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              onClick={() => setIndex(i)}
              role="tab"
              aria-selected={active}
              aria-label={`Ir para passo ${i + 1}`}
              className={[
                "h-2.5 w-2.5 rounded-full transition-all",
                active
                  ? "w-6 bg-brand-400"
                  : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500",
              ].join(" ")}
            />
          );
        })}
      </div>

      {/* Ações */}
      <div className="mt-2 grid grid-cols-2 gap-3 w-full px-4 mb-5">
        <Button
          variant="outline"
          onClick={handleSkip}
        >
          {skipLabel ?? "Pular"}
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
        >
          {isLast ? (nextLabel ?? "Concluir") : (nextLabel ?? "Próximo")}
        </Button>
      </div>

      {/* Progresso (acessibilidade) */}
      <span className="sr-only" aria-live="polite">
        Passo {index + 1} de {steps.length}
      </span>
    </div>
  );
}
