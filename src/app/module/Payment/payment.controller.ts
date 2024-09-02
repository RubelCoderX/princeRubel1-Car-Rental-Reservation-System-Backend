import { Request, Response } from "express";
import { confirmationService } from "./payment.service";

export const paymentConfirmationController = async (
  req: Request,
  res: Response
) => {
  const { transactionId, status, bookingId } = req.query;

  const result = await confirmationService(
    transactionId as string,
    status as string,
    bookingId as string
  );
  res.send(result);
};
