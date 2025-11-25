import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { ImagePlus, Pencil } from "lucide-react";

type AvatarPickerProps = {
  value?: string | null;
  onChange?: (file: File | null) => void;
  size?: "small" | "medium" | "large" | "xlarge" | "xxlarge";
  className?: string;
  maxSizeMB?: number;
};

const sizeToTw: Record<NonNullable<AvatarPickerProps["size"]>, string> = {
  small: "h-8 w-8",
  medium: "h-12 w-12",
  large: "h-16 w-16",
  xlarge: "h-20 w-20",
  xxlarge: "h-24 w-24",
};

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  value,
  onChange,
  size = "large",
  className = "",
  maxSizeMB = 5,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // limpa URL de preview quando desmontar ou quando trocar arquivo
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openPicker = () => inputRef.current?.click();

  const handleFile = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (file) {
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        alert(`O arquivo deve ter no máximo ${maxSizeMB} MB.`);
        return;
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    onChange?.(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFile(file);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  const showImage = previewUrl || value || "";

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={onKeyDown}
        className="relative group"
        aria-label="Selecionar foto de perfil"
      >
        {showImage ? (
          <div className="relative">
            <Avatar src={showImage} alt="Foto de perfil" size="xlarge" />
            {/* overlay sutil ao passar o mouse */}
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Pencil className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
            </div>
          </div>
        ) : (
          <div
            className={`${sizeToTw[size]} rounded-full border border-dashed border-gray-300 dark:border-white/20 
            flex items-center justify-center text-gray-400 dark:text-gray-300 cursor-pointer 
            hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-colors`}
          >
            <ImagePlus className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
};

export default AvatarPicker;
