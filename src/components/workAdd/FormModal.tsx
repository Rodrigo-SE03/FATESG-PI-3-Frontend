import type { WorkItem, Status, AddPayload } from "../../types/works";
import { useState } from "react";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import Select from "../form/Select";
import Label from "../form/Label";
import StarRating from "./StarRating";

type FormModalProps = {
  item: WorkItem;
  onClose: () => void;
  onSubmit: (payload: AddPayload) => void;
};

const MAX_RATING = 5;

const FormModal: React.FC<FormModalProps> = ({ item, onClose, onSubmit }) => {
  const [status, setStatus] = useState<Status>("Completo");
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const handleSubmit = () => {
    const safeRating = Math.min(MAX_RATING, Math.max(0, rating));

    const payload: AddPayload = {
      id: item.id,
      category: item.category,
      title: item.title,
      status,
      rating: safeRating,
      review,
    };

    onSubmit(payload);
  };

  return (
    // aqui é só o conteúdo do modal, sem fixed/inset/overlay
    <div className="p-6">
      <h2 className="mb-4">
        Adicionar <span className="font-semibold">{item.title}</span> à sua coleção
      </h2>

      {/* Status */}
      <div className="mb-4">
        <Label className="block mb-2">Status</Label>
        <Select
          value={status}
          onChange={(value: string) => setStatus(value as Status)}
          className="w-full"
          options={[
            { label: "Completo", value: "Completo" },
            { label: "Em Progresso", value: "Em Progresso" },
            { label: "Planejado", value: "Planejado" },
          ]}
        />
      </div>

      {/* Avaliação com estrelas */}
      <div className="mb-4">
        <Label className="block mb-2">Avaliação</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Resenha */}
      <div className="mb-6">
        <Label className="block mb-2">Resenha</Label>
        <TextArea
          value={review}
          onChange={(value) => setReview(value)}
          className="w-full"
          rows={4}
          placeholder="Escreva aqui seus comentários..."
        />
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" onClick={handleSubmit}>
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default FormModal;