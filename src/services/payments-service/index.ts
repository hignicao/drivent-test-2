import { notFoundError, requestError, unauthorizedError } from '@/errors';
import { PaymentInfoBody } from '@/protocols';
import paymentRepository from '@/repositories/payment-repository';
import ticketRepository from '@/repositories/ticket-repository';

async function getUserPayment(userId: number, ticketId: number) {
  const ticket = await ticketRepository.getTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }

  const ticketIsFromUser = await paymentRepository.ticketIsFromUser(ticketId, userId);
  if (!ticketIsFromUser) {
    throw unauthorizedError();
  }

  const paymentInfo = await paymentRepository.getPaymentInfo(ticketId);
  return paymentInfo;
}

async function createPayment(userId: number, paymentInfo: PaymentInfoBody) {
  const ticket = await ticketRepository.getTicketById(paymentInfo.ticketId);
  if (!ticket) {
    throw notFoundError();
  }

  if (paymentInfo.cardData === null) {
    throw requestError(400, 'Card data missing');
  }

  if (!paymentInfo.ticketId) {
    throw requestError(400, 'Card data missing');
  }

  const ticketIsFromUser = await paymentRepository.ticketIsFromUser(paymentInfo.ticketId, userId);
  if (!ticketIsFromUser) {
    throw unauthorizedError();
  }

  const value = await ticketRepository.getTicketValue(paymentInfo.ticketId);
  const payment = await paymentRepository.createPayment(paymentInfo, value.TicketType.price);
  await ticketRepository.updateTicketStatus(paymentInfo.ticketId);
  return payment;
}

const paymentsService = {
  getUserPayment,
  createPayment,
};

export default paymentsService;
