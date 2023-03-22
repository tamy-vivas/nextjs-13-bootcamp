// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { times } from "../../../../data";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  if (!day || !time || !partySize) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  const searchTimes = times.find((s) => s.time === time)?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: new Date(`${day}T${searchTimes[0]}`),
        lte: new Date(`${day}T${searchTimes[searchTimes.length - 1]}`),
      },
    },
    select: {
      number_pf_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObj: { [key: string]: { [key: number]: true } } = {};

  bookings.forEach((booking) => {
    bookingTablesObj[booking.booking_time.toISOString()] =
      booking.tables.reduce((obj, table) => {
        return { ...obj, [table.table_id]: true };
      }, {});
  });

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({ errorMessage: "Invalid data provided" });
  }

  const tables = restaurant.tables;
  const searchTimesWithTables = searchTimes.map((st) => {
    return {
      date: new Date(`${day}T${st}`),
      time: st,
      tables,
    };
  });

  searchTimesWithTables.forEach((t) => {
    t.tables = t.tables.filter((table) => {
      const bookingTable = bookingTablesObj[t.date.toISOString()];
      if (bookingTable) {
        if (bookingTable[table.id]) return false;
      }
      return true;
    });
  });
  //vivaan-fine-indian-cuisine-ottawa

  res.status(200).json({
    searchTimes,
    bookings,
    bookingTablesObj,
    tables,
    searchTimesWithTables,
  });
}

//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/availability?day=2023-02-03&time=14:00:00.000Z&partySize=4
