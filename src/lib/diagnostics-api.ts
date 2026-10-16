export type DiagnosticChoice = { label: string; text: string; points: number };

export type DiagnosticCategory = {
  _id: string;
  id?: string;
  title: string;
  order: number;
  isActive: boolean;
  questions?: DiagnosticQuestion[];
  createdAt?: string;
};

export type DiagnosticQuestion = {
  _id: string;
  categoryId: string;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  choices: DiagnosticChoice[];
};

export type DiagnosticQuestionsPage = {
  items: DiagnosticQuestion[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type Assessment = {
  _id: string;
  id?: string;
  organizationId: string;
  userId: string;
  totalScore: number;
  maxPossibleScore: number;
  questionsAnswered: number;
  totalQuestions: number;
  completedAt?: string;
  createdAt?: string;
  status: "in_progress" | "completed";
};

export type AssessmentPage = { items: Assessment[]; total: number; page: number; limit: number; pages: number };

export type AssessmentAnswer = {
  questionId: string;
  categoryId: string;
  categoryTitle?: string | null;
  questionTitle?: string | null;
  selectedChoiceLabel: string;
  selectedChoiceText?: string | null;
  pointsAwarded: number;
};

export type AssessmentDetail = Assessment & { answers: AssessmentAnswer[] };

export const diagnosticPath = {
  categories: "/diagnostic-admin/categories",
  category: (id: string) => `/diagnostic-admin/categories/${encodeURIComponent(id)}`,
  questions: "/diagnostic-admin/questions?limit=100",
  question: (id: string) => `/diagnostic-admin/questions/${encodeURIComponent(id)}`,
  assessments: (page = 1) => `/diagnostic-admin/assessments?page=${page}&limit=20`,
  assessment: (id: string) => `/diagnostic-admin/assessments/${encodeURIComponent(id)}`,
};

export function diagnosticId(item: { _id?: string; id?: string }) {
  return item._id || item.id || "";
}

export function diagnosticDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
