import { Router } from "express"
import { getAllTickets, getTicket, loginClientToTicket } from "../controllers/ticket_controller.js"

const router = Router()

router.get('/tickets', getAllTickets)
router.get('/tickets/:id', getTicket)
router.delete('/tickets/:id', getTicket)

router.post('/client/ticket-login', loginClientToTicket)

export default router