import { DeploymentStatus, DeploymentUserStatus } from '@prisma/client';

export interface DeploymentRequest {
  templateId: string;
  userIds: string[];
  deployedBy: string;
}

export interface DeploymentTarget {
  userId: string;
  email: string;
  fullName: string | null;
}

export interface DeploymentProgress {
  deploymentId: string;
  status: DeploymentStatus;
  total: number;
  completed: number;
  failed: number;
  currentUser?: string;
}

export interface DeploymentEvent {
  type: 'progress' | 'user_complete' | 'user_failed' | 'done' | 'error';
  data: DeploymentProgress & { userEmail?: string; error?: string };
}