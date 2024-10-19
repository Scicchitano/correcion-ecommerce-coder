const UserMongoManager = require("../dao/Mongo/usersDao.mongo")
const { userService } = require("../repositories")
const { createHash } = require('../utils/hashBcrypt')


class UserController {
    constructor(){
        this.service = userService 
    }

    getUsers = async (req, res)=>{  
        try {
            const users = await this.service.getUsers()
            console.log(users)
            res.send(users)
        } catch (error) {
            res.send({status: 'error', message: error})
            
        }    
    }
    
    getUser = async (req, res)=>{
        const { uid } = req.params
        const user = await this.service.getUser({_id: uid})
    
        // console.log(req.params)
    
        res.send(user)
    }
    
    createUser = async (req, res)=>{
        const {first_name, last_name, email, password } = req.body
       
        const newUser = {
            first_name,
            last_name,
            email,
            password
        }
        console.log(newUser)
    
        const result = await this.service.createUser(newUser)
    
        res.status(200).send({
            status: 'success',
            usersCreate: result
        })
    }
    
    updateUser =  async (req, res)=>{
        const {uid} = req.params
        const userToUpdate = req.body
    
        const result = await this.service.updateUser(uid, userToUpdate)
    
        res.status(200).send({
            status: 'success',
            message: result
        })
    }
    
    deleteUser =  async (req, res)=>{
        const { uid } = req.params
        const result = await this.service.deleteUser( uid)
        res.send(result)
    }

    changeRole = async (req, res)=>{
        const { uid } = req.params
        const user = await this.service.getUser({_id: uid})
        if (user.role == 'user') {
            user.role = 'premium'
        }else if (user.role == 'premium') {
            user.role = 'user'
        }
        const result = await this.service.updateUser(uid, user)
        res.status(200).send({
            status: 'success',
            message: result
        })
    }

    resetPassword = async (req, res)=>{
        const { email,newPass } = req.body
        console.log("email: " + email + " new pass: " + newPass)
        const user = await this.service.getUser({email: email})
        console.log("user: " + user)
        user.password = createHash(newPass)
        const result = await this.service.updateUser(user._id, user)
        res.status(200).send({
            status: 'success',
            message: result
        })
    }

}

module.exports = UserController