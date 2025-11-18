import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAddressService = async (user, body) => {
  const { street, city, postalCode, country } = body;

  const client = await prisma.client.findUnique({
    where: { userId: user.userId },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const address = await prisma.address.create({
    data: {
      street,
      city,
      postalCode,
      country,
      clientId: client.id,
    },
    include: {
      client: {
        include: { user: true },
      },
    },
  });

  return address;
};

export const updateAddressService = async (user, body) => {
  const { id, ...fieldsToUpdate } = body;

  if (!id) {
    throw new Error("Address ID is required");
  }

  const client = await prisma.client.findUnique({
    where: { userId: user.userId },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  // Vérifier si l'adresse appartient bien à ce client
  const addressExist = await prisma.address.findUnique({
    where: { id },
  });

  if (!addressExist || addressExist.clientId !== client.id) {
    throw new Error("Vous n’avez pas la permission de modifier cette adresse");
  }

  const updatedAddress = await prisma.address.update({
    where: { id },
    data: fieldsToUpdate,
  });

  return updatedAddress;
};

export const getAddressByUserIdService = async (user) => {
  const client = await prisma.client.findUnique({
    where: { userId: user.userId },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const addresses = await prisma.address.findMany({
    where: { clientId: client.id },
  });

  return addresses;
};

export const deleteAddressService = async (user, addressId) => {
  console.log("ididid", user);

  if (!addressId) {
    throw new Error("Address ID is required");
  }

  const client = await prisma.client.findUnique({
    where: { userId: user.userId },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.clientId !== client.id) {
    throw new Error("Vous ne pouvez pas supprimer cette adresse");
  }

  const deleted = await prisma.address.delete({
    where: { id: addressId },
  });

  return deleted;
};
