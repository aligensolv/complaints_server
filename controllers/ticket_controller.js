import { BAD_REQUEST, INTERNAL_SERVER, NOT_FOUND, OK } from "../constants/status_codes.js";
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

export const loginClientToTicket = asyncWrapper(async (req, res) => {
    const {plate,ticket} = req.body

    if(!plate || !ticket) return res.status(BAD_REQUEST).send('Provide Ticket and Plate')

    let searched_ticket = await TicketRepository.getTicket(ticket)
    
    if(!searched_ticket) return res.status(NOT_FOUND).send('No Ticket found')

    if(searched_ticket.plate_info.plate.replace(/ /g, '').toLowerCase() != plate.toLowerCase()) return res.status(NOT_FOUND).send('Ticket Found But Plate Number is Wrong')

    return res.sendStatus(OK)
})