"use client";
import React, { useState } from "react";
import {
  Button,
  Separator,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Skeleton,
} from "@/components";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/srcservices";

type Role = {
  id: string;
  description: string;
};

type Customer = {
  id: string;
  name: string;
};

type UserProfile = {
  id: string;
  userName: string;
  userFile: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  roles: Role[];
  customers: Customer[];
  avatar: string;
};

const initialProfile: UserProfile = {
  id: "-",
  userName: "-",
  userFile: "-",
  firstName: "-",
  lastName: "-",
  address: "-",
  email: "-",
  phone: "-",
  roles: [
    {
      id: "-",
      description: "-",
    },
    { id: "-", description: "-" },
    { id: "-", description: "-" },
  ],
  customers: [{ id: "-", name: "-" }],
  avatar: "-",
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const { data: session } = useSession();
  const userProfile = useQuery({
    queryKey: ["user-profile", session?.user.token],
    queryFn: () => getUserById(session?.user.token || ""),
    enabled: !!session?.user.token,
  });

  if (userProfile.isPending)
    return <Skeleton className="max-w-6xl h-[80vh] container mx-auto mt-6" />;

  if (userProfile.error)
    return "An error has occurred: " + userProfile.error.message;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfile(initialProfile); // Restablecer los cambios si se cancela
  };

  const handleSave = () => {
    // Aquí puedes realizar la lógica para guardar los cambios (por ejemplo, enviar los datos al backend)
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof UserProfile
  ) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl mt-6">
      <Card>
        <CardHeader className="flex items-center space-x-4 ">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={userProfile.data.response.avatar}
              alt="User Avatar"
            />
            <AvatarFallback>
              {profile.firstName[0]}
              {profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">
              {userProfile.data.response.firstName}{" "}
              {userProfile.data.response.lastName}
            </h1>
            <p className="text-gray-500">
              {userProfile.data.response.userName}
            </p>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">ID:</span>
            <span className="font-medium">{userProfile.data.response.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Archivo:</span>
            <span className="font-medium">
              {userProfile.data.response.userFile}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            {isEditing ? (
              <input
                type="email"
                value={userProfile.data.response.email}
                onChange={(e) => handleChange(e, "email")}
                className="border p-2 rounded"
              />
            ) : (
              <span className="font-medium">
                {userProfile.data.response.email}
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Teléfono:</span>
            {isEditing ? (
              <input
                type="tel"
                value={userProfile.data.response.phone}
                onChange={(e) => handleChange(e, "phone")}
                className="border p-2 rounded"
              />
            ) : (
              <span className="font-medium">
                {userProfile.data.response.phone}
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dirección:</span>
            {isEditing ? (
              <input
                type="text"
                value={userProfile.data.response.address}
                onChange={(e) => handleChange(e, "address")}
                className="border p-2 rounded"
              />
            ) : (
              <span className="font-medium">
                {userProfile.data.response.address}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mt-4">Roles:</h2>
            <ul className="list-disc pl-5">
              {userProfile.data.response.roles.map(
                (role: { id: string; description: string }) => (
                  <li key={role.id}>{role.description}</li>
                )
              )}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mt-4">Clientes:</h2>
            <ul className="list-disc pl-5">
              {userProfile.data.response.customers.map(
                (customer: { id: string; name: string }) => (
                  <li key={customer.id}>{customer.name}</li>
                )
              )}
            </ul>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Guardar</Button>
              <Button onClick={handleCancelEdit}>Cancelar</Button>
            </>
          ) : (
            <Button onClick={handleEditClick}>Editar Perfil</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
