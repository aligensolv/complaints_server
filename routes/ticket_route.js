import { Router } from "express"
import { getAllTickets, getTicket } from "../controllers/ticket_controller.js"

const router = Router()

router.get('/tickets', getAllTickets)
router.get('/tickets/:id', getTicket)
router.delete('/tickets/:id', getTicket)

export default router