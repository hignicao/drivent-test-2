import { requestError, notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes() {
  try {
    const ticketTypes = await ticketRepository.getTicketTypes();
    return ticketTypes;
  } catch (error) {
    throw requestError(400, error.message);
  }
}

async function getTicketByUserId(id: number) {
  const enrollmentExists = await ticketRepository.getEnrollmentByID(id);
  if (!enrollmentExists) {
    throw notFoundError();
  }

  const tickets = await ticketRepository.getTicketByUserID(id);
  const ticket = tickets[0].Ticket[0];
  if (!ticket) {
    throw notFoundError();
  }
  return ticket;
}

async function createTicket(id: number, ticketTypeId: number) {
  const enrollmentExists = await ticketRepository.getEnrollmentByID(id);
  if (!enrollmentExists) {
    throw notFoundError();
  }

  const ticketCreated = await ticketRepository.createTicket(id, ticketTypeId, enrollmentExists);
  return ticketCreated;
}

const ticketsService = {
  getTicketTypes,
  createTicket,
  getTicketByUserId,
};

export default ticketsService;
