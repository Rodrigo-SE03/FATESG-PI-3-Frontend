import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import NonUserRoute from "../auth/NonUserRoute";
import AppLayout from "../layout/AppLayout";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { CatalogProvider } from "../context/CatalogContext";
import { WorkAddSearchProvider } from "../context/WorkAddSearchContext";
import { RecommendationsProvider } from "../context/RecommendationsContext";
import { ErrorBoundary } from "../context/ErrorBoundary";

// Páginas
import Home from "../pages/Home/Home";
import SignIn from "../pages/AuthPages/SignIn";
import SignUp from "../pages/AuthPages/SignUp";
import Confirmation from "../pages/AuthPages/Confirmation";
import ForgotPassword from "../pages/AuthPages/ForgotPassword";
import RecoverPassword from "../pages/AuthPages/RecoverPassword";
import NotFound from "../pages/OtherPage/NotFound";
import Maintenance from "../pages/OtherPage/Maintenance";
import WorkDetails from "../pages/Work/WorkDetails";
import Movies from "../pages/Movies/Movies";
import MoviesAdd from "../pages/Movies/MoviesAdd";
import Animes from "../pages/Animes/Animes";
import AnimesAdd from "../pages/Animes/AnimesAdd";
import Books from "../pages/Books/Books";
import BooksAdd from "../pages/Books/BooksAdd";
import Games from "../pages/Games/Games";
import GamesAdd from "../pages/Games/GamesAdd";
import Series from "../pages/Series/Series";
import SeriesAdd from "../pages/Series/SeriesAdd";
import Mangas from "../pages/Mangas/Mangas";
import MangasAdd from "../pages/Mangas/MangasAdd";
import Recommendation from "../pages/Recommendation/Recomendation";
import Profile from "../pages/Profile/Profile";

function AppRoutes() {

  const router = createBrowserRouter([
    // PROTEGIDO
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          element: 
            <CatalogProvider>
              <WorkAddSearchProvider>
                <RecommendationsProvider>
                  <ErrorBoundary>
                    <ScrollToTop />
                    <AppLayout />
                  </ErrorBoundary>
                </RecommendationsProvider>
              </WorkAddSearchProvider>
            </CatalogProvider>,
          children: [
            { index: true, element: <Home /> },
            { path: "filmes", element: <CatalogProvider><Movies /></CatalogProvider> },
            { path: "filmes/add", element: <WorkAddSearchProvider><MoviesAdd /></WorkAddSearchProvider> },
            { path: "animes", element: <CatalogProvider><Animes /></CatalogProvider> },
            { path: "animes/add", element: <WorkAddSearchProvider><AnimesAdd /></WorkAddSearchProvider> },
            { path: "livros", element: <CatalogProvider><Books /></CatalogProvider> },
            { path: "livros/add", element: <WorkAddSearchProvider><BooksAdd /></WorkAddSearchProvider> },
            { path: "jogos", element: <CatalogProvider><Games /></CatalogProvider> },
            { path: "jogos/add", element: <WorkAddSearchProvider><GamesAdd /></WorkAddSearchProvider> },
            { path: "series", element: <CatalogProvider><Series /></CatalogProvider> },
            { path: "series/add", element: <WorkAddSearchProvider><SeriesAdd /></WorkAddSearchProvider> },
            { path: "mangas", element: <CatalogProvider><Mangas /></CatalogProvider> },
            { path: "mangas/add", element: <WorkAddSearchProvider><MangasAdd /></WorkAddSearchProvider> },
            { path: "recomendacoes", element: <Recommendation /> },
            { path: "work/:id", element: <WorkAddSearchProvider><CatalogProvider><WorkDetails /></CatalogProvider></WorkAddSearchProvider>},
            { path: "profile", element: <Profile /> },
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
        { path: "confirmation", element: <Confirmation /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "recover-password", element: <RecoverPassword /> }
      ],
    },

    // PÚBLICO
    { path: "*", element: <NotFound /> },
    { path: "manutencao", element: <Maintenance /> },
  ]);

  return <RouterProvider router={router} />;
}

export default AppRoutes;