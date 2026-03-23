import { DashboardCard } from '@/components/dashboard/DashboardCard';
import prisma from '@/lib/prisma';
import { FileText, Users, Send, Megaphone } from 'lucide-react';

export default async function DashboardPage() {
  const [templateCount, userCount, deploymentCount, campaignCount] = await Promise.all([
    prisma.template.count({ where: { isActive: true } }),
    prisma.workspaceUser.count({ where: { isActive: true } }),
    prisma.deployment.count(),
    prisma.campaign.count({ where: { isActive: true } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard title="Active Templates" value={templateCount} icon={<FileText className="w-8 h-8" />} />
        <DashboardCard title="Workspace Users" value={userCount} icon={<Users className="w-8 h-8" />} />
        <DashboardCard title="Total Deployments" value={deploymentCount} icon={<Send className="w-8 h-8" />} />
        <DashboardCard title="Active Campaigns" value={campaignCount} icon={<Megaphone className="w-8 h-8" />} />
      </div>
    </div>
  );
}