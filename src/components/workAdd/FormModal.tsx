import type { WorkItem, Status, AddPayload, UpdatePayload } from "../../types/works";
import { useState } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import Input from "../form/input/InputField";
import Select from "../form/Select";
import Label from "../form/Label";
import StarRating from "./StarRating";

type FormModalProps = {
  item: WorkItem;
  onClose: () => void;
  onSubmit: (payload: AddPayload) => void;
  onEdit: (payload: UpdatePayload) => void;
  isEdit?: boolean;
  initialData?: {
    status?: Status;
    rating?: number;
    review?: string;
    progress?: number;
  };
  loading?: boolean;
};

const MAX_RATING = 5;

const FormModal: React.FC<FormModalProps> = ({ item, onClose, onSubmit, onEdit, isEdit, initialData, loading }) => {
  const [status, setStatus] = useState<Status>(initialData?.status || "completed");
  const [rating, setRating] = useState<number>(initialData?.rating || 0);
  const [review, setReview] = useState<string>(initialData?.review || "");
  const [progress, setProgress] = useState<number>(initialData?.progress || 0);

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

  const handleEdit = () => {
    if (!onEdit) return;
    const safeRating = Math.min(MAX_RATING, Math.max(0, rating));

    const payload: UpdatePayload = {
      id: item.id,
      category: item.category,
      status,
      rating: safeRating,
      review,
    };
    onEdit(payload);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }

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
            { label: "Completo", value: "completed" },
            { label: "Em Progresso", value: "in_progress" },
            { label: "Planejado", value: "planned" },
            { label: "Abandonado", value: "abandoned" },
          ]}
        />
      </div>

      {/* Avaliação com estrelas */}
      <div className="mb-4">
        <Label className="block mb-2">Avaliação</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Progresso - Animes ou Livros */}
      {(item.category === "anime" || item.category === "livro") && (
        <div className="mb-4">
          <Label className="block mb-2">{item.category === "anime" ? "Episódios assistidos" : "Páginas lidas"}</Label>
          <Input
            type="number"
            value={status === "in_progress" ? progress : status === "completed" ? (item.category === "anime" ? item.metadata?.episodes || 0 : item.metadata?.pages || 0) : 0}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full"
            placeholder={item.category === "anime" ? "Número de episódios assistidos" : "Número de páginas lidas"}
          />
        </div>
      )}

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
        {isEdit ? (
          <Button type="button" onClick={handleEdit}>
            Salvar
          </Button>
        ) : (
        <Button type="button" onClick={handleSubmit}>
          Adicionar
        </Button>
        )}
      </div>
    </div>
  );
};

export default FormModal;