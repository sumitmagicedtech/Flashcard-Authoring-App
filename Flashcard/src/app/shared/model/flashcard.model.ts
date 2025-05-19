export interface Flashcard {
  id: number;
  title: string;
  images: string[];
  tags: {
    category: string;
    subCategory: string;
    subject: string;
  };
  difficulty: string;
  animation: string;
  question: string;
  answer: string;
  options: string[];
  correctAnswer: number;
}
