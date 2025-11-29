import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import NonUserRoute from "../auth/NonUserRoute";
import AppLayout from "../layout/AppLayout";
import { ScrollToTop } from "../components/common/ScrollToTop";

// Páginas
import Home from "../pages/Home/Home";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import ConfirmSignUp from "../pages/SignUp/ConfirmSignUp";
import NotFound from "../pages/OtherPage/NotFound";
import WorkDetails from "../pages/Work/WorkDetails";
import Movies from "../pages/Movies/Movies";
import MoviesAdd from "../pages/Movies/MoviesAdd";
import Animes from "../pages/Animes/Animes";
import AnimesAdd from "../pages/Animes/AnimesAdd";

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
            { path: "filmes", element: <Movies /> },
            { path: "filmes/add", element: <MoviesAdd /> },
            { path: "animes", element: <Animes /> },
            { path: "animes/add", element: <AnimesAdd /> },
            { path: "work/:id", element: <WorkDetails />},
          ],
        },
      ],
    },

    // NÃO AUTENTICADO
    {
      path: "/",
      element: <NonUserRoute />,
      children: [
        { path: "login", element: <SignIn /> },
        { path: "signup", element: <SignUp /> },
        { path: "confirm-signup", element: <ConfirmSignUp /> }
      ],
    },

    // PÚBLICO
    { path: "*", element: <NotFound /> },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRoutes;