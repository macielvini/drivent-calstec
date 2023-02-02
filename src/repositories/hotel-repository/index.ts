import { prisma } from "@/config";

export type RoomEntity = {
  id: number;
  name: string;
  capacity: number;
  hotelId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type HotelEntity = {
  id: number;
  name: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
};

export type HotelWithRooms = {
  id: number;
  name: string;
  image: string;
  Rooms: RoomEntity[];
  createdAt: Date;
  updatedAt: Date;
};

async function findAll(): Promise<HotelEntity[]> {
  const data = await prisma.hotel.findMany({});
  return data;
}

async function findWithRoomsById(id: number): Promise<HotelWithRooms> {
  const data = await prisma.hotel.findUnique({
    where: { id: id },
    include: { Rooms: true },
  });

  return data;
}

export const hotelRepository = { findAll, findWithRoomsById };
