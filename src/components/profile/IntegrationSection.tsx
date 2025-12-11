import React, { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { SquarePen } from "lucide-react";

type IntegrationSectionProps = {
  initialMalUsername?: string;
  onSyncMal?: (username: string) => Promise<void> | void;
};

const IntegrationSection: React.FC<IntegrationSectionProps> = ({
  initialMalUsername = "",
  onSyncMal,
}) => {
  const [editing, setEditing] = useState(false);
  const [malUsername, setMalUsername] = useState(initialMalUsername);
  const [integrationMessage, setIntegrationMessage] = useState<string | null>(null);
  const [integrationError, setIntegrationError] = useState<string | null>(null);
  const [integrationLoading, setIntegrationLoading] = useState(false);

  const handleSyncMal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIntegrationError(null);
    setIntegrationMessage(null);

    if (!malUsername.trim()) {
      setIntegrationError("Informe um nome de usuário válido.");
      return;
    }

    try {
      setIntegrationLoading(true);
      if (onSyncMal) {
        await onSyncMal(malUsername.trim());
      }
      setIntegrationMessage("Sincronização com MyAnimeList realizada com sucesso.");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setIntegrationError("Erro ao sincronizar. Verifique o nome de usuário e tente novamente.");
    } finally {
      setIntegrationLoading(false);
    }
  };

  const handleToggleEditing = () => {
    setIntegrationError(null);
    setIntegrationMessage(null);
    setEditing(!editing);
  };

  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">
          Integrações
        </h2>
        <Button
          type="button"
          variant="icon"
          onClick={handleToggleEditing}
        >
          <SquarePen size={18} />
        </Button>
      </div>

      {editing && (
        <form onSubmit={handleSyncMal} className="space-y-4">
          <div>
            <Label>Nome de usuário do MyAnimeList</Label>
            <Input
              type="text"
              value={malUsername}
              onChange={(e) => setMalUsername(e.target.value)}
              placeholder="Digite seu username do MyAnimeList"
              disabled={integrationLoading}
              required
            />
          </div>

          {integrationError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {integrationError}
            </p>
          )}

          {integrationMessage && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {integrationMessage}
            </p>
          )}

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              disabled={integrationLoading}
            >
              {integrationLoading ? "Sincronizando..." : "Sincronizar"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleToggleEditing}
              disabled={integrationLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {!editing && malUsername && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>
            <span className="font-medium">MyAnimeList:</span> {malUsername}
          </p>
        </div>
      )}
    </section>
  );
};

export default IntegrationSection;
