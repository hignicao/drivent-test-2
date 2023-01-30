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

async function getTicketById(id: number) {
  return prisma.ticket.findFirst({
    where: { id },
  });
}

async function getTicketValue(ticketId: number) {
  return prisma.ticket.findUnique({
    where: { id: ticketId },
    select: {
      TicketType: {
        select: {
          price: true,
        },
      },
    },
  });
}

async function updateTicketStatus(ticketId: number) {
  return prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: "PAID",
    },
  })
}

const ticketRepository = {
  getTicketByUserID,
  getTicketTypes,
  createTicket,
  getEnrollmentByID,
  getTicketById,
  getTicketValue,
  updateTicketStatus,
};

export default ticketRepository;
