import { Modal } from ".";
import Button from "../button/Button";

export type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
};

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-full sm:max-w-[500px] m-4" showCloseButton={false}>
      <div className="p-4 w-full flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold mb-4 body-text">{title}</h2>
        <p className="body-text">{message}</p>
        <div className="mt-6 flex justify-center">
          <Button onClick={onClose}>OK</Button>
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;