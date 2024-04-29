export interface Todo {
  id: number;
  inserted_at: string;
  is_complete: boolean;
  task: string;
  user_id: string;
}

export interface Profile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url: string;
}
