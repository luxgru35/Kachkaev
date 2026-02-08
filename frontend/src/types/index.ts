export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  createdBy: number;
  deletedAt: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface EventListParams {
  includeSoftDeleted?: boolean;
}
