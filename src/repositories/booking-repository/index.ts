import { prisma } from "@/config";
import { Booking } from "@prisma/client";

type BookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;

async function createOne(booking: BookingParams): Promise<Booking> {
  return await prisma.booking.create({
    data: {
      Room: { connect: { id: booking.roomId } },
      User: { connect: { id: booking.userId } },
    },
  });
}

async function countRoomBookings(roomId: number) {
  return await prisma.booking.count({
    where: { roomId: roomId },
  });
}

const bookingRepository = { createOne, countRoomBookings };
export default bookingRepository;
