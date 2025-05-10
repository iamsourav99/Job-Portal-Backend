import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";
import { parseQueryParams } from "../utils/PaginationAndSortingHelper.js";
//post job
export const postJob = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      res.status(400).json({ message: "Request body is missing." });
    }
    const { title, description, skills } = req.body;
    const recruiterId = (req as any).user.id;
    const job = await prisma.job.create({
      data: { title, description, skills, recruiterId },
    });
    sendSuccess(res, job, "job posted successfully", 201);
  } catch (err) {
    sendError(res, err, "Unable to post job", 500);
  }
};

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //values for pagination and sorting  
    // const {
    //   page = "1",
    //   limit = "5",
    //   sortBy = "postDate",
    //   order = "desc",
    // } = req.query as {
    //   page?: string;
    //   limit?: string;
    //   sortBy?: string;
    //   order?: "asc" | "desc";
    // };

    // const pageNo = parseInt(page, 10);
    // const take = parseInt(limit, 10);
    // const skip = (pageNo - 1) * take;
const { page, limit, sortBy, order } = parseQueryParams(req.query);
const skip = (page - 1) * limit;

    const jobs = await prisma.job.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        skills: true,
        postDate: true,
        recruiter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      skip,
      take:limit,
      orderBy: {
        [sortBy]: order,
      },
    });

    const total = await prisma.job.count({
      where: {
        isDeleted: false,
      },
    });
    if (jobs.length === 0) {
      sendError(res, "Not Found", "Job not Found", 404);
      return;
    }

    // res.json(jobs);
    sendSuccess(res, {
      jobs,
      totalvalues: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    },"success",200);
    return;
  } catch (err) {
    sendError(res, err, "Internal Server Error");
    return;
  }
};

export const updateJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, skills } = req.body;
    const jobId = req.params.id;
    if (!jobId) {
      sendError(res, "Error to get job id", "Please provide job is url", 400);
    }
    const recruiterId = (req as any).user.id;

    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        recruiterId: recruiterId,
        isDeleted: false,
      },
    });
    if (!job) {
      sendError(
        res,
        "Not Found",
        "Job not found or you are unauthorized ",
        401
      );
    }
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { title, description, skills, updatedAt: new Date() },
    });
    sendSuccess(res, updatedJob, "Job Updated Successfully", 201);
  } catch (error) {
    sendError(res, error, "Internal Server Error", 500);
  }
};

export const deleteJob = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const jobId = req.params.id;
    if (!jobId) {
      sendError(res, "Error to get job id", "Please provide job is url", 400);
    }
    const recruiterId = (req as any).user.id;
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        recruiterId: recruiterId,
        isDeleted: false,
      },
    });
    if (!job) {
      sendError(
        res,
        "Not Found",
        "Job not found or you are unauthorized ",
        401
      );
      return;
    }
    const deletedJob = await prisma.job.update({
      where: { id: jobId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
    sendSuccess(res, deletedJob, "Job deleted Successfully(soft delete)", 200);
  } catch (error) {
    sendError(res, error, "Internal Server Error", 500);
  }
};

