export interface IdeaResponse {
  id: number;
  idea_id: number;
  user_id: string;
  emoji?: string;     
  text?: string;      
  created_at?: Date;
}