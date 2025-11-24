import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import NonUserRoute from "../auth/NonUserRoute";
import AppLayout from "../layout/AppLayout";
import { ScrollToTop } from "../components/common/ScrollToTop";

// Páginas
import Home from "../pages/Home/Home";
import SignIn from "../pages/SignIn/SignIn";
// import SignUp from "../pages/AuthPages/SignUp";
import NotFound from "../pages/OtherPage/NotFound";

function AppRoutes() {

  const router = createBrowserRouter([
    // PROTEGIDO
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          element: <> <ScrollToTop /> <AppLayout /> </>,
          children: [
            { index: true, element: <Home /> },
          ],
        },
      ],
    },

    // NÃO AUTENTICADO
    {
      path: "/",
      element: <NonUserRoute />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <SignIn /> },
        // { path: "signup", element: <SignUp /> }
      ],
    },

    // PÚBLICO
    { path: "*", element: <NotFound /> },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRoutes;