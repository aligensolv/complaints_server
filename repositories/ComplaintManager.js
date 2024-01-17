import moment from 'moment'
import { NOT_AUTHORIZED, NOT_FOUND } from '../constants/status_codes.js'
import CustomError from '../interfaces/custom_error_class.js'
import promiseAsyncWrapper from '../middlewares/promise_async_wrapper.js'
import ComplaintManagerModel from '../models/ComplaintsManagers.js'
import bcrypt from 'bcrypt'

class ComplaintManagerRepository{
    static registerComplaintManager({
        username,
        password,
        rules,

    }){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) => {
            let hashedPassword = await bcrypt.hash(password,10)
            let created_at = moment().format('DD.MM.YY HH:mm')

            let newComplaintManager = await ComplaintManagerModel.create({  
                username: username,
                password: hashedPassword,
                rules: rules,
                role: 'superuser',
                created_at: created_at
            })

            return resolve(newComplaintManager)
        }))
    }

    static loginComplaintManager({username,password}){
        return new Promise(promiseAsyncWrapper(async (resolve, reject) =>{
            let manager = await ComplaintManagerModel.findOne({
                username: username,
            })

            if(!manager){
                let manager_not_found_error = new CustomError('No manager was found', NOT_FOUND)
                return reject(manager_not_found_error)
            }

            let isPasswordMatched = await bcrypt.compare(password, manager.password)

            if(!isPasswordMatched){
                let password_not_matched_error = new CustomError('Password is not matched', NOT_AUTHORIZED)
                return reject(password_not_matched_error)
            }

            return resolve(manager)
        }))
    }
}


export default ComplaintManagerRepository