import { SignatureType } from '@prisma/client';

export interface TemplateFormData {
  name: string;
  description?: string;
  type: SignatureType;
  htmlContent: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface EditorConfig {
  mode: 'visual' | 'html';
  showPreview: boolean;
  previewDevice: 'desktop' | 'mobile';
}

export interface EditorFields {
  fullName: boolean;
  jobTitle: boolean;
  department: boolean;
  email: boolean;
  phone: boolean;
  avatarUrl: boolean;
  companyName: boolean;
}

export interface EditorStyling {
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
  textColor: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}