import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'vaibhav@yopmail.com',
      name: 'Vaibhav',
      image: 'https://i.pravatar.cc/150?img=1',
      password: '$2a$10$0nBVGOQB4kaCH/F9VMqfeuwih5A4gQKJic8xD3mkTCHiTxdw1J0J6',
      role: UserRole.ADMIN,
    },
  });


  // // Create sample tasks
  // const task1 = await prisma.task.create({
  //   data: {
  //     title: 'Task 1',
  //     description: 'Description for task 1',
  //     deadline: new Date('2025-04-01T10:00:00Z'),
  //     priority: 'High',
  //     column: ColumnStatus.TODO,
  //     label: Label.FRONTEND , // Enum value for label
  //     tags: [Tag.FEATURE, Tag.URGENT], // Enum values for tags
  //     createdBy: {
  //       connect: { id: user1.id }, // Connect task to the creator (user1)
  //     },
  //     assignedTo: {
  //       connect: [{ id: user2.id }], // Assign the task to user2
  //     },
  //   },
  // });

  // const task2 = await prisma.task.create({
  //   data: {
  //     title: 'Task 2',
  //     description: 'Description for task 2',
  //     deadline: new Date('2025-04-10T10:00:00Z'),
  //     priority: 'Medium',
  //     column: ColumnStatus.TODO,
  //     label: Label.BACKEND, // Enum value for label
  //     tags: [Tag.BUG], // Enum value for tags
  //     createdBy: {
  //       connect: { id: user2.id }, // Connect task to the creator (user2)
  //     },
  //     assignedTo: {
  //       connect: [{ id: user1.id }], // Assign the task to user1
  //     },
  //   },
  // });


  console.log('Seeding complete!');
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
