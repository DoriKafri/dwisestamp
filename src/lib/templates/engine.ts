import Handlebars from 'handlebars';

Handlebars.registerHelper('ifEquals', function (this: any, arg1: any, arg2: any, options: any) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('formatPhone', function (phone: string) {
  if (!phone) return '';
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
});

Handlebars.registerHelper('defaultValue', function (value: any, defaultVal: string) {
  return value || defaultVal;
});

export interface TemplateVariables {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  jobTitle?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
  companyName?: string;
  companyDomain?: string;
  [key: string]: string | undefined;
}

export function compile(template: string, variables: TemplateVariables): string {
  const compiled = Handlebars.compile(template);
  return compiled(variables);
}

export function extractVariables(template: string): string[] {
  const regex = /\{\{(?:#if\s+)?([a-zA-Z_][a-zA-Z0-9_.]*)/g;
  const variables = new Set<string>();
  let match;

  while ((match = regex.exec(template)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

export function renderPreview(template: string, variables?: TemplateVariables): string {
  const sampleData = variables || getSampleUserData();
  return compile(template, sampleData);
}

export function getSampleUserData(): TemplateVariables {
  return {
    fullName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@develeap.com',
    jobTitle: 'Senior Developer',
    department: 'Engineering',
    phone: '+972501234567',
    avatarUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&size=80',
    companyName: 'Develeap',
    companyDomain: 'develeap.com',
  };
}