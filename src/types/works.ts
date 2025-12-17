export type WorkType = "filme" | "anime" | "jogo" | "livro" | "serie" | "manga";

export type Status = "completed" | "in_progress" | "planned" | "on_hold" | "abandoned";

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

  // Jogos
  platform?: string;
  developers?: string;
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
  updated_at?: string;
  created_at?: string;
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