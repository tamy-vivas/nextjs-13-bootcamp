// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

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

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({ errorMessage: "Restaurant not found" });
  }

  if (
    new Date(`${day}T${time}`) < new Date(`${day}T${restaurant.open_time}`) ||
    new Date(`${day}T${time}`) > new Date(`${day}T${restaurant.close_time}`)
  ) {
    return res
      .status(400)
      .json({ errorMessage: "Restaruant is not open at that time" });
  }

  res.status(200).json({ slug, day, time, partySize });
}

//http://localhost:3000/api/restaurant/vivaan-fine-indian-cuisine-ottawa/reserve?day=2023-02-03&time=14:00:00.000Z&partySize=2
