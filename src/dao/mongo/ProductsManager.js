// const productsModel = require('../models/products.model');
const { productsModel } = require('../models/products.model')

class ProductManager {
  #products;

  getProducts = async (limit, page, sort, query) => {
    console.log('querys : ', limit, page, sort, query)
    let formatLimit = limit ? parseInt(limit) : 10
    let formatPage = page ? parseInt(page) : 1
    
    let formatQuery 
    const categories = ['hogar', 'dormitorio', 'jardin', 'escritorios']
    if(categories.includes(query)){
      formatQuery = { category: query }
    } else if (query === 'true' || query === 'false'){
      formatQuery = { status: query }
    } else {
      formatQuery = {}
    }
    
    let formatSort 
    if(sort === 'asc'){
      formatSort = 1
    }else if(sort === 'desc'){
      formatSort = -1
    }
    
    try {
      const products = await productsModel.paginate(formatQuery, {page: formatPage, limit: formatLimit, sort: { price: formatSort }, lean: true})

      products.prevLink = products.hasPrevPage ? `?page=${products.prevPage}` : ''
      products.nextLink = products.hasNextPage ? `?page=${products.nextPage}` : ''

      if(products.totalPages > 1){
        products.totalPagesArray = []
        
        for (let i = 1; i <= products.totalPages; i++) {
          products.totalPagesArray.push(i)
        }
      } 
      
      products.payload = products.docs
      delete products.docs
      this.#products = products
      
      return this.#products
    } catch (error) {
      throw new Error(error)
    }
  }

  addProduct = async (title, description, code, price, status, stock, category, thumbnails) => {
    try {
      if(!title || !description || !code || !price || !stock || !category){
        if(!title){
          throw new Error('Title is required')
        } else if(!description){
          throw new Error('Description is required')
        } else if(!code){
          throw new Error('Code is required')
        } else if(!price){
          throw new Error('Price is required')
        } else if (!stock){
          throw new Error('Stock is required')
        } else if (!category){
          throw new Error('Category is required')
        } else {
          throw new Error('Missed required arguments')
        }
      }

      const newProduct = {
        title: title.trim(),
        description: description.trim(),
        code: code.trim(),
        price: Number(price),
        status: Boolean(status),
        stock: Number(stock),
        category: category.trim(),
        thumbnails: thumbnails || []
      }

      await productsModel.create(newProduct)

      return this.getProducts()
    } catch (error) {
      throw new Error(`Error trying to add a product: ${error}`)
    }
  }

  getProductById = async (pid) => {
    try {
      if(!pid) throw new Error('Product ID is required')
      console.log('Productttttttttttt');

      const product = await productsModel.findById(pid).lean().exec()
      console.log('Productttttttttttt2');
      return product
    } catch (error) {
      throw new Error(`Error trying to get a product by Id: ${error}`)
    }
  }
  
  updateProduct = async (pid, field, data) => {
    try {
      if(!pid || !field || !data){
        if(!pid){
          throw new Error('Product ID is required')
        } else if(!field){
          throw new Error('Field to update is required')
        } else if(!data){
          throw new Error('New data is required')
        } else {
          throw new Error('Missed required arguments')
        }
      }

      const updatedProduct = await productsModel.updateOne({ _id: pid }, { [field]: data })

      return updatedProduct
    } catch (error) {
      throw new Error(`Error trying to update product: ${error}`)
    }
  }

  deleteProduct = async (pid) => {
    try {
      if(!pid) throw new Error('Product ID required')

      await productsModel.deleteOne({ _id: pid })

      return this.getProducts()
    } catch (error) {
      throw new Error(`Error trying to delete product: ${error}`)
    }
  }	
}

const productManager = new ProductManager();

module.exports = productManager;
