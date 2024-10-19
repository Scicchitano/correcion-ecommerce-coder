const { userModel } = require("../models/users.model") // representa persistencia bd

class UserDaoMongo { // Dao
    constructor(){
        this.modelMongoose = userModel
    }

    get = () => { // consultar usuario
        return this.modelMongoose.find({})
    }
    
    getBy = (filter) => { // leer un usuario
        return this.modelMongoose.findOne(filter)
    }
    create = (newUser) => { // crear usuario
        return this.modelMongoose.create(newUser)
    } 
    update = (uid, userToUpdate) => { // actualizar usuario
        return this.modelMongoose.findByIdAndUpdate({_id: uid}, userToUpdate, {new: true})
    } 
    delete = (uid) => {
        return this.modelMongoose.findByIdAndDelete({_id: uid})
    } 
}

module.exports = UserDaoMongo

// objeto.crearUsuario
// objeto.createuser