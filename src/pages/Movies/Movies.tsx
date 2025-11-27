import PageMeta from "../../components/common/PageMeta";
import ItemsGrid from "../../components/itemsGrid/ItemsGrid";
import api from "../../auth/Api";
import { useEffect, useState } from "react";
import type { WorkItem } from "../../types/works";
import { mockMovies } from "../../utils/movies/movieItems";

const Movies = () => {
  const [movies, setMovies] = useState<WorkItem[]>([]);
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get<WorkItem[]>("/movies");
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies(mockMovies); // Usar dados mockados em caso de erro
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      <PageMeta description="Catálogo de filmes" />
      <div className="body-tex">
        <h1 className="header-text mb-4 text-center">Filmes</h1>
        <ItemsGrid items={movies} />
      </div>
    </>
  );
}

export default Movies;