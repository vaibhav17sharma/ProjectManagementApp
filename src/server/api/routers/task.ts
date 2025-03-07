import { ColumnStatus, Label, Tag } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        deadline: z.date(),
        priority: z.enum(["low", "medium", "high"]),
        label: z.nativeEnum(Label),
        tags: z.array(z.nativeEnum(Tag)),
        assignedTo: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          deadline: input.deadline,
          priority: input.priority,
          label: input.label,
          column: ColumnStatus.TODO,
          tags: input.tags,
          assignedTo: { connect: input.assignedTo.map((id) => ({ id })) },
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.task.findMany({
      where: { createdBy: { id: ctx.session.user.id } },
      include: {
        assignedTo: true,
      },
    });
  }),
  getById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.db.task.findUnique({
      where: { id: input, createdBy: { id: ctx.session.user.id } },
    });
  }),
  updateColumnBulk: protectedProcedure.input(z.object({
    tasks: z.array(z.object({
      id: z.string(),
      column: z.nativeEnum(ColumnStatus),
    })),
  })).mutation(async ({ ctx, input }) => {
    return ctx.db.task.updateMany({
      data: input.tasks.map((task) => ({ id: task.id, column: task.column })),
    });
  }),
  updateColumn: protectedProcedure.input(z.object({
    id: z.string(),
    column: z.nativeEnum(ColumnStatus),
  })).mutation(async ({ ctx, input }) => {
    return ctx.db.task.update({
      where: { id: input.id, createdBy: { id: ctx.session.user.id } },
      data: { column: input.column },
    });
  }),
  update: protectedProcedure.input(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    deadline: z.date(),
    priority: z.enum(["low", "medium", "high"]),
    label: z.nativeEnum(Label),
    column: z.nativeEnum(ColumnStatus),
    tags: z.array(z.nativeEnum(Tag)),
    assignedTo: z.array(z.string()),
  })).mutation(async ({ ctx, input }) => {
    return ctx.db.task.update({
      where: { id: input.id, createdBy: { id: ctx.session.user.id   } },
      data: {
        title: input.title,
        description: input.description,
        deadline: input.deadline,
        priority: input.priority,
        label: input.label,
        column: input.column,
        tags: input.tags,
        assignedTo: { connect: input.assignedTo.map((id) => ({ id })) },
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });
  }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.db.task.delete({
      where: { id: input, createdBy: { id: ctx.session.user.id } },
    });
  }),
});
