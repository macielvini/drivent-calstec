import { prisma } from "@/config";
import { Booking, Room } from "@prisma/client";

type BookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;

type BookingWithRoom = {
  id: number;
  Room: Room;
};

async function createOne(booking: BookingParams): Promise<Booking> {
  return await prisma.booking.create({
    data: {
      Room: { connect: { id: booking.roomId } },
      User: { connect: { id: booking.userId } },
    },
  });
}

async function findBookingByUserId(id: number): Promise<BookingWithRoom> {
  const booking = await prisma.booking.findFirst({
    where: { userId: id },
    include: { Room: true },
  });

  return { id: booking.id, Room: booking.Room };
}

async function countRoomBookings(roomId: number) {
  return await prisma.booking.count({
    where: { roomId: roomId },
  });
}

const bookingRepository = { createOne, countRoomBookings, findBookingByUserId };
export default bookingRepository;
