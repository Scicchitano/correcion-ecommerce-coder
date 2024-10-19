const { productsModel } = require("../models/products.model")

class ProductDaoMongo {
    constructor(){
        this.model = productsModel
    }

    // get = async () => await this.model.find({isActive: true})    
    get = async () => await this.model.find()    

    // getBy = async (filter) => await this.model.findOne({})
    getBy = async (filter) => await this.model.findOne(filter)

    create = async (newProduct) => await this.model.create(newProduct) // save

    update = async (pid, productToUpdate) => await this.model.findByIdAndUpdate({_id: pid}, productToUpdate, {new: true})

    delete = async (pid) => await this.model.findByIdAndDelete({_id: pid}, {isActive: false}, {new: true})

}

module.exports = ProductDaoMongo