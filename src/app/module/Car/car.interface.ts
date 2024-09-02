export type TCar = {
  name: string;
  description: string;
  color: string;
  isElectric: boolean;
  features: string[];
  isDelete: boolean;
  pricePerHour: number;
  status: "available" | "unavailable";
  carImgUrl: string[];
  vehicleSpecification: string[];
  maxSeats: number;
  rating: number;
  gearType: string;
  fuelType: string;
  carType: string;
};
export interface TSearchCriteria {
  carType: string;
  seats: number;
  features: string;
}
