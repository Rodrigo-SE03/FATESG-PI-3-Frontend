import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import NonUserRoute from "../auth/NonUserRoute";
import AppLayout from "../layout/AppLayout";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { CatalogProvider } from "../context/CatalogContext";
import { WorkAddSearchProvider } from "../context/WorkAddSearchContext";
import { RecommendationsProvider } from "../context/RecommendationsContext";

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
import Books from "../pages/Books/Books";
import BooksAdd from "../pages/Books/BooksAdd";
import Games from "../pages/Games/Games";
import GamesAdd from "../pages/Games/GamesAdd";
import Recommendation from "../pages/Recommendation/Recomendation";

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
                  <ScrollToTop />
                  <AppLayout />
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
            { path: "recomendacoes", element: <Recommendation /> },
            { path: "work/:id", element: <WorkAddSearchProvider><CatalogProvider><WorkDetails /></CatalogProvider></WorkAddSearchProvider>},
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