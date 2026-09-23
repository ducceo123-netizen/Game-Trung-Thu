export type GamePhase = 
  | 'start_overlay'
  | 'intro_story'
  | 'playing'
  | 'rebooting'
  | 'game_won';

export interface DialogueData {
  speaker: string;
  avatar?: string;
  lines: string[];
  currentLineIndex: number;
  onComplete?: () => void;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
}

export interface QuestItem {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  position: [number, number, number];
  color: string;
  collected: boolean;
}

export interface LanternConfig {
  id: string;
  name: string;
  vietnameseName: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  interactionText: string;
  joke: string;
}
