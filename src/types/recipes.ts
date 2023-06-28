export type Recipes = {
  id: string;
  name: string;
  description?: string | undefined;
  created_at: string;
  user_id: string;
  diet_conform: boolean;
}