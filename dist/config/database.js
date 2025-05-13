import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
//database connection
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Failed to connect database", error);
        process.exit(1);
    }
};
