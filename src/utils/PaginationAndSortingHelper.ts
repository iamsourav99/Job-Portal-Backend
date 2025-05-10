
export interface QueryParams {
  page: number;
  limit: number;
  sortBy: string;
  order: string;
}

export const parseQueryParams = (query: any): QueryParams => {
  const {
    page = "1",
    limit = "5",
    sortBy="id" ,
    order = "desc",
  } = query as {
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: string;
  };

  return {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sortBy,
    order,
  };
};
