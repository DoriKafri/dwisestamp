import { google } from 'googleapis';
import { getAdminAuth } from './auth';

export interface GoogleWorkspaceUser {
  id: string;
  primaryEmail: string;
  name: {
    givenName: string;
    familyName: string;
    fullName: string;
  };
  orgUnitPath?: string;
  organizations?: Array<{
    title?: string;
    department?: string;
  }>;
  phones?: Array<{
    value: string;
    type: string;
  }>;
  thumbnailPhotoUrl?: string;
  suspended?: boolean;
}

export async function listWorkspaceUsers(
  domain?: string,
  pageToken?: string
): Promise<{ users: GoogleWorkspaceUser[]; nextPageToken?: string }> {
  const auth = getAdminAuth();
  const admin = google.admin({ version: 'directory_v1', auth });

  const response = await admin.users.list({
    domain: domain || process.env.GOOGLE_WORKSPACE_DOMAIN || 'develeap.com',
    maxResults: 100,
    pageToken: pageToken || undefined,
    projection: 'full',
    orderBy: 'email',
  });

  return {
    users: (response.data.users as GoogleWorkspaceUser[]) || [],
    nextPageToken: response.data.nextPageToken || undefined,
  };
}

export async function getWorkspaceUser(userKey: string): Promise<GoogleWorkspaceUser | null> {
  const auth = getAdminAuth();
  const admin = google.admin({ version: 'directory_v1', auth });

  try {
    const response = await admin.users.get({
      userKey,
      projection: 'full',
    });
    return response.data as GoogleWorkspaceUser;
  } catch {
    return null;
  }
}

export async function listDepartments(): Promise<string[]> {
  const departments = new Set<string>();
  let pageToken: string | undefined;

  do {
    const { users, nextPageToken } = await listWorkspaceUsers(undefined, pageToken);
    for (const user of users) {
      if (user.organizations?.[0]?.department) {
        departments.add(user.organizations[0].department);
      }
    }
    pageToken = nextPageToken;
  } while (pageToken);

  return Array.from(departments).sort();
}