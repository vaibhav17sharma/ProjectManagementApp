import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({});
  }),
  getAllEmployees: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      where: {
        role: "EMPLOYEE",
        isActive: true,
      },
    });
  }),
  getUserById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input,
          isActive: true,
        },
      });
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          image: input.image,
        },
      });
    }),
  newUser: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        image: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          image: input.image,
          password: input.password,
        },
      });
    }),
  softDeleteUser: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input,
        },
        data: {
          isActive: false,
        },
      });
    }),
  getUserByEmail: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          email: input,
        },
      });
    }),
});
