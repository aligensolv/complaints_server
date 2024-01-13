import { NOT_FOUND } from "../constants/status_codes.js";
import CustomError from "../interfaces/custom_error_class.js";
import promiseAsyncWrapepr from "../middlewares/promise_async_wrapper.js";
import Violation from "../models/Violation.js";
import moment from "moment";
import RuleRepository from "./Rule.js";
import ViolationHelperRepository from "./ViolationHelper.js";
import UserRepository from "./User.js";
import PlaceRepository from "./Place.js";
import { account_number, iban_numner, kid_number, static_files_host, swift_code } from "../config.js";

class ViolationRepository{
    static getAllViolations(){
        return new Promise(promiseAsyncWrapepr(
            async(resolve, reject) =>{
                let violations = await Violation.find().populate([
                    {
                        path: 'publisher_identifier',
                        ref: 'User'
                    },

                    {
                        path: 'rules',
                        ref: 'Rule'
                    },

                    {
                        path: 'place',
                        ref: 'Place'
                    }
                ]).sort({
                    created_at: 'desc'
                })
                return resolve(violations)
            }
        ))
    }

    static getViolationsCount(){
        return new Promise(promiseAsyncWrapepr(
            async(resolve, reject) =>{
                let count = await Violation.countDocuments()
                return resolve(count.toString())
            }
        ))
    }


    // static updateViolation(id, data){
    //     return new Promise(promiseAsyncWrapepr(
    //         async(resolve, reject) =>{
    //             let result = await Violation.updateOne({_id: id}, data)

    //             return resolve(result.modifiedCount)
    //         }
    //     ))
    // }

    static getAllPlaceViolations(id,date){
        return new Promise(promiseAsyncWrapepr(
            async(resolve, reject) =>{
                let violations = await Violation.find({place: id}).populate([
                    {
                        path: 'publisher_identifier',
                        ref: 'User'
                    },

                    {
                        path: 'rules',
                        ref: 'Rule'
                    },

                    {
                        path: 'place',
                        ref: 'Place'
                    }
                ]).sort({
                    created_at: 'desc'
                })
                violations = violations.filter(e => {
                    return !moment(e.completed_at).isBefore(
                        moment(date)
                    )
                })
                
                console.log(violations);
                return resolve(violations)
            }
        ))
    }

    static getViolation(id){
        return new Promise(promiseAsyncWrapepr(
            async(resolve, reject) =>{
                let violation = await Violation.findOne({ _id: id }).populate([
                    {
                        path : 'publisher_identifier',
                        ref: 'User'
                    },

                    {
                        path : 'place',
                        ref: 'Place'
                    }
                ])
                if(!violation){
                    let not_found_error = new CustomError('Violation not found',NOT_FOUND)
                    return reject(not_found_error)
                }

                return resolve(violation)
            }
        ))
    }

    static createViolation(data){
        return new Promise(promiseAsyncWrapepr(
            async(resolve, reject) =>{
                let completed_at = moment().format('DD.MM.YY HH:mm')

                let ticketNumber = ViolationHelperRepository.generateTicketNumber()
                let publisher_identifier = data.publisher_identifier
                let user = await UserRepository.getUser(publisher_identifier)
                let place = await PlaceRepository.getPlace(data.place)

                let total = 0;
                for(let i = 0; i < data.rules.length; i++){
                    total += +data.rules[i].charge
                }

                console.log(total);

                let ticketImage = await ViolationHelperRepository.generateTicketImage(ticketNumber,{
                    ticket_number: ticketNumber,
                    rules: data.rules,
                    paper_comment: data.paper_comment,
                    from_date: data.created_at,
                    to_date: completed_at,
                    print_option: data.print_option,
                    user_identifier: user.user_identifier,
                    car_info:{
                        land: data.plate_info.land,
                        plate_number: data.plate_info.plate,
                        type: data.plate_info.type,
                        brand: data.plate_info.brand,
                        color: data.plate_info.color
                    },
                    location: place.location,
                    ticket_info:{
                        total_charge: total,
                        paid_to: 'Sjekk Kontroll',
                        account_number: account_number,
                        kid_number: kid_number,
                        swift_code: swift_code,
                        iban_number: iban_numner,
                        payment_date: completed_at,
                    }
                })

                console.log(data.images);

                let newViolation = await Violation.create({
                    ...data,
                    created_at: data.created_at,
                    completed_at: completed_at,
                    ticket_number: ticketNumber,
                    print_paper: ticketImage,
                    print_option: data.print_option
                })

                return resolve(true)
            }
        ))
    }

    static deleteViolation(id){
        return new Promise(promiseAsyncWrapepr(
            async(resolve, reject) =>{
                let violationExists = await Violation.findById(id)
                if(!violationExists){
                    let not_found_error = new CustomError('violation not found', NOT_FOUND)
                    return reject(not_found_error)
                }

                await Violation.deleteOne({ _id: id })

                return resolve(true)
            }
        ))
    }

    static deleteAllViolations(){
        return new Promise(promiseAsyncWrapepr(
            async(resolve, reject) =>{
                await Violation.deleteMany({})
                return resolve(true)
            }
        ))
    }

    static addImage(id,image){
        return new Promise(promiseAsyncWrapepr(
            async(resolve, reject) =>{
                let violation = await Violation.findOne({ _id: id })
                violation.images.push(image)
                await violation.save()
                return resolve(image)
            }
        ))
    }
}

export default ViolationRepository