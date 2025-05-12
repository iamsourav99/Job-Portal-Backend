import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";
import { User } from "../generated/prisma/index";
import { parseQueryParams } from "../utils/PaginationAndSortingHelper.js";

//------------------------------for Applicant user-----------------------------------------

export const applyJob = async (req: Request, res: Response): Promise<void> => {
  const jobId = req.params.id;
  const { resume } = req.body;

  try {
    const applicantId = (req as any).user.id;

    // 1. Check if job exists
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
        isDeleted: false,
      },
    });

    if (!job) {
      sendError(res, "Not Found", "Job does not exist", 404);
      return;
    }

    // 2. Check if already applied
    const isApplied = await prisma.application.findFirst({
      where: { jobId: jobId, applicantId: applicantId },
    });

    if (isApplied) {
      sendError(
        res,
        "Application Found",
        "You already applied to this job",
        400
      );
      return;
    }

    // 3. Create application
    const application = await prisma.application.create({
      data: {
        resume,
        applicantId,
        jobId,
      },
    });

    const{isDeleted,deletedAt,updatedAt,...safedata}=application;
    sendSuccess(res, safedata, "Application Received", 201);
    return;
  } catch (error) {
    sendError(res, error, "Internal Server Error", 500);
    return;
  }
};

export const getMyApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  //   const jobId = req.params.jobId;
  try {
    const { page, limit, sortBy, order } = parseQueryParams(req.query);
    const skip = (page - 1) * limit;

    const applicantId = (req as any).user.id;

    //find all applications of user
    const appliedJobs = await prisma.application.findMany({
      where: {
        applicantId: applicantId,
        isDeleted: false,
      },

      select: {
        id: true,
        resume: true,
        appliedAt: true,
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            skills: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
    });
    if (!appliedJobs) {
      sendError(res, "Not Found", "NOt applied to any job", 404);
      return;
    }
    const total = await prisma.application.count({
      where: {
        isDeleted: false,
        applicantId: applicantId,
      },
    });

    sendSuccess(
      res,
      {
        appliedJobs,
        totalvalues: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      "All Applications",
      200
    );
    return;
  } catch (error) {
    sendError(res, error, "Internal Server Error", 500);
    return;
  }
};
export const getMyApplicationbyId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const applicationId = req.params.id;
  try {
    const applicantId = (req as any).user.id;

    //fins all applications details of specified jobid
    const appliedJob = await prisma.application.findFirst({
      where: {
        applicantId: applicantId,
        id: applicationId,
        isDeleted: false,
      },
      select: {
        id: true,
        resume: true,
        appliedAt: true,
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            skills: true,
          },
        },
        applicant: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    if (!appliedJob) {
      sendError(res, "Not Found", "NOt applied to any job", 404);
      return;
    }

    sendSuccess(res, appliedJob, " Application Details", 200);
    return;
  } catch (error) {
    sendError(res, error, "Internal Server Error", 500);
    return;
  }
};

//------------------------------for Recruiter user-----------------------------------------
export const getApplicationsByJobs = async (
  req: Request,
  res: Response
): Promise<void> => {
  const jobId = req.params.jobId;
  try {
    const { page, limit, sortBy, order } = parseQueryParams(req.query);
    const skip = (page - 1) * limit;

    const recruiterId = (req as any).user.id;
    //check is the job is belong to recruiter
    const job = await prisma.job.findFirst({
      where: {
        recruiterId: recruiterId,
        id: jobId,
        isDeleted: false,
      },
    });

    if (!job) {
      sendError(
        res,
        "Unauthorized",
        "you are not authorized to view application of this job"
      );
      return;
    }
    //fins all applications details of specified jobid
    const jobApplications = await prisma.application.findMany({
      where: {
        id: jobId,
        isDeleted: false,
      },
      select: {
        id: true,
        resume: true,
        appliedAt: true,
        jobId: true,
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
    });
    if (!jobApplications) {
      sendError(res, "Not Found", "No application found to this job", 404);
      return;
    }
    const total = await prisma.application.count({
      where: {
        isDeleted: false,
        id: jobId,
      },
    });

    sendSuccess(
      res,
      {
        jobApplications,
        totalvalues: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      `Applications recived for ${jobId} `,
      200
    );
    return;
  } catch (error) {
    sendError(res, error, "Internal Server Error", 500);
    return;
  }
};
