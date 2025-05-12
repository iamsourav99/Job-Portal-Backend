import { PrismaClient } from "@prisma/client";


export const prisma = new PrismaClient();


//connect to database
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect database", error);
    process.exit(1);
  }
};
