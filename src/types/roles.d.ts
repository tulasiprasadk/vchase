// Lightweight TypeScript declaration for roles if you prefer importing types from a `types` file.
export type Role =
  | "super_admin"
  | "admin"
  | "supervisor"
  | "executive"
  | "organizer"
  | "sponsor";

export type Permission =
  | "full_access_all_modules"
  | "manage_system"
  | "add_user"
  | "edit_user"
  | "delete_user"
  | "assign_read_only"
  | "assign_executive_readonly"
  | "view_service_requests"
  | "manage_service_requests"
  | "block_features"
  | "update_logs"
  | "view_portfolio"
  | "view_own_entries"
  | "edit_own_entries";
