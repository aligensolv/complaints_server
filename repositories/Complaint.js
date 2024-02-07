import moment from "moment";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import ComplaintModel from "../models/complaint.js"
import parseFileType from "../utils/parse_file.type.js";
import sendAlertMail from "../utils/smtp_service.js";
import CustomError from "../interfaces/custom_error_class.js";
import { NOT_AUTHORIZED } from "../constants/status_codes.js";

class ComplaintRepository{
    static createComplaint(data){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let existing_complaint_was_found = await ComplaintModel.findOne({
                ticket_number: data.ticketNumber
            })

            console.log(existing_complaint_was_found);
            console.log(data.ticketNumber);

            if(existing_complaint_was_found){
                let existing_complaint_error = new CustomError('There is already a Complaint for the specified ticket', NOT_AUTHORIZED)
                return reject(existing_complaint_error)
            }

            const parsed_data = {
                first_name: data.firstName,
                last_name: data.lastName,
                address: data.address,
                postal_code: data.postalCode,
                city: data.cityTown,
                country: data.country,
                phone_number: data.phoneNumber,
                email: data.email,
                complaint_text: data.complaintText,
                ticket_number: data.ticketNumber,
                created_at: moment().format('DD.MM.YY HH:mm'),
                attachments: data.attachments.map(attachment => {
                    return {
                        file_type: parseFileType(attachment.filetype),
                        file_path: attachment.filepath,
                        file_name: attachment.filename
                    }
                }),
                ticket: data.ticket
            }
            let complaint = await ComplaintModel.create(parsed_data)
            
            sendAlertMail({
                subject: `Complaint recieved`,
                text: `Complaint recieved with number ${data.ticketNumber} and pending`,
                html: `<h3>Complaint recieved with number ${data.ticketNumber} and pending</h3>`,
                to: data.email
            })
            return resolve(true);
        }))
    }

    static getAllComplaints(){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let complaints = await ComplaintModel.find().populate([
                {
                    path: 'ticket.publisher_identifier',
                    ref: 'User'
                },
                {
                    path: 'ticket.place',
                    ref: 'Place'
                }
            ])

            return resolve(complaints)
        }))
    }

    static getComplaint(id){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let complaint = await ComplaintModel.findOne({
                _id: id
            }).populate([
                {
                    path: 'ticket.publisher_identifier',
                    ref: 'User'
                },
                {
                    path: 'ticket.place',
                    ref: 'Place'
                }
            ])

            return resolve(complaint)
        }))
    }

    static perfomActionOnComplaint(id,message,status){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let complaint = await ComplaintModel.findOne({
                _id: id
            })

            complaint.status = status
            sendAlertMail({
                to: complaint.email,
                text: message,
                html: `<p>${message}</p>`,
                subject: `Svar på saken ${complaint.ticket_number}`
            })

            await complaint.save()

            return resolve(true)
        }))
    }

    static deleteComplaint(id){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let result = await ComplaintModel.deleteOne({
                _id: id
            })

            return resolve(result.deletedCount == 1)
        }))
    }

    static getComplaintsCount(){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let count = await ComplaintModel.countDocuments()
            return resolve(count)
        }))
    }
}

export default ComplaintRepository