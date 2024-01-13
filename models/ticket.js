import * as mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
    publisher_identifier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    paper_comment:{
        type: String,
        default: ''
    },

    out_comment:{
        type: String,
        default: ''
    },

    images:{
        type: [{
            path: {
                type: String,
                required: true
            },

            date: {
                type: String,
                required: true
            }
        }],
        default: []
    },

    place:{
        type: String,
        ref: 'Place',
        required: true
    },

    print_paper:{
        type: String,
        default: null
    },

    locked:{
        type: Boolean,
        default: false
    },

    rules:[{
        name:{
            type: String,
            required: true
        },
    
        charge:{
            type: Number,
            required: true
        },
    
        policy_time:{
            type: Number,
            required: true
        },
    }],

    status:{
        type: String,
        required: true,
        enum: ['saved','completed']
    },

    plate_info: {
        brand:{
            type: String,
            default: null
        },

        plate:{
            type: String,
            default: null
        },

        year:{
            type: String,
            default: null
        },

        description:{
            type: String,
            default: null
        },

        type:{
            type: String,
            default: null
        },

        color: {
            type: String,
            default: null
        },

        land: {
            code: String,
            country: String,
        }
    },

    is_car_registered: {
        type: Boolean,
        required: true
    },
    
    registered_car_info:{
        type: mongoose.Schema.Types.Map,
        default: null
    },

    created_at:{
        type: String,
        required: true,
    },

    completed_at: {
        type: String,
        default: null
    },

    ticket_number: {
        type: String,
        default: null
    },

    print_option: {
        type: String,
        default: null
    },

    payment_date: {
        type: String,
        default: null
    }
})

const TicketModel = mongoose.model('Violation', TicketSchema)

export default TicketModel