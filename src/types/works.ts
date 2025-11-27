export interface WorkItem {
  id: string;
  title: string;
  coverUrl: string;
  rating: number; // Talvez seja interessante mudar para string se usar estrelas com meio ponto
  status: "completed" | "in-progress" | "planned";
}