import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = () => {
  const { user, loadingUser } = useAuth();
  const location = useLocation();

  if (loadingUser) return (
    <div className="fixed inset-0 flex items-center justify-center">
      <LoadingSpinner size={50} text="Carregando" />
    </div>
  );

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;