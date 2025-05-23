export type Role = "user" | "assistant";
export interface MessageHistory {
  role: Role;
  content: string;
}
