import React, { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Avatar from "../ui/avatar/Avatar";
import AvatarPicker from "../ui/avatar/AvatarPicker";
import { SquarePen } from "lucide-react";

type ProfileInfoSectionProps = {
  initialName: string;
  initialAvatarUrl?: string;
  onSaveProfile?: (data: { name: string; avatarFile?: File | null }) => Promise<void> | void;
};

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({
  initialName,
  initialAvatarUrl,
  onSaveProfile,
}) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileMessage(null);

    if (!name.trim()) {
      setProfileError("Informe um nome válido.");
      return;
    }

    try {
      setProfileLoading(true);
      if (onSaveProfile) {
        await onSaveProfile({ name: name.trim(), avatarFile });
      }
      setProfileMessage("Perfil atualizado com sucesso.");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setProfileError("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleToggleEditing = () => {
    const isClosing = editing;
    setProfileError(null);
    setProfileMessage(null);
    // se estiver fechando, você poderia resetar o estado aqui se quiser
    setEditing(!editing);
  };

  return (
    <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">
          Dados do Perfil
        </h2>
        <Button
          type="button"
          variant="icon"
          onClick={handleToggleEditing}
        >
          <SquarePen size={18} />
        </Button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="flex items-center gap-4">
          {editing ? (
            <AvatarPicker
              value={initialAvatarUrl || ""}
              size="large"
              maxSizeMB={5}
              onChange={(file) => {
                setAvatarFile(file || null);
              }}
            />
          ) : (
            <Avatar
              src={initialAvatarUrl || "https://placehold.co/40x40?text=o.o"}
              alt={name || "User Avatar"}
              size="xlarge"
            />
          )}
        </div>

        <div>
          <Label>Nome</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            disabled={!editing}
          />
        </div>

        {profileError && (
          <p className="text-sm text-red-500">{profileError}</p>
        )}
        {profileMessage && (
          <p className="text-sm text-emerald-600">{profileMessage}</p>
        )}

        {editing && (
          <Button
            type="submit"
            className="w-full"
            disabled={profileLoading}
          >
            {profileLoading ? "Salvando..." : "Salvar perfil"}
          </Button>
        )}
      </form>
    </section>
  );
};

export default ProfileInfoSection;