import express from "express";
import {
  validateBody,
  validateParams,
} from "../middlewares/validationMiddileware.js";
import { applicationId, applicationSchema } from "../validation/applictionValidation.js";
import { authorize, isAuthenticated } from "../middlewares/auth.js";
import {
  applyJob,
  getApplicationsByJobs,
  getMyApplicationbyId,
  getMyApplications,
} from "../controllers/applicationController.js";
import { jobIdSchema } from "../validation/jobValidation.js";

const router = express.Router();

//API http://localhost:5500/api/application

// for Applicant
router.post(
  "/apply/:id",
  validateParams(jobIdSchema),
  validateBody(applicationSchema),
  isAuthenticated,
  authorize("APPLICANT"),
  applyJob
);

router.get(
  "/myapplications",
  isAuthenticated,
  authorize("APPLICANT"),
  getMyApplications
);

router.get("/myapplication/:id",
    validateParams(applicationId),
    isAuthenticated,
    authorize("APPLICANT"),
    getMyApplicationbyId
)

//for Recruiter
router.get("/jobapplications/:id",
    validateParams(jobIdSchema),
    isAuthenticated,
    authorize("RECRUITER"),
    getApplicationsByJobs
)

export default router;
