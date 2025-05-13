import express from "express";
import { jobIdSchema, jobSchema } from "../validation/jobValidation.js";
import { authorize, isAuthenticated } from "../middlewares/auth.js";
import {
  deleteJob,
  getJobs,
  getJobsByIdRecruiter,
  getJobsByRecruiter,
  postJob,
  updateJob,
} from "../controllers/jobController.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middlewares/validationMiddileware.js";
import { jobFilterSchema } from "../validation/jobFilterSchema.js";
import { jobFilterSearchController } from "../controllers/jobFilterSerchController.js";

const router = express.Router();

//API-->   http://localhost:5500/api/job

//*********FOR RECRUITER ONLY*************** */
router.post(
  "/post",
  validateBody(jobSchema),
  isAuthenticated,
  authorize("RECRUITER"),
  postJob
);
router.put(
  "/update/:id",
  validateParams(jobIdSchema),
  validateBody(jobSchema),
  isAuthenticated,
  authorize("RECRUITER"),
  updateJob
);

router.put(
  "/delete/:id",
  validateParams(jobIdSchema),
  isAuthenticated,
  authorize("RECRUITER"),
  deleteJob
);

router.get(
  "/postedByRecruiter",
  validateQuery(jobFilterSchema),
  isAuthenticated,
  authorize("RECRUITER"),
  getJobsByRecruiter
);
router.get(
  "/postedByRecruiter/:id",
  validateParams(jobIdSchema),
  isAuthenticated,
  authorize("RECRUITER"),
  getJobsByIdRecruiter
);

//-------------For Applicant or anyone without Authentication-------------------

router.get("/", validateQuery(jobFilterSchema), getJobs);

router.get(
  "/filter-search",
  validateQuery(jobFilterSchema),
  jobFilterSearchController
);

export default router;
