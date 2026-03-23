import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { TemplateService } from '@/services/TemplateService';
import { renderPreview } from '@/lib/templates/engine';
import { sanitizeSignatureHtml } from '@/lib/templates/sanitizer';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth();
  if (error) return error;
  const template = await TemplateService.getById(params.id);
  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const preview = renderPreview(template.htmlContent);
  const sanitized = sanitizeSignatureHtml(preview);
  return NextResponse.json({ html: sanitized });
}