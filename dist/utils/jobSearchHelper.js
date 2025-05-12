export const buildJobQuery = (query) => {
    const { page, limit, sortBy = "postDate", order = "desc", title, postDate, skills, } = query;
    const filters = { isDeleted: false }; //objects for filtering
    if (title)
        filters.title = { contains: title };
    if (postDate) {
        const start = new Date(postDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
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
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 5;
    const skip = (pageNumber - 1) * limitNumber;
    const take = limitNumber;
    const orderBy = { [sortBy]: order };
    return { filters, skip, take, orderBy, pageNumber };
};
