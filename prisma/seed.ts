import { ColumnStatus, Label, PrismaClient, Tag, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'vaibhav@yopmail.com',
      name: 'Vaibhav',
      image: 'https://i.pravatar.cc/150?img=1',
      password: '$2a$10$0nBVGOQB4kaCH/F9VMqfeuwih5A4gQKJic8xD3mkTCHiTxdw1J0J6',
      role: UserRole.EMPLOYEE,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'superadmin@yopmail.com',
      name: 'Super Admin',
      image: 'https://i.pravatar.cc/150?img=2',
      password: '$2a$10$0nBVGOQB4kaCH/F9VMqfeuwih5A4gQKJic8xD3mkTCHiTxdw1J0J6',
      role: UserRole.ADMIN,
    },
  });

  const task1 = await prisma.task.create({
    data: {
      title: 'Task 1',
      description: 'Description for task 1',
      deadline: new Date('2025-04-01T10:00:00Z'),
      priority: 'High',
      column: ColumnStatus.TODO,
      label: Label.FRONTEND , 
      tags: [Tag.FEATURE, Tag.URGENT],
      createdBy: {
        connect: { id: user1.id },
      },
      assignedTo: {
        connect: [{ id: user2.id }],
      },
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Task 2',
      description: 'Description for task 2',
      deadline: new Date('2025-04-10T10:00:00Z'),
      priority: 'Medium',
      column: ColumnStatus.TODO,
      label: Label.BACKEND,
      tags: [Tag.BUG], 
      createdBy: {
        connect: { id: user2.id }, 
      },
      assignedTo: {
        connect: [{ id: user1.id }], 
      },
    },
  });


  console.log('Seeding complete!');
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
