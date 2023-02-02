import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotelWithRooms() {
  await prisma.hotel.create({
    data: {
      image: faker.image.business(),
      name: faker.company.companyName(),
      Rooms: {
        create: [
          { capacity: 4, name: faker.music.genre() },
          { capacity: 2, name: faker.music.genre() },
          { capacity: 8, name: faker.music.genre() },
        ],
      },
    },
  });

  return await prisma.hotel.create({
    data: {
      image: faker.image.business(),
      name: faker.company.companyName(),
      Rooms: {
        create: [
          { capacity: 3, name: faker.music.genre() },
          { capacity: 6, name: faker.music.genre() },
          { capacity: 10, name: faker.music.genre() },
        ],
      },
    },
  });
}
