import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const deployment = await prisma.deployment.findUnique({ where: { id: params.id } });
  if (!deployment) return new Response('Not found', { status: 404 });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let lastCompleted = 0;
      const interval = setInterval(async () => {
        try {
          const current = await prisma.deployment.findUnique({
            where: { id: params.id },
            include: { users: { where: { status: { not: 'PENDING' } }, orderBy: { processedAt: 'desc' }, take: 1, include: { user: true } } },
          });
          if (!current) { clearInterval(interval); controller.close(); return; }
          const completed = current.successCount + current.failCount;
          if (completed > lastCompleted) {
            lastCompleted = completed;
            sendEvent({ type: 'progress', data: { deploymentId: current.id, status: current.status, total: current.totalUsers, completed: current.successCount, failed: current.failCount, currentUser: current.users[0]?.user?.email } });
          }
          if (['COMPLETED', 'PARTIALLY_COMPLETED', 'FAILED'].includes(current.status)) {
            sendEvent({ type: 'done', data: { deploymentId: current.id, status: current.status, total: current.totalUsers, completed: current.successCount, failed: current.failCount } });
            clearInterval(interval);
            controller.close();
          }
        } catch { clearInterval(interval); controller.close(); }
      }, 1000);
    },
  });

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' } });
}