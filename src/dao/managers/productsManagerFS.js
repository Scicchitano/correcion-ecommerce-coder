const fs = require('fs/promises')

class ProductsManagerFS {
    constructor(){
        this.path = 'src/jsonDb/Products.json' 
    }

    async readFile(){
        try {
            const dataProducts = await fs.readFile(this.path, 'utf-8') 
            return JSON.parse(dataProducts)
        } catch (error) {
            return []
        }
    }
// [{},{}] -> {id: 3}
    async createProduct(){
        try {
            const products = await this.readFile()
            let newProduct = {
                id: products.length ? products[products.length-1].id + 1 : 1,
                title: "",
                description: "",
                code: 0,
                price: 0,
                status: true,
                stock: 0,
                category: "",
                thumbnails: ""
            }
            products.push(newProduct)
            await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
            return newProduct
        } catch (error) {
            return `Error al crear un product ${error}`
        }
    }
    async getProducts(limit = null) {
        try {
            const products = await this.readFile();
    
            if (!products || products.length === 0) {
                return 'producto vacío';
            }
    
            // Si se proporciona un límite, devuelve solo los primeros N productos
            if (limit !== null && typeof limit === 'number') {
                let resultado = products.slice(0, limit)
                return resultado;
            }
    
            return products;
        } catch (error) {
            console.error('Error en getCart:', error);
            return 'Error al obtener productos';
        }
    }
    async getProductById(pid){
        try {
            const products = await this.readFile()
            const product = products.find(product => product.id=== pid)

            if (!product) {
                return 'No se encuentra el product'
            }
            return product
        } catch (error) {
            console.log(error)
        }
    }
    async addDataToProduct(cid,data){
        try {
            const products = await this.readFile()
            const productIdx = products.findIndex(product => product.id=== cid)

            if (products.some(p => p.code === data.code)) {
                throw new Error("El código del producto ya existe");
            }
    
            if (!data.title || !data.description || !data.price || !data.thumbnails || !data.code || !data.stock || !data.status || !data.category) {
                throw new Error("Todos los campos del producto son obligatorios");
            }

            if(productIdx === -1){
                return 'no existe el producto'
            }else{            
                for (const prop in data) {
                    if (data.hasOwnProperty(prop)) {
                        prop != "id" ? products[productIdx][prop] = data[prop] : console.log("NO SE PUEDE CAMBIAR EL ID");
                    }
                }
            }

            await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
            return products[productIdx]
        } catch (error) {
           return console.log(error)
        }
        
    }
    async deleteProduct(pid){
        try {
            const products = await this.readFile()
            const productIdx = products.findIndex(product => product.id=== pid)

            if(productIdx === -1){
                return 'no existe el producto'
            }else{   
                products.splice(productIdx, 1);
            }

            await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8')
            return products
        } catch (error) {
           return "error"
        }
        
    }
}

module.exports = ProductsManagerFS
























