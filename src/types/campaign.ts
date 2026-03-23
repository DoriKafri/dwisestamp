export interface CampaignFormData {
  name: string;
  description?: string;
  bannerHtml: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  priority?: number;
}

export interface CampaignWithStatus {
  id: string;
  name: string;
  description: string | null;
  bannerHtml: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  priority: number;
  status: 'active' | 'scheduled' | 'expired' | 'inactive';
}