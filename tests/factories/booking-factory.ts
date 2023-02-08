import { prisma } from "@/config";
import { createUser } from "./users-factory";

export async function createBookingWithRoomFull(hotelId: number) {
  const user = await createUser();
  const room = await prisma.room.create({
    data: {
      name: "1042",
      capacity: 1,
      hotelId: hotelId,
    },
  });

  await prisma.booking.create({
    data: {
      roomId: room.id,
      userId: user.id,
    },
  });

  return room;
}

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      Room: { connect: { id: roomId } },
      User: { connect: { id: userId } },
    },
  });
}
