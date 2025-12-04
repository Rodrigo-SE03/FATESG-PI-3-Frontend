import PageMeta from "../../components/common/PageMeta";
import ProfileFields from "../../components/profile/ProfileFields";

export default function Profile() {
  return (
    <>
    <PageMeta description="Página do Perfil" />
      <ProfileFields initialName="Rodrigo" />
    </>
  );
}