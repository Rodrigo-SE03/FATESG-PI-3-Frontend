import { Star, StarHalf } from "lucide-react";

type StarRatingProps = {
  value: number;         // 0..5 (incrementos de 0.5)
  onChange: (value: number) => void;
};

const MAX_STARS = 5;

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const toggleSameValue = (newValue: number) => {
    // Se clicar no mesmo valor inteiro → vira meia estrela
    if (newValue === value && Number.isInteger(newValue)) {
      onChange(newValue - 0.5);
      return;
    }

    // Se clicar no mesmo valor meia estrela → vira estrela inteira
    if (newValue === value && !Number.isInteger(newValue)) {
      onChange(Math.ceil(newValue));
      return;
    }

    // Valor diferente → simplesmente aplica
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

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: MAX_STARS }).map((_, i) => {
        const starNumber = i + 1;

        const full = value >= starNumber;
        const half = !full && value >= starNumber - 0.5;

        let Icon = Star;
        if (full) Icon = Star;
        else if (half) Icon = StarHalf;

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

      <span className="ml-2 text-sm">{value}/5</span>
    </div>
  );
};

export default StarRating;