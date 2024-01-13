import moment from "moment";
import promiseAsyncWrapper from "../middlewares/promise_async_wrapper.js"
import ComplaintModel from "../models/complaint.js"
import parseFileType from "../utils/parse_file.type.js";
import sendAlertMail from "../utils/smtp_service.js";
/*
    [Object: null prototype] {
  firstName: 'Ali',
  lastName: 'Tarek',
  address: 'N/A',
  postalCode: '5310002',
  cityTown: 'Alexandria',
  country: 'BG',
  phoneNumber: '01150421159',
  email: 'alitarek99944@gmail.com',
  complainText: 'fdfda',
  attachments: '[object Object]'
}

filename: 'Lab2.pdf',
      filetype: 'application/pdf',
      fieldname: 'attachments[0]',
      filepath: 'http://localhost:4000/public\\files\\complaints\\Lab2.pdf'
*/

class ComplaintRepository{
    static createComplaint(data){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            const parsed_data = {
                first_name: data.firstName,
                last_name: data.lastName,
                address: data.address,
                postal_code: data.postalCode,
                city: data.cityTown,
                country: data.country,
                phone_number: data.phoneNumber,
                email: data.email,
                complaint_text: data.complainText,
                created_at: moment().format('DD.MM.YY HH:mm'),
                attachments: data.attachments.map(attachment => {
                    return {
                        file_type: parseFileType(attachment.filetype),
                        file_path: attachment.filepath,
                        file_name: attachment.filename
                    }
                })
            }
            let complaint = await ComplaintModel.create(parsed_data)
            console.log(complaint);
            return resolve(true);
        }))
    }

    static getAllComplaints(){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let complaints = await ComplaintModel.find()

            return resolve(complaints)
        }))
    }

    static getComplaint(id){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let complaint = await ComplaintModel.findOne({
                _id: id
            })

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
                message: message
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