import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.user.readonly',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
];

export function createServiceAccountAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: SCOPES,
    subject: process.env.GOOGLE_ADMIN_EMAIL,
  });
}

export function getAdminAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/admin.directory.user.readonly'],
    subject: process.env.GOOGLE_ADMIN_EMAIL,
  });
}

export function getGmailAuth(userEmail: string) {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: [
      'https://www.googleapis.com/auth/gmail.settings.basic',
      'https://www.googleapis.com/auth/gmail.settings.sharing',
    ],
    subject: userEmail,
  });
}