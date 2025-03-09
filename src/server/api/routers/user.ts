import { compare, hash } from "bcryptjs";
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
  updatePassword: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        currentPassword: z.string(),
        newPassword: z.string(),
        confirmPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new Error("User not found");
      } 

      const isPasswordCorrect = await compare(input.currentPassword ?? "", user.password ?? "");
      if (!isPasswordCorrect) {
        throw new Error("Current password is incorrect");
      }

      const hashedPassword = await hash(input.newPassword ?? "", 10);
      return ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          password: hashedPassword,
        },
      });
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
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
          image: input.image,
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
