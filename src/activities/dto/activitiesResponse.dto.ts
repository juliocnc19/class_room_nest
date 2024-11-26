interface ActivityResponse {
    id: number;
    title: string;
    course_id: number;
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
    answer: number; // This is the index of the correct answer
    options: QuizOption[];
  }
  
  interface QuizOption {
    id: number;
    text: string;
  }
  