import { useState, useEffect, useCallback } from "react";
import ProfileInfoSection from "./ProfileInfoSection";
import PasswordSection from "./PasswordSection";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import {
  fetchUserAttributes,
  updateUserAttributes,
  updatePassword,
} from "aws-amplify/auth";

import { uploadData, getUrl } from "aws-amplify/storage";

import Toast from "../common/Toast";
import { ToastData } from "../common/Toast";

type ProfileState = {
  name: string;
  picture?: string;
};

type SaveProfileData = {
  name: string;
  avatarFile?: File | null;
};

type ChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

const ProfileFields = () => {
  const [toastData, setToastData] = useState<ToastData>({ open: false, title: "", message: "", color: "info" });
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const attrs = await fetchUserAttributes();
      console.log(attrs);
      setProfile({
        name: attrs.name ?? "",
        picture: attrs.picture,
      });
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveProfile = useCallback(
    async ({ name, avatarFile }: SaveProfileData) => {
      try {
        let pictureUrl = profile?.picture;

        if (avatarFile) {
          const path = `avatars/${Date.now()}-${avatarFile.name}`;

          await uploadData({
            path,
            data: avatarFile,
            options: {
              bucket: {
                bucketName: "mylib-internal-files",
                region: "sa-east-1",
              },
            },
          }).result;

          // URL fixa pública, sem X-Amz-Expires
          pictureUrl = `https://mylib-internal-files.s3.sa-east-1.amazonaws.com/${path}`;
        }

        await updateUserAttributes({
          userAttributes: {
            name,
            ...(pictureUrl ? { picture: pictureUrl } : {}),
          },
        });

        setProfile((prev) =>
          prev
            ? { ...prev, name, picture: pictureUrl }
            : { name, picture: pictureUrl }
        );
      } catch (error) {
        console.error("Erro ao salvar perfil do usuário:", error);
        throw error;
      }
    },
    [profile?.picture]
  );

  const handleSavePassword = useCallback(
    async ({ currentPassword, newPassword }: ChangePasswordData) => {
      try {
        await updatePassword({
          oldPassword: currentPassword,
          newPassword,
        });
        setToastData({ open: true, title: "Sucesso", message: "Senha alterada com sucesso.", color: "success" });
      } catch (error) {
        console.error("Erro ao alterar senha:", error);
        setToastData({ open: true, title: "Erro", message: "Erro ao alterar senha. Verifique suas credenciais e tente novamente.", color: "error" });
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <ProfileInfoSection
        initialName={profile?.name || ""}
        initialAvatarUrl={profile?.picture}
        onSaveProfile={handleSaveProfile}
      />
      <PasswordSection onChangePassword={handleSavePassword} />
      <Toast
        open={toastData.open}
        title={toastData.title}
        message={toastData.message}
        color={toastData.color}
        onClose={() => setToastData((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default ProfileFields;