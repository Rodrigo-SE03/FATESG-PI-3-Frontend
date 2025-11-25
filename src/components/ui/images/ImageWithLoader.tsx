import React, { useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "../spinner/LoadingSpinner";
type Props = {
  src?: string | null;
  alt: string;
  className?: string; // tamanho e borda do container
  placeholderSrc?: string;
  spinnerSize?: number;
  eager?: boolean; // opcional: força carregar já (sem lazy), útil em tabelas
  timeoutMs?: number; // failsafe para sumir o spinner
};
import { Modal } from "../modal";

const ImageWithLoader: React.FC<Props> = ({
  src,
  alt,
  className = "",
  placeholderSrc = "/images/error/landscape-placeholder.svg",
  spinnerSize = 16,
  eager = false,
  timeoutMs = 6000,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const prevSrcRef = useRef<string | undefined>(undefined);

  // normaliza a src; se vier ""/null/undefined -> usa placeholder
  const normalizedSrc = useMemo(() => (src && src.trim() !== "" ? src : placeholderSrc), [src, placeholderSrc]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // reseta estados **apenas** quando a string realmente muda
  useEffect(() => {
    if (prevSrcRef.current !== normalizedSrc) {
      prevSrcRef.current = normalizedSrc;
      setLoaded(false);
      setErrored(false);
    }
  }, [normalizedSrc]);

  // Se a imagem já estiver no cache, marca como carregado
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      // se já terminou de carregar (ou falhou) o navegador marca complete = true
      // para diferenciar erro, tentamos checar naturalWidth
      if (img.naturalWidth > 0) {
        setLoaded(true);
      } else {
        setErrored(true);
        setLoaded(true);
      }
    }
  }, [normalizedSrc]);

  // Failsafe: evita spinner eterno
  useEffect(() => {
    if (loaded) return;
    const id = setTimeout(() => {
      if (!loaded) {
        setErrored(true);
        setLoaded(true);
      }
    }, timeoutMs);
    return () => clearTimeout(id);
  }, [loaded, timeoutMs]);

  const onLoad = () => setLoaded(true);
  const onError = () => {
    setErrored(true);
    setLoaded(true);
  };

  // Quando erro, força placeholder
  const finalSrc = errored ? placeholderSrc : normalizedSrc;

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={spinnerSize} />
        </div>
      )}

      <img
        ref={imgRef}
        src={finalSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onClick={loaded ? () => setIsOpen(true) : undefined}
        onLoad={onLoad}
        onError={onError}
        className={[
          "w-full h-full object-cover",
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <Modal 
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        isFullscreen={false}
        showCloseButton={false}
        className="max-w-[300px] p-4"
      >
        <img src={finalSrc} alt={alt} className="w-full h-full object-contain rounded-2xl" />
      </Modal>
    </div>
  );
};

export default ImageWithLoader;
