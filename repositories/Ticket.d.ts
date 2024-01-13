import { ObjectId } from "mongoose"

declare interface CarImage{
    path: string,
    date: string
}

declare interface Rule{
    name:string,
    charge:number,
    policy_time:number
}

declare interface PlateInfo{
    brand: string | null,
    plate:string | null,
    year:string | null,
    description:string | null,
    type:string | null,
    color: string | null,
    land: string | null,
}

declare interface Ticket {
    publisher_identifier:ObjectId,
    paper_comment:string,
    out_comment:string,
    images: Array<CarImage>,
    place:string,
    print_paper:string | null,
    locked:boolean,
    rules: Array<Rule>,
    status: 'saved' | 'completed',
    plate_info: PlateInfo,
    is_car_registered: boolean,
    registered_car_info:Map,
    created_at:string,
    completed_at: string | null,
    ticket_number: string | null,
    print_option: string | null,
    payment_date: string | null,
}


declare class TicketRepository{
    /**
     * Returns list of all Tickets
     * @type {Array<Ticket>}
     */
    
    static getAllTickets(): Promise<Array<Ticket>>
    /**
     * Returns Ticket
     * @type {Ticket}
     */
    static getTicket(id: string): Promise<Ticket>

    static deleteTicket(id: string): Promise<void>
}

export default TicketRepository