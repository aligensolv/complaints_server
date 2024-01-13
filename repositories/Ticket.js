import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js";
import TicketModel from "../models/ticket.js";

class TicketRepository{

    static getAllTickets(){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let tickets = await TicketModel.find()
            return resolve(tickets)
        }))
    }

    static getTicket(id){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let ticket = await TicketModel.findOne({
                ticket_number: id
            }).populate([
                {
                    path: 'place',
                    ref: 'Place'
                },

                {
                    path: 'publisher_identifier',
                    ref: 'User'
                }
            ])
            return resolve(ticket)
        }))
    }

    static deleteTickets(id){
        return new Promise(promiseAsyncWrapper(async (resolve,reject) =>{
            await TicketModel.deleteOne({_id: id})

            return resolve(true)
        }))
    }
}

export default TicketRepository