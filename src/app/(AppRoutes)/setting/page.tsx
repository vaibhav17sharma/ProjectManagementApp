"use client";

import AddUser from "@/app/_components/AddUser";
import EditUser from "@/app/_components/EditUser";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { api } from "@/trpc/react";
import { type User } from "@prisma/client";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";

export default function SettingPage() {
  const [open, setOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  const handleDialogChange = (open: boolean, userId: string) => {
    setEditDialogOpen(open ? userId : null);
  };

  const handleDeleteDialogChange = (open: boolean, userId: string) => {
    setDeleteDialogOpen(open ? userId : null);
  };

  const { data: users } = api.user.getAllUsers.useQuery();
  const { mutate: softDeleteUser } = api.user.softDeleteUser.useMutation();

  const removeUser = (user: User) => {
    softDeleteUser(user.id);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Setting</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-2lg max-w-[425px] lg:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Add a new user to the project
              </DialogDescription>
            </DialogHeader>
            <AddUser setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <Table className="mt-4 rounded-md border p-4 shadow-md">
        <TableHeader className="bg-gray-100 p-3">
          <TableRow className="p-3 text-left text-sm font-medium">
            <TableHead className="w-[100px]">S.No.</TableHead>
            <TableHead className="w-[100px]">Avatar</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">
                <Avatar>
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                {user.isActive ? (
                  <>
                    <Dialog
                      open={editDialogOpen === user.id}
                      onOpenChange={(open) => handleDialogChange(open, user.id)}
                    >
                      <DialogTrigger asChild>
                        <Button className="mr-2">Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="md:max-w-2lg max-w-[425px] lg:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Edit User details here
                          </DialogDescription>
                        </DialogHeader>
                        <EditUser
                          setOpen={setEditDialogOpen}
                          user={user}
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog
                      open={deleteDialogOpen === user.id}
                      onOpenChange={(open) =>
                        handleDeleteDialogChange(open, user.id)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="mr-2">
                          Deactivate
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="md:max-w-2lg max-w-[425px] lg:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Deactivate User</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to deactivate {user.name}?
                          </DialogDescription>
                        </DialogHeader>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            removeUser(user);
                            setDeleteDialogOpen(null);
                          }}
                        >
                          Deactivate
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <>
                    <Dialog
                      open={editDialogOpen === user.id}
                      onOpenChange={(open) => handleDialogChange(open, user.id)}
                    >
                      <DialogTrigger asChild>
                        <Button className="mr-2">Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="md:max-w-2lg max-w-[425px] lg:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Edit User details here
                          </DialogDescription>
                        </DialogHeader>
                        <EditUser 
                          setOpen={setEditDialogOpen}
                          user={user}
                        />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
