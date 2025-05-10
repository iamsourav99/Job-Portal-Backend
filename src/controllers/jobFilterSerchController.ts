import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { buildJobQuery, JobSearchQuery } from "../utils/jobSearchHelper.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";

export const jobFilterSearchController = async (req: Request, res: Response):Promise<void> => {
  try {
    const jobQuery = buildJobQuery(req.query as any); // Already validated
    const jobs = await prisma.job.findMany({
      where: jobQuery.filters,
      skip: jobQuery.skip,
      take: jobQuery.take,
      orderBy: jobQuery.orderBy,
      select: {
        id: true,
        title: true,
        skills: true,
        postDate: true,
        recruiter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    const total = await prisma.job.count({
      where: jobQuery.filters,
    });
    if (jobs.length === 0) {
      res.status(404).json({
        success: false,
        message: "Job not available as per your filter",
      });
      return;
    }
    sendSuccess(res, {
      jobs,
      totalValue: total,
      currentPage: jobQuery.pageNumber,
      totalPages: Math.ceil(total / jobQuery.take),
    });
  } catch (error) {
    console.error("Error fetching jobs", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
