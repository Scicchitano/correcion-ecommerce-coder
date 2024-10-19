
class ProductRepository {
    constructor(productDao){
        this.dao = productDao
    }

    getProducts    = async () => await this.dao.get()
    getProduct     = async (filter) => await this.dao.get(filter)
    createProduct  = async (newProduct) => await this.dao.create(newProduct)
    updateProduct  = async (pid, productToUpdate) => await this.dao.create(pid, productToUpdate)
    deleteProduct  = async (pid) => {
        console.log("Eliminando id: " + pid)
        try {
            await this.dao.delete(pid);
            console.log("Producto eliminado exitosamente.");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
        
    }
}

module.exports = ProductRepository