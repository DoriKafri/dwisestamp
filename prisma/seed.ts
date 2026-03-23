import { PrismaClient, AdminRole, SignatureType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create super admin
  await prisma.admin.upsert({
    where: { email: 'dori.kafri@develeap.com' },
    update: {},
    create: {
      email: 'dori.kafri@develeap.com',
      name: 'Dori Kafri',
      role: AdminRole.SUPER_ADMIN,
    },
  });

  // Create default templates
  const professionalFooter = await prisma.template.create({
    data: {
      name: 'Professional Footer',
      description: 'Clean professional email footer with contact details',
      type: SignatureType.FOOTER,
      htmlContent: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; color: #333333;">
  <tr>
    <td style="padding-right: 15px; border-right: 2px solid #2563eb;">
      <img src="{{avatarUrl}}" alt="{{fullName}}" width="80" height="80" style="border-radius: 50%;" />
    </td>
    <td style="padding-left: 15px;">
      <p style="margin: 0; font-weight: bold; font-size: 16px; color: #1e293b;">{{fullName}}</p>
      <p style="margin: 2px 0; color: #64748b;">{{jobTitle}}{{#if department}} | {{department}}{{/if}}</p>
      <p style="margin: 2px 0; color: #64748b;">{{email}}</p>
      {{#if phone}}<p style="margin: 2px 0; color: #64748b;">{{phone}}</p>{{/if}}
      <p style="margin: 8px 0 0 0;">
        <a href="https://develeap.com" style="color: #2563eb; text-decoration: none; font-weight: bold;">develeap.com</a>
      </p>
    </td>
  </tr>
</table>`,
      isDefault: true,
      isActive: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Minimal Footer',
      description: 'Simple minimal signature with name and title',
      type: SignatureType.FOOTER,
      htmlContent: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 13px; color: #555555;">
  <tr>
    <td>
      <p style="margin: 0; font-weight: bold;">{{fullName}}</p>
      <p style="margin: 2px 0; color: #888888;">{{jobTitle}} at <a href="https://develeap.com" style="color: #2563eb; text-decoration: none;">Develeap</a></p>
      <p style="margin: 2px 0; color: #888888;">{{email}}{{#if phone}} | {{phone}}{{/if}}</p>
    </td>
  </tr>
</table>`,
      isActive: true,
    },
  });

  await prisma.template.create({
    data: {
      name: 'Department Header',
      description: 'Header with department branding',
      type: SignatureType.HEADER,
      htmlContent: `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: Arial, sans-serif; border-bottom: 3px solid #2563eb; padding-bottom: 10px; margin-bottom: 15px;">
  <tr>
    <td>
      <img src="https://develeap.com/logo.png" alt="Develeap" height="40" style="display: block;" />
    </td>
    <td style="text-align: right; color: #64748b; font-size: 12px;">
      {{#if department}}<p style="margin: 0; font-weight: bold; color: #1e293b;">{{department}}</p>{{/if}}
      <p style="margin: 2px 0;">{{fullName}} | {{jobTitle}}</p>
    </td>
  </tr>
</table>`,
      isActive: true,
    },
  });

  // Create sample workspace users
  const users = [
    { googleId: 'g1', email: 'user1@develeap.com', firstName: 'Alice', lastName: 'Cohen', fullName: 'Alice Cohen', department: 'Engineering', jobTitle: 'Senior Developer' },
    { googleId: 'g2', email: 'user2@develeap.com', firstName: 'Bob', lastName: 'Levy', fullName: 'Bob Levy', department: 'Engineering', jobTitle: 'DevOps Engineer' },
    { googleId: 'g3', email: 'user3@develeap.com', firstName: 'Carol', lastName: 'Bar', fullName: 'Carol Bar', department: 'Sales', jobTitle: 'Account Manager' },
    { googleId: 'g4', email: 'user4@develeap.com', firstName: 'Dan', lastName: 'Mor', fullName: 'Dan Mor', department: 'Marketing', jobTitle: 'Content Lead' },
    { googleId: 'g5', email: 'user5@develeap.com', firstName: 'Eve', lastName: 'Tal', fullName: 'Eve Tal', department: 'HR', jobTitle: 'HR Manager' },
  ];

  for (const user of users) {
    await prisma.workspaceUser.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // Create default app settings
  await prisma.appSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'Develeap',
      companyDomain: 'develeap.com',
      deploymentConcurrency: 5,
    },
  });

  // Create sample campaign
  await prisma.campaign.create({
    data: {
      name: 'Q1 2024 Product Launch',
      description: 'Promote new platform launch across all signatures',
      bannerHtml: `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 15px;">
  <tr>
    <td style="background-color: #2563eb; padding: 12px 20px; border-radius: 6px; text-align: center;">
      <a href="https://develeap.com/launch" style="color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold;">
        Check out our new platform →
      </a>
    </td>
  </tr>
</table>`,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
      isActive: true,
      priority: 10,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });