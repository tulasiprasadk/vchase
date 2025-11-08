/**
 * Role and permission definitions for the platform.
 *
 * Purpose:
 * - Provide a single source of truth for roles and their capabilities.
 * - Export helpers to check permissions in UI/server code.
 *
 * Usage examples:
 * import { Role, Permission, hasPermission, getPermissionsForRole } from '@/lib/roles'
 * if (hasPermission(user.role, 'manage_service_requests')) { ... }
 */

export type Role =
  | "super_admin"
  | "admin"
  | "supervisor"
  | "executive"
  | "organizer"
  | "sponsor";

export type Permission =
  | "full_access_all_modules"
  | "manage_system" // Modify system-wide configuration, roles, permissions
  | "add_user"
  | "edit_user"
  | "delete_user"
  | "assign_read_only" // Assign read-only access to lower roles
  | "assign_executive_readonly" // Supervisor/Admin-specific action
  | "view_career_applications"
  | "view_service_requests"
  | "manage_service_requests"
  | "block_features" // Allow/block features for lower roles
  | "update_logs" // Executives can update call/meeting logs
  | "view_portfolio" // Organizer/Sponsor can view their own portfolio
  | "view_own_entries" // View items they submitted
  | "edit_own_entries";

// Human-friendly labels for roles (use in UI)
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  supervisor: "Supervisor",
  executive: "Executive",
  organizer: "Organizer",
  sponsor: "Sponsor",
};

// Permission sets by role based on the overview you provided.
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    "full_access_all_modules",
    "manage_system",
    "add_user",
    "edit_user",
    "delete_user",
    "assign_read_only",
    "assign_executive_readonly",
    "view_career_applications",
    "view_service_requests",
    "manage_service_requests",
    "block_features",
    "update_logs",
    "view_portfolio",
    "view_own_entries",
    "edit_own_entries",
  ],

  admin: [
    "add_user",
    "assign_read_only",
    "assign_executive_readonly",
    "view_career_applications",
    "view_service_requests",
    "manage_service_requests",
  ],

  supervisor: [
    "assign_executive_readonly",
    "view_career_applications",
    "block_features",
    "view_service_requests",
  ],

  executive: [
    // read-only across the system (no add/edit/delete)
    "view_career_applications",
    "view_service_requests",
    "update_logs",
  ],

  organizer: ["view_portfolio", "view_own_entries", "edit_own_entries"],

  sponsor: ["view_portfolio", "view_own_entries"],
};

/**
 * Get all permissions for a given role (deduplicated).
 */
export function getPermissionsForRole(role: Role): Permission[] {
  const perms = ROLE_PERMISSIONS[role] || [];
  return Array.from(new Set(perms));
}

/**
 * Check whether a role has a specific permission.
 *
 * Usage: hasPermission(user.role, 'manage_service_requests')
 */
export function hasPermission(
  role: Role | string | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  // Normalize role to lowercase so checks are case-insensitive
  const roleKey = String(role).toLowerCase() as Role;
  const perms = ROLE_PERMISSIONS[roleKey];
  if (!perms) return false;

  // full_access_all_modules implies everything
  if (perms.includes("full_access_all_modules")) return true;

  return perms.includes(permission);
}

/**
 * Utility: returns whether a role is at least one of the provided roles.
 * Useful for simple guards (e.g. allow admins and super_admins)
 */
export function isOneOf(
  role: Role | string | undefined,
  roles: Role[]
): boolean {
  if (!role) return false;
  const roleKey = String(role).toLowerCase();
  return roles.some((r) => r.toLowerCase() === roleKey);
}
