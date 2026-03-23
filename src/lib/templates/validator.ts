export const KNOWN_VARIABLES = [
  'fullName', 'firstName', 'lastName', 'email', 'jobTitle',
  'department', 'phone', 'avatarUrl', 'companyName', 'companyDomain',
];

export const EMAIL_SAFE_FONTS = [
  'Arial', 'Helvetica', 'Georgia', 'Times New Roman',
  'Courier New', 'Verdana', 'Tahoma', 'Trebuchet MS',
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateHtml(html: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!html || html.trim().length === 0) {
    errors.push('HTML content is required');
  }

  if (html && html.length > 10240) {
    errors.push('HTML content exceeds maximum size of 10KB');
  }

  if (html && /<script/i.test(html)) {
    errors.push('Script tags are not allowed in email signatures');
  }

  if (html && /<iframe/i.test(html)) {
    errors.push('Iframe tags are not allowed in email signatures');
  }

  if (html && /display\s*:\s*flex/i.test(html)) {
    warnings.push('Flexbox may not be supported in all email clients. Consider using table layout.');
  }

  if (html && /display\s*:\s*grid/i.test(html)) {
    warnings.push('CSS Grid may not be supported in all email clients. Consider using table layout.');
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateVariables(template: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const varRegex = /\{\{(?:#if\s+)?([a-zA-Z_][a-zA-Z0-9_.]*)/g;
  let match;

  while ((match = varRegex.exec(template)) !== null) {
    const varName = match[1];
    if (!KNOWN_VARIABLES.includes(varName)) {
      warnings.push(`Unknown variable: {{${varName}}}. It may not be populated during deployment.`);
    }
  }

  const openBraces = (template.match(/\{\{/g) || []).length;
  const closeBraces = (template.match(/\}\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push('Mismatched template braces. Check your {{variable}} syntax.');
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateTemplate(html: string): ValidationResult {
  const htmlResult = validateHtml(html);
  const varResult = validateVariables(html);

  return {
    valid: htmlResult.valid && varResult.valid,
    errors: [...htmlResult.errors, ...varResult.errors],
    warnings: [...htmlResult.warnings, ...varResult.warnings],
  };
}