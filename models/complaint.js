import mongoose from "mongoose"

const complaintSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },

    last_name:{
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },

    postal_code: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    phone_number: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    complaint_text:{
        type: String,
        required: true
    },

    created_at:{
        type: String,
        required: true
    },

    status:{
        type: String,
        enum: ['pending', 'completed', 'rejected', 'deleted'],
        default: 'pending'
    },

    attachments: [{
        file_type: {
            type: String,
            enum: ['pdf','image'],
            required: true
        },

        file_path: {
            type: String,
            required: true
        },

        file_name: {
            type: String,
            required: true
        }

    }]
})

const ComplaintModel = mongoose.model('Complaint', complaintSchema)

export default ComplaintModel