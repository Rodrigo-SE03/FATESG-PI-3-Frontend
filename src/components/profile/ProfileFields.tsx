import React, { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Avatar from "../ui/avatar/Avatar";
import AvatarPicker from "../ui/avatar/AvatarPicker";
import { SquarePen } from "lucide-react";

type PasswordCriteria = {
  lengthOk: boolean;
  numberOk: boolean;
  upperOk: boolean;
  lowerOk: boolean;
  specialOk: boolean;
};

const getPasswordCriteria = (value: string): PasswordCriteria => ({
  lengthOk: value.length >= 8,
  numberOk: /\d/.test(value),
  upperOk: /[A-Z]/.test(value),
  lowerOk: /[a-z]/.test(value),
  specialOk: /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(value),
});

const getPasswordScore = (c: PasswordCriteria) =>
  [c.lengthOk, c.numberOk, c.upperOk, c.lowerOk, c.specialOk].filter(Boolean)
    .length;

const isStrongPassword = (value: string): boolean => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;
  return regex.test(value);
};

const OkIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const XIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

type ProfileFieldsProps = {
  initialName: string;
  initialAvatarUrl?: string;
  onSaveProfile?: (data: { name: string; avatarFile?: File | null }) => Promise<void> | void;
  onChangePassword?: (data: { currentPassword: string; newPassword: string }) => Promise<void> | void;
};

const ProfileFields: React.FC<ProfileFieldsProps> = ({
  initialName,
  initialAvatarUrl,
  onSaveProfile,
  onChangePassword,
}) => {
  /** Qual seção está em edição */
  const [editing, setEditing] = useState<"profile" | "password" | null>(null);

  /** Estado de nome + avatar */
  const [name, setName] = useState(initialName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  /** Estado de senha */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const criteria = getPasswordCriteria(newPwd);
  const score = getPasswordScore(criteria);
  const passwordsMatch = newPwd === confirmPwd || confirmPwd.length === 0;
  const canSubmitPassword =
    !passwordLoading &&
    newPwd.length > 0 &&
    confirmPwd.length > 0 &&
    passwordsMatch &&
    isStrongPassword(newPwd) &&
    currentPassword.length > 0;

  /** Handlers */
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
      setEditing(null);
    } catch (err) {
      console.error(err);
      setProfileError("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (!isStrongPassword(newPwd)) {
      setPasswordError(
        "A senha deve ter no mínimo 8 caracteres e conter número, letra maiúscula, letra minúscula e caractere especial."
      );
      return;
    }

    if (newPwd !== confirmPwd) {
      setPasswordError("As senhas não coincidem.");
      return;
    }

    if (!currentPassword) {
      setPasswordError("Informe sua senha atual.");
      return;
    }

    try {
      setPasswordLoading(true);
      if (onChangePassword) {
        await onChangePassword({ currentPassword, newPassword: newPwd });
      }
      setPasswordMessage("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPwd("");
      setConfirmPwd("");
      setEditing(null);
    } catch (err) {
      console.error(err);
      setPasswordError("Erro ao alterar a senha. Verifique os dados e tente novamente.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ==== SEÇÃO 1: Nome + Foto de perfil ==== */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            Dados do Perfil
          </h2>
          <Button
            type="button"
            variant="icon"
            onClick={() => {
              const isClosing = editing === "profile";
              setProfileError(null);
              setProfileMessage(null);
              setEditing(isClosing ? null : "profile");
            }}
          >
            <SquarePen size={18} />
          </Button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            {editing === "profile" ? (
              <AvatarPicker
                value={initialAvatarUrl || ""}
                size="large"
                maxSizeMB={5}
                onChange={(file) => {
                  // file deve ser File | null, seguindo o padrão do seu componente antigo
                  setAvatarFile(file || null);
                }}
              />
            ) : (
              <Avatar
                src={initialAvatarUrl || "images/user/owner.jpg"}
                alt={name || "User Avatar"}
                size="xlarge"
              />
            )}
          </div>

          <div>
            <Label>Nome completo</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              disabled={editing !== "profile"}
            />
          </div>

          {profileError && (
            <p className="text-sm text-red-500">{profileError}</p>
          )}
          {profileMessage && (
            <p className="text-sm text-emerald-600">{profileMessage}</p>
          )}

          {editing === "profile" && (
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

      {/* ==== SEÇÃO 2: Alterar senha ==== */}
      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">
            Alterar Senha
          </h2>
          <Button
            type="button"
            variant="icon"
            onClick={() => {
              const isClosing = editing === "password";
              setPasswordError(null);
              setPasswordMessage(null);
              if (isClosing) {
                setCurrentPassword("");
                setNewPwd("");
                setConfirmPwd("");
              }
              setEditing(isClosing ? null : "password");
            }}
          >
            <SquarePen size={18} />
          </Button>
        </div>

        {editing === "password" && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label>Senha atual</Label>
              <Input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Nova senha</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="Digite a nova senha"
                  required
                />
              </div>
              <div>
                <Label>Confirmar nova senha</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Confirme a nova senha"
                  required
                />
              </div>
            </div>

            <div className="mt-1">
              <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-gray-300"
                />
                Mostrar senhas
              </label>
            </div>

            {/* Barra de força + checklist */}
            <div className="mt-2 space-y-1" aria-live="polite">
              <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    score <= 2
                      ? "bg-red-500"
                      : score <= 4
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${(score / 5) * 100}%` }}
                />
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  {criteria.lengthOk ? (
                    <OkIcon className="size-4 text-emerald-600" />
                  ) : (
                    <XIcon className="size-4 text-gray-400" />
                  )}
                  Mínimo de 8 caracteres
                </li>
                <li className="flex items-center gap-2">
                  {criteria.numberOk ? (
                    <OkIcon className="size-4 text-emerald-600" />
                  ) : (
                    <XIcon className="size-4 text-gray-400" />
                  )}
                  Pelo menos 1 número
                </li>
                <li className="flex items-center gap-2">
                  {criteria.upperOk ? (
                    <OkIcon className="size-4 text-emerald-600" />
                  ) : (
                    <XIcon className="size-4 text-gray-400" />
                  )}
                  Pelo menos 1 letra maiúscula
                </li>
                <li className="flex items-center gap-2">
                  {criteria.lowerOk ? (
                    <OkIcon className="size-4 text-emerald-600" />
                  ) : (
                    <XIcon className="size-4 text-gray-400" />
                  )}
                  Pelo menos 1 letra minúscula
                </li>
                <li className="flex items-center gap-2 sm:col-span-2">
                  {criteria.specialOk ? (
                    <OkIcon className="size-4 text-emerald-600" />
                  ) : (
                    <XIcon className="size-4 text-gray-400" />
                  )}
                  Pelo menos 1 caractere especial
                </li>
              </ul>

              {!passwordsMatch && confirmPwd.length > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  As senhas não coincidem.
                </p>
              )}
            </div>

            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            {passwordMessage && (
              <p className="text-sm text-emerald-600">{passwordMessage}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmitPassword}
            >
              {passwordLoading ? "Atualizando..." : "Atualizar senha"}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
};

export default ProfileFields;