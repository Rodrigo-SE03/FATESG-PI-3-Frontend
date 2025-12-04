import React, { useState, useEffect, useCallback } from "react";
import ProfileInfoSection from "./ProfileInfoSection";
import PasswordSection from "./PasswordSection";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import {
  fetchUserAttributes,
  updateUserAttributes,
} from "aws-amplify/auth";

// Se estiver usando o Amplify modular v6:
import { uploadData, getUrl } from "aws-amplify/storage";

type ProfileState = {
  name: string;
  picture?: string;
};

type SaveProfileData = {
  name: string;
  avatarFile?: File | null;
};

type ProfileFieldsProps = {
  // callback opcional para side effects extras (ex: analytics)
  onSaveProfile?: (data: SaveProfileData) => Promise<void> | void;
  onChangePassword?: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void> | void;
};

const ProfileFields: React.FC<ProfileFieldsProps> = ({
  onSaveProfile,
  onChangePassword,
}) => {
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const attrs = await fetchUserAttributes();

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

  const handleSaveProfile = async ({ name, avatarFile }: SaveProfileData) => {
    try {
      let pictureUrl = profile?.picture;

      if (avatarFile) {
        const path = `avatars/${Date.now()}-${avatarFile.name}`; // TODO - Configurar bucket para os avatares

        await uploadData({
          path,
          data: avatarFile,
          options: {
            contentType: avatarFile.type,
            // accessLevel: "public", // se você quiser explicitar
          },
        }).result;

        const { url } = await getUrl({
          path,
          // options: { accessLevel: "public" },
        });

        pictureUrl = url.toString();
      }

      await updateUserAttributes({
        userAttributes: {
          name,
          ...(pictureUrl ? { picture: pictureUrl } : {}),
        },
      });

      setProfile((prev) =>
        prev ? { ...prev, name, picture: pictureUrl } : { name, picture: pictureUrl }
      );

      if (onSaveProfile) {
        await onSaveProfile({ name, avatarFile });
      }
    } catch (error) {
      console.error("Erro ao salvar perfil do usuário:", error);
      throw error;
    }
  };

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
      <PasswordSection onChangePassword={onChangePassword} />
    </div>
  );
};

export default ProfileFields;