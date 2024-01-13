import { OK } from "../constants/status_codes.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import TicketRepository from "../repositories/Ticket.js";

export const getAllTickets = asyncWrapper(async (req, res) => {
    let tickets = await TicketRepository.getAllTickets()
    return res.status(OK).json(tickets)
})

export const getTicket = asyncWrapper(async (req, res) => {
    const {id} = req.params
    let ticket = await TicketRepository.getTicket(id)
    return res.status(OK).json(ticket)
})

export const deleteTicket = asyncWrapper(async (req, res) => {
    const {id} = req.params
    let response = await TicketRepository.deleteTicket(id)
    return res.status(OK).json(response)
})