export interface Mission {
  id: number;
  title: string;
  puzzle: string;
  solution: string;
  placement: string;
  imageUrl?: string;
  isGeneratingImage?: boolean;
}

export interface EscapeRoom {
  title: string;
  story: string;
  missions: Mission[];
  finalPuzzle: string;
  finalSolution: string;
}