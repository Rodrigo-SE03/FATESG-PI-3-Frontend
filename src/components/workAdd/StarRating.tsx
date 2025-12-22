import React from "react";
import { Star, StarHalf } from "lucide-react";

type StarRatingProps = {
  value: number; // 0..6 (incrementos de 0.5 até 5; 6 só inteiro)
  onChange: (value: number) => void;
  allowSixStar?: boolean; // default: true
  sixStarLabel?: string; // texto acessível
};

const MAX_STARS = 5;

const clamp = (v: number) => Math.max(0, Math.min(6, v));

const isHalf = (v: number) => !Number.isInteger(v);

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  allowSixStar = true,
  sixStarLabel = "6 estrelas (favorito da categoria)",
}) => {
  const safeValue = clamp(value);

  const toggleSameValue = (newValue: number) => {
    // Não existe 5.5 nem 6 com meia
    if (newValue === 5.5) newValue = 5;

    // Clique em 6 sempre define 6 (sem toggle)
    if (newValue === 6) {
      onChange(6);
      return;
    }

    // Se atualmente é 6 e clicou em algo <= 5, apenas aplica (sem “descer meia” por regra especial)
    if (safeValue === 6) {
      onChange(newValue);
      return;
    }

    // Se clicar no mesmo valor inteiro → vira meia estrela (até 5)
    if (newValue === safeValue && Number.isInteger(newValue) && newValue <= 5) {
      onChange(newValue - 0.5);
      return;
    }

    // Se clicar no mesmo valor meia estrela → vira estrela inteira
    if (newValue === safeValue && isHalf(newValue)) {
      onChange(Math.ceil(newValue));
      return;
    }

    onChange(newValue);
  };

  const handleClick = (starIndex: number, half: "left" | "right") => {
    const proposedValue = half === "left" ? starIndex - 0.5 : starIndex;
    toggleSameValue(proposedValue);
  };

  const handleKey = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    starIndex: number,
    half: "left" | "right"
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(starIndex, half);
    }
  };

  const handleSixClick = () => {
    if (!allowSixStar) return;
    onChange(safeValue === 6 ? 5 : 6);
  };

  const handleSixKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!allowSixStar) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSixClick();
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_STARS }).map((_, i) => {
        const starNumber = i + 1;

        const full = safeValue >= starNumber; // 6 também deixa as 5 cheias
        const half = safeValue < starNumber && safeValue >= starNumber - 0.5;

        let Icon = Star;
        if (half) Icon = StarHalf;

        return (
          <div key={starNumber} className="relative w-6 h-6">
            {/* metade esquerda */}
            <button
              type="button"
              aria-label={`${starNumber - 0.5} estrelas`}
              className="absolute inset-y-0 left-0 w-1/2"
              onClick={() => handleClick(starNumber, "left")}
              onKeyDown={(e) => handleKey(e, starNumber, "left")}
            />

            {/* metade direita */}
            <button
              type="button"
              aria-label={`${starNumber} estrelas`}
              className="absolute inset-y-0 right-0 w-1/2"
              onClick={() => handleClick(starNumber, "right")}
              onKeyDown={(e) => handleKey(e, starNumber, "right")}
            />

            <Icon
              className={`w-6 h-6 pointer-events-none ${
                full || half ? "opacity-100" : "opacity-30"
              }`}
              strokeWidth={1.5}
              fill={full ? "currentColor" : "none"}
            />
          </div>
        );
      })}

      {/* 6ª estrela (dourada) */}
      {allowSixStar && (
        <button
          type="button"
          aria-label={sixStarLabel}
          className="ml-1 inline-flex items-center justify-center w-6 h-6"
          onClick={handleSixClick}
          onKeyDown={handleSixKey}
        >
          <Star
            className={`w-6 h-6 ${
              safeValue === 6 ? "opacity-100" : "opacity-30"
            } text-yellow-400`}
            strokeWidth={1.5}
            fill={safeValue === 6 ? "currentColor" : "none"}
          />
        </button>
      )}

      <span className="ml-2 text-sm">
        {safeValue === 6 ? "6/5" : `${safeValue}/5`}
      </span>
    </div>
  );
};

export default StarRating;
