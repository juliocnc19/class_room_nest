interface QuizOption {
    id: number;
    text: string;
  }
  
  interface QuizQuestion {
    id: number;
    text: string;
    answer: number;
    options: QuizOption[];
  }
  
  interface QuizActivity {
    id: number;
    title: string;
    description: string;
    grade: number;
    start_date: string;
    end_date: string;
    email: string;
    digital: boolean;
    isQuizz: boolean;
  }
  
  interface CompleteQuizResponse {
    id: number;
    activity_id: number;
    activity: QuizActivity;
    question: QuizQuestion[];
  }