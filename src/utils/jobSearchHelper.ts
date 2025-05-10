import { date } from "joi";

export interface JobSearchQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  title?: string;
  postDate?: string;
  skills?: string; // comma-separated
}

export const buildJobQuery = (query: JobSearchQuery) => {
  const {
    page,
    limit,
    sortBy = "postDate",
    order = "desc",
    title,
    postDate,
    skills,
  } = query;
  const filters: any = { isDeleted: false };
  if (title) filters.title = { contains: title };
if (postDate) {
    const start = new Date(postDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 1); 

    filters.postDate = { gte: start, lt: end };
  }
  if (skills) {
    const skillArray = skills.split(",").map((s) => s.trim().toLowerCase());
    filters.OR = skillArray.map((skill) => ({
      skills: {
        contains: skill,
      },
    }));
  }
  const pageNumber = parseInt(page as string, 10) || 1;
  const limitNumber = parseInt(limit as string, 10) || 5;
  const skip = (pageNumber - 1) * limitNumber;
  const take = limitNumber;
  const orderBy = { [sortBy]: order };

  return { filters, skip, take, orderBy, pageNumber };
};
