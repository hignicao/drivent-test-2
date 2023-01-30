import { prisma } from '@/config';
import { PaymentInfoBody } from '@/protocols';


async function ticketIsFromUser(ticketId: number, userId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
      Enrollment: {
        userId,
      },
    },
  })
}

async function getPaymentInfo(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
    select: {
      id: true,
      ticketId: true,
      value: true,
      cardIssuer: true,
      cardLastDigits: true,
      createdAt: true,
      updatedAt: true,
    }
  })
}

async function createPayment(paymentInfo: PaymentInfoBody, value: number) {
  const { issuer, number } = paymentInfo.cardData;
  const { ticketId } = paymentInfo;
  const lastDigits = number.toString().slice(-4);
  return prisma.payment.create({
    data: {
      ticketId,
      value,
      cardIssuer: issuer,
      cardLastDigits: lastDigits,
    },
    select: {
      id: true,
      ticketId: true,
      value: true,
      cardIssuer: true,
      cardLastDigits: true,
      createdAt: true,
      updatedAt: true,
    }
  })
}


const paymentRepository = {
  ticketIsFromUser,
  getPaymentInfo,
  createPayment,
};

export default paymentRepository;
