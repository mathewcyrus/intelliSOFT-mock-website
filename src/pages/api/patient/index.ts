import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  if (method === "POST") {
    //create a new patient in our database
    try {
      const newPatient = await prisma.patient.create({
        data: {
          firstName: body.firstname,
          lastName: body.lastname,
          dob: body.date,
          gender: body.gender,
        },
      });

      res.status(201).json(newPatient);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (method === "PUT") {
    try {
      const { id, inputInfo, bmi } = body;
      //Update a patient's vitals entry using their id

      const updatedVital = await prisma.vital.create({
        data: {
          patient: { connect: { id } },
          date: new Date(inputInfo.date),
          height: parseFloat(inputInfo.height),
          weight: parseFloat(inputInfo.weight),
          bmi: parseFloat(bmi),
          generalHealth: inputInfo.generalHealth,
          onDiet: inputInfo.onDiet,
          onDrugs: inputInfo.onDrugs,
          comment: inputInfo.comment,
        },
      });

      res.status(200).json(updatedVital);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (method === "GET") {
    try {
      const patientsWithVitals = await prisma.patient.findMany({
        include: {
          vitals: {
            select: {
              bmi: true,
              date: true, // Include only the 'bmi' and "date" field from vitals
            },
          },
        },
      });
      res.status(200).json(patientsWithVitals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      await prisma.$disconnect();
    }
  }
}
