import { PropertyStatus } from "../../../generated/prisma/enums";

export interface ILandlord {
  categoryId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  status: PropertyStatus;
}
