import { useEffect, useState } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import type { WorkItem, AddPayload } from "../../types/works";
import PageMeta from "../../components/common/PageMeta";
import { capitalizeFirstLetter } from "../../utils/helperFuncs";
import { fetchWorks, removeWork, addWork } from "../../utils/requests";
import Toast from "../../components/common/Toast";
import Button from "../../components/ui/button/Button";
import { ToastData } from "../../components/common/Toast";
import { CirclePlus, Pencil, Trash2, Calendar, Tag } from "lucide-react";
import { Modal } from "../../components/ui/modal";
import FormModal from "../../components/workAdd/FormModal";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type LocationState = {
  item?: WorkItem;
};

const WorkDetails: React.FC = () => {
  const [toastData, setToastData] = useState<ToastData | null>({
    open: false,
    title: "",
    message: "",
    color: "info",
  });
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const item = state?.item;

  const [checkingLibrary, setCheckingLibrary] = useState(true);
  const [alreadyInLibrary, setAlreadyInLibrary] = useState(false);

  console.log("WorkDetails item:", item);
  if (!item) {
    return <Navigate to="/catalog" replace />;
  }

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

  const handleAdd = async (payload: AddPayload) => {
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
  };

  const handleEdit = () => {
    console.log("Editar item (TODO):", item.id);
  };

  const handleRemove = async () => {
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
                  onClick={handleEdit}
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
            <p className="text-sm sm:text-base leading-relaxed text-light-text/90 dark:text-dark-text/90">
              {item.description}
            </p>
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
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-full sm:max-w-[500px] m-4"
        showCloseButton={false}
      >
        <FormModal
          item={item}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAdd}
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