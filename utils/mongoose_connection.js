import { connect } from 'mongoose';
import { mongodb_connection_string } from '../configs.js';


import '../models/place.js'
import '../models/user.js'


export default new Promise(async (resolve, reject) => {
    try{
        await connect(mongodb_connection_string).then(() => console.log('connected to database'))
        return resolve(true) 
    }catch(e){
        return reject (new Error('Connection Error: ' + e.message))
    }
})