// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jose from "jose";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { firstName, lastName, email, phone, city, password } = req.body;
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20,
        }),
        errorMessage: "First name is Invalid!",
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20,
        }),
        errorMessage: "Last name is Invalid!",
      },
      {
        valid: validator.isEmail(email),
        errorMessage: "Email is Invalid!",
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: "Phone is Invalid!",
      },
      {
        valid: validator.isLength(city, { min: 1 }),
        errorMessage: "City is Invalid!",
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: "Password is not strong enough!",
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        errors.push(check.errorMessage);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({ errorMessage: errors[0] });
    }

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithEmail) {
      return res
        .status(400)
        .json({ errorMessage: "Email is associated with another account" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        phone,
        city,
        email,
      },
    });

    const alg = "HS256";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret);

    res.status(200).json({ token });
  }
}
