export interface WorkspaceUserWithStatus {
  id: string;
  googleId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  department: string | null;
  jobTitle: string | null;
  phone: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastSyncedAt: Date;
  assignedTemplates?: Array<{ id: string; name: string; type: string }>;
}

export interface UserFilter {
  search?: string;
  department?: string;
  hasTemplate?: boolean;
  isActive?: boolean;
}

export interface SyncResult {
  added: number;
  updated: number;
  deactivated: number;
  errors: string[];
}