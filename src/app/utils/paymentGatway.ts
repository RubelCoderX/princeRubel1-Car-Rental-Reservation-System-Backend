/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import config from "../config";

export const paymentGatway = async (paymentData: any) => {
  const { transactionId, bookingId } = paymentData;
  const response = await axios.post(config.payment_url!, {
    store_id: config.store_id,
    signature_key: config.signature_key,
    tran_id: paymentData.transactionId,
    success_url: `https://car-rental-reservation-system-backend-sand.vercel.app/api/payments/confirmations?bookingId=${bookingId}&transactionId=${transactionId}&status=successs`,
    fail_url: `https://car-rental-reservation-system-backend-sand.vercel.app/api/payments/confirmations?status=failed`,
    cancel_url: "https://car-rental-reservation-client.vercel.app",
    amount: paymentData.totalCost,
    currency: paymentData.currency,
    desc: "Merchant Registration Payment",
    cus_name: paymentData.customerName,
    cus_email: paymentData.customerEmail,
    cus_add1: "House B-158 Road 22",
    cus_add2: "Mohakhali DOHS",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1206",
    cus_country: "Bangladesh",
    cus_phone: paymentData.customerPhone,
    type: "json",
  });
  return response.data;
};

export const verifyPayment = async (tnxId: string) => {
  // Add your logic here to verify the payment status
  try {
    const response = await axios.get(config.payment_verify_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: "json",
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error("Payment verification failed");
  }
};
