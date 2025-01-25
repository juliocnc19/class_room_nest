interface ActivityResponse {
  id: number;
  course_id: number;
  title: string;
  description: string;
  grade: number;
  start_date: string;
  end_date: string;
  email: string;
  digital: boolean;
  isQuizz: boolean;
  status_id: number;
  quizzId: number | null;
  questions: QuizQuestion[];
}

interface QuizQuestion {
  id: number;
  text: string;
  answer: number;
  options: QuizOption[];
}

interface QuizOption {
  id: number;
  text: string;
}
  