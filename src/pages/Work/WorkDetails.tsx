import { useEffect, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import type { WorkItem, AddPayload, UpdatePayload } from "../../types/works";
import PageMeta from "../../components/common/PageMeta";
import { capitalizeFirstLetter } from "../../utils/helperFuncs";
import { fetchWorks, removeWork, addWork, editWork } from "../../utils/requests";
import Toast from "../../components/common/Toast";
import { ToastData } from "../../components/common/Toast";
import { CirclePlus, Pencil, Trash2, Calendar, Tag } from "lucide-react";
import { Modal } from "../../components/ui/modal";
import FormModal from "../../components/workAdd/FormModal";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type LocationState = {
  item?: WorkItem;
};

const DESCRIPTION_LIMIT = 500;

const WorkDetails: React.FC = () => {
  const [toastData, setToastData] = useState<ToastData | null>({
    open: false,
    title: "",
    message: "",
    color: "info",
  });
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [edit,setEdit] = useState(false);

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const item = state?.item;

  const [checkingLibrary, setCheckingLibrary] = useState(true);
  const [alreadyInLibrary, setAlreadyInLibrary] = useState(false);

  const [loading, setLoading] = useState(false);
  console.log("WorkDetails item:", item);
  if (!item) {
    return <Navigate to="/catalog" replace />;
  }

  const [expanded, setExpanded] = useState(false);
  const isLong = (item?.description?.length ?? 0) > DESCRIPTION_LIMIT;

  const displayedText = !item?.description
    ? ""
    : expanded
      ? item.description
      : item.description.slice(0, DESCRIPTION_LIMIT) + (isLong ? "..." : "");

  useEffect(() => {
    const checkIfInLibrary = async () => {
      try {
        setCheckingLibrary(true);
        const { items } = await fetchWorks(item.category);
        const exists = items.some((work: WorkItem) => work.id === item.id);
        setAlreadyInLibrary(exists);
      } catch (error) {
        console.error("Erro ao verificar biblioteca do usuário:", error);
        setAlreadyInLibrary(false);
      } finally {
        setCheckingLibrary(false);
      }
    };

    checkIfInLibrary();
  }, [item]);

  const typeLabel = capitalizeFirstLetter(item.category);

  const metadataEntries = (() => {
    const m = item.metadata;
    if (!m) return [];

    switch (item.category) {
      case "filme":
        return [
          m.director && { label: "Direção", value: m.director },
          m.duration && { label: "Duração", value: m.duration },
        ].filter(Boolean) as { label: string; value: string | number }[];

      case "livro":
        return [
          m.author && { label: "Autor", value: m.author },
          m.editor && { label: "Editora", value: m.editor },
          typeof m.pages === "number" && { label: "Páginas", value: m.pages },
        ].filter(Boolean) as { label: string; value: string | number }[];

      case "anime":
        return [
          typeof m.episodes === "number" && {
            label: "Episódios",
            value: m.episodes,
          },
        ].filter(Boolean) as { label: string; value: string | number }[];

      case "jogo":
        return [
          m.platforms?.length && {
            label: "Plataformas",
            value: m.platforms.join(", "),
          },
          m.developer?.length && {
            label: "Desenvolvedor",
            value: m.developer.join(", "),
          },
        ].filter(Boolean) as { label: string; value: string | number }[];

      default:
        return [];
    }
  })();

  const handleAdd = async (payload: AddPayload) => {
    setLoading(true);
    try {
      console.log("Adicionar item:", payload);
      await addWork(payload);
      setAlreadyInLibrary(true);
      setModalOpen(false);
      setToastData({
        open: true,
        title: "Adicionado",
        message: `${item.title} foi adicionado à sua coleção.`,
        color: "success",
      });
    } catch (error) {
      console.error("Erro ao adicionar item à biblioteca:", error);
      setToastData({
        open: true,
        title: "Erro",
        message: `Não foi possível adicionar ${item.title} à sua coleção.`,
        color: "error",
      });
    }
    setLoading(false);
  };

  const handleEdit = async (payload: UpdatePayload) => {
    setLoading(true);
    try {
      console.log("Editar item:", payload);
      await editWork(payload);
      setModalOpen(false);
      setToastData({
        open: true,
        title: "Atualizado",
        message: `${item.title} foi atualizado.`,
        color: "success",
      });
    } catch (error) {
      console.error("Erro ao editar item na biblioteca:", error);
      setToastData({
        open: true,
        title: "Erro",
        message: `Não foi possível atualizar ${item.title} na sua coleção.`,
        color: "error",
      });
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      console.log("Remover item (TODO):", item.id);
      await removeWork(item.category, item.id);
      setAlreadyInLibrary(false);
      setToastData({
        open: true,
        title: "Removido",
        message: `${item.title} foi removido da sua coleção.`,
        color: "success",
      });
    } catch (error) {
      console.error("Erro ao remover item da biblioteca:", error);
      setToastData({
        open: true,
        title: "Erro",
        message: `Não foi possível remover ${item.title} da sua coleção.`,
        color: "error",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <PageMeta description={item.title} />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="flex flex-row justify-between mb-4">
          <button onClick={() => navigate(-1)} aria-label="Voltar" className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Ações (ícones) */}
          <div className="flex justify-between gap-2">
            {checkingLibrary ? (
              null
            ) : !alreadyInLibrary ? (
              <button
                type="button"
                onClick={() => setModalOpen(true)}  
              >
                <CirclePlus className="h-6 w-6 text-green-600" />
              </button>
            ) : (
              <div className="flex justify-between gap-6">
                <button
                  type="button"
                  onClick={() => {
                    setEdit(true); 
                    setModalOpen(true);
                  }}
                >
                  <Pencil className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </button>

                <button
                  type="button"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-6 w-6 text-red-600" />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Cabeçalho: tipo + título */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-light-text/70 dark:text-dark-text/70">
              {typeLabel}
            </p>

            <h1 className="mb-2 text-2xl sm:text-3xl font-semibold leading-tight text-light-text dark:text-dark-text break-words">
              {item.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-light-text/80 dark:text-dark-text/80">
              {item.release_year && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{item.release_year}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Corpo: capa + descrição */}
        <div className="mt-6 flex flex-col gap-6 sm:flex-row">
          {item.cover_url && (
            <div className="sm:w-40 md:w-48 flex-shrink-0 mx-auto sm:mx-0">
              <img
                src={item.cover_url}
                alt={item.title}
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            </div>
          )}

          {item.description && (
            <div className="text-sm sm:text-base leading-relaxed text-light-text/90 dark:text-dark-text/90">
              <p>{displayedText}</p>

              {isLong && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="text-primary font-medium hover:underline mt-1 text-blue-600 dark:text-blue-400"
                >
                  {expanded ? "Ler menos" : "Ler mais"}
                </button>
              )}
            </div>
          )}
        </div>
        {item.unified_genres && item.unified_genres.length > 0 && (
          <div className="inline-flex items-center gap-2 mt-2">
            <Tag className="h-3 w-3 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {item.unified_genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-light-border/60 dark:border-dark-border/60 px-2 py-0.5 text-[0.7rem] sm:text-[0.75rem] bg-light-bg-alt/70 dark:bg-dark-bg-alt/60"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata específica */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-light-text/90 dark:text-dark-text/90">
        {metadataEntries.map((meta) => (
          <span key={meta.label} className="inline-flex items-center gap-1">
            <span className="font-semibold">{meta.label}:</span>
            <span>{meta.value}</span>
          </span>
        ))}
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-full sm:max-w-[500px] m-4"
        showCloseButton={false}
      >
        <FormModal
          item={item}
          initialData={item}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAdd}
          onEdit={handleEdit}
          isEdit={edit}
          loading={loading}
        />
      </Modal>

      <Toast
        open={toastData?.open || false}
        title={toastData?.title || ""}
        message={toastData?.message || ""}
        color={toastData?.color || "info"}
        onClose={() => setToastData(null)}
      />
    </>
  );
};

export default WorkDetails;