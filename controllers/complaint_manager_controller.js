import { jwt_key } from '../configs.js'
import { BAD_REQUEST, OK } from '../constants/status_codes.js'
import CustomError from '../interfaces/custom_error_class.js'
import asyncWrapper from '../middlewares/async_wrapper.js'
import ComplaintManagerRepository from '../repositories/ComplaintManager.js'

import jwt from 'jsonwebtoken'

export const registerComplaintManager = asyncWrapper(async (req,res, next) => {
    const {username,password} = req.body
    if(!username || username?.length == 0){
        let no_username_provided = new CustomError('No username provided', BAD_REQUEST)
        return next(no_username_provided)
    }

    if(!password || password?.length == 0){
        let no_password_provided = new CustomError('No password provided', BAD_REQUEST)
        return next(no_password_provided)
    }

    let response = await ComplaintManagerRepository.registerComplaintManager({
        username: username,
        password: password,
        rules: []
    })

    return res.status(OK).json({
        success: true,
        manager: response
    })
})

export const loginComplaintManager = asyncWrapper(async (req,res,next) => {
    const {username,password} = req.body

    if(!username || username?.length == 0){
        let no_username_provided = new CustomError('No username provided', BAD_REQUEST)
        return next(no_username_provided)
    }

    if(!password || password?.length == 0){
        let no_password_provided = new CustomError('No password provided', BAD_REQUEST)
        return next(no_password_provided)
    }

    let response = await ComplaintManagerRepository.loginComplaintManager({
        username: username,
        password: password
    })

    let token = jwt.sign({
        id: response._id,
        username: username,
        role: response.role
    },jwt_key)

    return res.status(OK).json({
        manager: response,
        token: token
    })
})

export const addPermissionToComplaintManager = asyncWrapper(async (req,res) => {

})

export const removePermissionFromComplaintManager = asyncWrapper(async (req,res) => {

})