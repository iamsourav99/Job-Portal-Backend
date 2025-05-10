export const parseQueryParams = (query) => {
    const { page = "1", limit = "5", sortBy = "id", order = "desc", } = query;
    return {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sortBy,
        order,
    };
};
