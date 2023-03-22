import { PrismaClient, Restaurant, Table } from "@prisma/client";
import { NextApiResponse } from "next";

import { times } from "../../data";

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  day,
  time,
  res,
  restaurant,
}: {
  day: string;
  time: string;
  res: NextApiResponse<any>;
  restaurant: {
    tables: Table[];
    open_time: string;
    close_time: string;
  };
}) => {
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

  return searchTimesWithTables;
};
