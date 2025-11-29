import CatalogPage from "../../components/catalogPage/CatalogPage";
import { mockMovies } from "../../utils/movies/movieItems";

const Movies = () => {
  return (
    <CatalogPage
      title="Filmes"
      description="Catálogo de filmes"
      workType="filme"
      mockItems={mockMovies}
    />
  );
};

export default Movies;