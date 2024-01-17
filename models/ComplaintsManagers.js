import mongoose from 'mongoose'

const ComplaintManagerSchema = mongoose.Schema({
    username: String,

    password: String,

    role:{
        type: String,
        required: true,
        enum: ['admin', 'superuser']
    },

    rules: [{

    }],

    created_at: {
        type: String,
        required: true
    },

    updated_at: {
        type: String,
        default: null
    }
})

const ComplaintManagerModel = mongoose.model('ComplaintManager', ComplaintManagerSchema)

export default ComplaintManagerModel