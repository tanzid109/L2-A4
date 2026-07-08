import { PropertyStatus } from "../../../generated/prisma/enums";

export interface IQuery {
  city?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  status?: PropertyStatus;
}
