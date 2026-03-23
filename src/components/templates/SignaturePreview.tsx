'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone } from 'lucide-react';
import { renderPreview } from '@/lib/templates/engine';
import { sanitizeSignatureHtml } from '@/lib/templates/sanitizer';

interface SignaturePreviewProps {
  htmlContent: string;
}

export function SignaturePreview({ htmlContent }: SignaturePreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    try {
      const rendered = renderPreview(htmlContent);
      setPreviewHtml(sanitizeSignatureHtml(rendered));
    } catch {
      setPreviewHtml('<p style="color: red;">Error rendering preview</p>');
    }
  }, [htmlContent]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Preview</CardTitle>
          <div className="flex gap-2">
            <Button variant={device === 'desktop' ? 'default' : 'outline'} size="sm" onClick={() => setDevice('desktop')}>
              <Monitor className="w-4 h-4" />
            </Button>
            <Button variant={device === 'mobile' ? 'default' : 'outline'} size="sm" onClick={() => setDevice('mobile')}>
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`border rounded-md p-4 bg-white overflow-auto ${device === 'mobile' ? 'max-w-[375px] mx-auto' : ''}`}
        >
          <div className="text-sm text-gray-400 mb-3 pb-3 border-b border-dashed">
            <p>Hi there,</p>
            <p className="mt-2">This is what your signature will look like in an email.</p>
            <p className="mt-2">Best regards,</p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      </CardContent>
    </Card>
  );
}