import moment from "moment";

export const calculateTotalPrice = (
  pickUpDate: string,
  pickTime: string,
  pricePerHour: number = 55
) => {
  const pickUpDateTime = moment(
    `${pickUpDate}T${pickTime}`,
    "DD-MM-YYYYTHH:mm"
  );
  const drofOffDateTime = moment();

  // calculate duration in hours
  const duration = moment.duration(drofOffDateTime.diff(pickUpDateTime));
  const hours = duration.hours();
  const minutes = duration.minutes();

  // calculate total price
  let totalCost = 0;

  // calculate total cost based on minutes
  if (minutes > 0 && minutes <= 30) {
    totalCost += pricePerHour / 2;
  } else if (minutes > 30 && minutes <= 60) {
    totalCost += pricePerHour;
  }

  // add full cost for the remaining hours
  totalCost += hours * pricePerHour;

  const dropOffDate = drofOffDateTime.format("DD-MM-YYYY");
  const dropTime = drofOffDateTime.format("HH:mm");

  return {
    totalCost,
    dropOffDate,
    dropTime,
  };
};
