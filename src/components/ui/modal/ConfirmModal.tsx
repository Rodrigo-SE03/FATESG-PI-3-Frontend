import { Modal } from ".";
import Button from "../button/Button";
import LoadingSpinner from "../spinner/LoadingSpinner";

export type ConfirmModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  buttonText: string;
  variant: "ok" | "danger";
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  onConfirm,
  title,
  message,
  buttonText,
  variant,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-full sm:max-w-[500px] m-4" showCloseButton={false}>
      <div className="p-4 w-full flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold mb-4 body-text">{title}</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
          <LoadingSpinner />
          </div>
        ) : (  
        <>
        <p className="body-text">{message}</p>
        <div className="mt-6 flex gap-3 justify-between w-full">
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            variant={variant === "danger" ? "danger" : "primary"}
          >
            {buttonText}
          </Button>
        </div>
        </>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
