//interface to define query type explicitly
interface JobSearchQuery {
  page?: string;
  limit?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  title?: string;
  postDate?: string;
  skills?: string; // comma-separated not array
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

  // declearing object for filtering with custom types
  const filters: {
    isDeleted: boolean;
    title?: { contains: string };
    postDate?: { gte: Date; lt: Date };
    OR?: { skills: { contains: string } }[];
  } = { isDeleted: false };

  if (title) filters.title = { contains: title }; //it will generate sql (where title like %something%) for partial matching

  if (postDate) {
    const start = new Date(postDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    filters.postDate = { gte: start, lt: end };
  }

  //convert comma seperated skills into array
  if (skills) {
    const skillArray = skills.split(",").map((s) => s.trim().toLowerCase());
    filters.OR = skillArray.map((skill) => ({
      skills: {
        contains: skill,
      },
    }));
  }
  const pageNumber = Number(page)|| 1;
  const limitNumber =Number(page)|| 5;
  const skip = (pageNumber - 1) * limitNumber;
  const take = limitNumber;
  const orderBy = { [sortBy]: order };

  return { filters, skip, take, orderBy, pageNumber };
};
