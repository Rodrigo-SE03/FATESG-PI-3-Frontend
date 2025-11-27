export interface WorkItem {
  id: string;
  title: string;
  cover_url: string;
  rating: number; // Talvez seja interessante mudar para string se usar estrelas com meio ponto
  status: "completed" | "in-progress" | "planned";
  progress?: number; // Percentual de progresso, opcional
  genres?: string[]; // Gêneros associados à obra
  unified_genres?: string[]; // Gêneros unificados para categorização
  last_updated?: string; // Data da última atualização, opcional
}