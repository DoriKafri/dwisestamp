import { google } from 'googleapis';
import { getGmailAuth } from './auth';

export async function getUserSignature(userEmail: string): Promise<string> {
  const auth = getGmailAuth(userEmail);
  const gmail = google.gmail({ version: 'v1', auth });

  try {
    const response = await gmail.users.settings.sendAs.get({
      userId: 'me',
      sendAsEmail: userEmail,
    });
    return response.data.signature || '';
  } catch {
    return '';
  }
}

export async function setUserSignature(
  userEmail: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  const auth = getGmailAuth(userEmail);
  const gmail = google.gmail({ version: 'v1', auth });

  try {
    await gmail.users.settings.sendAs.update({
      userId: 'me',
      sendAsEmail: userEmail,
      requestBody: { signature },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to set signature' };
  }
}

export async function batchSetSignatures(
  updates: Array<{ email: string; signature: string }>,
  concurrency = 5
): Promise<Array<{ email: string; success: boolean; error?: string }>> {
  const results: Array<{ email: string; success: boolean; error?: string }> = [];

  for (let i = 0; i < updates.length; i += concurrency) {
    const batch = updates.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(async ({ email, signature }) => {
        const result = await setUserSignature(email, signature);
        return { email, ...result };
      })
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({ email: 'unknown', success: false, error: result.reason?.message });
      }
    }
  }

  return results;
}