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

const bookingRepository = { createOne };
export default bookingRepository;
