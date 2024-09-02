"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.paymentGatway = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const paymentGatway = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, bookingId } = paymentData;
    const response = yield axios_1.default.post(config_1.default.payment_url, {
        store_id: config_1.default.store_id,
        signature_key: config_1.default.signature_key,
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
});
exports.paymentGatway = paymentGatway;
const verifyPayment = (tnxId) => __awaiter(void 0, void 0, void 0, function* () {
    // Add your logic here to verify the payment status
    try {
        const response = yield axios_1.default.get(config_1.default.payment_verify_url, {
            params: {
                store_id: config_1.default.store_id,
                signature_key: config_1.default.signature_key,
                type: "json",
                request_id: tnxId,
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error("Payment verification failed");
    }
});
exports.verifyPayment = verifyPayment;
