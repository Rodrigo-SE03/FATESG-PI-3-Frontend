export type WorkType = "filme" | "anime" | "jogo" | "livro";

export type Status = "completed" | "in_progress" | "planned" | "abandoned";

export type Metadata = {
  // Filmes
  director?: string;
  duration?: string;
  
  // Livros
  author?: string;
  editor?: string;
  pages?: number;

  // Animes
  episodes?: number;
  original_id?: string;

  // Jogos
  platforms?: string[];
  developer?: string[];
};

export interface WorkItem {
  id: string;
  title: string;
  category: WorkType;
  metadata?: Metadata;
  description?: string;
  cover_url: string;
  rating: number;
  status: Status;
  progress?: number;
  release_year?: number;
  genres?: string[];
  review?: string;
  unified_genres?: string[];
  last_updated?: string;
};

export type AddPayload = {
  id: string;
  category: WorkType;
  title: string;
  status: Status;
  rating: number;
  progress?: number;
  review?: string;
};

export type UpdatePayload = {
  id: string;
  category: WorkType;
  status?: Status;
  rating?: number;
  progress?: number;
  review?: string;
};