export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  status: "planejamento" | "execucao" | "concluida" | "paralisada";
  physicalProgress: number;
  financialProgress: number;
  currentStage: string;
  nextStage: string;
  expectedDelivery: string;
  totalDays: number;
  elapsedDays: number;
  lastUpdate: string;
  engineer: string;
  heroGradient: string;
}

export interface ProjectStage {
  id: string;
  name: string;
  state: "done" | "current" | "pending" | "late";
  date?: string;
  percent?: number;
}

export interface FinancialSummary {
  contracted: number;
  paid: number;
  remaining: number;
  spent: number;
  nextForecast: number;
}

export type DocumentCategory =
  | "Projetos"
  | "Documentação Técnica"
  | "Relatórios"
  | "Financeiro"
  | "Contratos e Aditivos"
  | "Arquivo Geral";

export type DocumentType = "pdf" | "dwg" | "xlsx" | "docx" | "jpg" | "png";

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  type: DocumentType;
  sizeKB: number;
  date: string;
  version: string;
  uploadedBy: string;
  description?: string;
}

export type MediaKind = "photo" | "video" | "360" | "drone" | "timelapse";
export type ProjectStageKey =
  | "Projeto"
  | "Fundação"
  | "Radier"
  | "Alvenaria"
  | "Cobertura"
  | "Instalações"
  | "Acabamentos"
  | "Entrega";

export interface MediaItem {
  id: string;
  title: string;
  kind: MediaKind;
  stage: ProjectStageKey;
  date: string;
  time?: string;
  environment?: string;
  location: string;
  responsible: string;
  description?: string;
  tags?: string[];
  gradient: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  type: "vistoria" | "medicao" | "entrega" | "reuniao";
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}
