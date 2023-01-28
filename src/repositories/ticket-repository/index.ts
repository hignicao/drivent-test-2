import { prisma } from '@/config';
import { Enrollment, Ticket, TicketStatus, TicketType } from '@prisma/client';

async function getTicketTypes() {
  return prisma.ticketType.findMany();
}

async function getTicketByUserID(id: number) {
  return prisma.enrollment.findMany({
    where: { userId: id },
    select: {
      Ticket:  {
        include: {
          TicketType: true,
        },
      },
    },
  });
}

async function createTicket(id: number, ticketTypeId: number, enrollmentExists: Enrollment) {
  return prisma.ticket.create({
    data: {
      status: TicketStatus.RESERVED,
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentExists.id,
    },
    include: {
      TicketType: true,
    },
  });
}

async function getEnrollmentByID(id: number) {
  return prisma.enrollment.findUnique({
    where: { userId: id },
  });
}

const ticketRepository = {
  getTicketByUserID,
  getTicketTypes,
  createTicket,
  getEnrollmentByID,
};

export default ticketRepository;
