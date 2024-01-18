import { static_files_host } from "../configs.js";
import { BAD_REQUEST, OK } from "../constants/status_codes.js";
import CustomError from "../interfaces/custom_error_class.js";
import asyncWrapper from "../middlewares/async_wrapper.js";
import ComplaintRepository from "../repositories/Complaint.js";


export const createComplaint = asyncWrapper(async (req,res) => {
    console.log(req.body.attachments);

    let attachments = JSON.parse(req.body.attachments)
    for(let i = 0; i < req.files.length; i++) {
        attachments[i].filepath = static_files_host + req.files[i].path;
    }

    let ticket = JSON.parse(req.body.ticket)

    let data = {
        ...req.body,
        attachments: attachments,
        ticket: ticket
    }

    let response = await ComplaintRepository.createComplaint(data)
    return res.status(OK).json(response)
})

export const getAllComplaints = asyncWrapper(async (req,res) => {
    let complaints = await ComplaintRepository.getAllComplaints()
    return res.status(OK).json(complaints)
})

export const getComplaint = asyncWrapper(async (req,res) => {
    const {id} = req.params

    let complaint = await ComplaintRepository.getComplaint(id)
    return res.status(OK).json(complaint)
})

export const perfomActionOnComplaint = asyncWrapper(async (req,res) => {
    const {id} = req.params
    const {message,status} = req.body

    console.log(req.body);

    if(!message || message?.length == 0) {
        return new CustomError('message is required | message is not empty',BAD_REQUEST)
    }

    if(!status || status?.length == 0) {
        return new CustomError('status is required | status is not empty',BAD_REQUEST)
    }

    let complaint = await ComplaintRepository.perfomActionOnComplaint(id,message,status)
    return res.status(OK).json(complaint)
})

export const deleteComplaint = asyncWrapper(async (req,res) => {
    const {id} = req.params

    let result = await ComplaintRepository.deleteComplaint(id)
    return res.status(OK).json(result)
})

export const getComplaintsCount = asyncWrapper(async (req,res) => {
    let result = await ComplaintRepository.getComplaintsCount()
    return res.status(OK).json(result)
})