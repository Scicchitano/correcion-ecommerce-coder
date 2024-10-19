const { ObjectId } = require("mongodb");
const { productService } = require("../repositories");

// Diccionario de errores
const errorMessages = {
    'PRODUCT_NOT_FOUND': 'Producto no encontrado',
    'DUPLICATE_PRODUCT': 'Producto duplicado',
    // Agrega más mensajes de error según sea necesario
};

class ProductController {
    constructor(){
        this.service = productService;
    }

    // Función para traducir errores
    translateError(error) {
        return errorMessages[error.message] || 'Error desconocido';
    }

    getProducts    = async (req, res) => {
        try {
            const products = await this.service.getProducts();
            res.send({
                status: 'success',
                payload: products
            });
        } catch (error) {
            res.status(500).send({
                status: 'error',
                message: this.translateError(error)
            });
        }
    }

    getProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const products = await this.service.getProducts();
            const idWanted = new ObjectId(pid); // Crear un ObjectId a partir del string
            let product = products.find(product => product._id.equals(idWanted)); // Comparar como ObjectId
    
            if (product) {
                res.send({
                    status: 'success',
                    payload: product
                });
            } else {
                res.status(404).send({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                status: 'error',
                message: this.translateError(error)
            });
        }
    }

    createProduct  = async (req, res) => {
        try {
            const { body } = req;
            const result = await this.service.createProduct(body);
            res.send({
                status: 'success',
                payload: result
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: this.translateError(error)
            });
        }
    }

    updateProduct  = async (req, res) => {
        try {
            const { pid } = req.params;
            const { body } = req;

            const result = await this.service.updateProduct(pid, body);
            res.send({
                status: 'success',
                payload: result
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: this.translateError(error)
            });
        }
    }

    deleteProduct  = async (req, res) => {
        try {
            console.log('req.session.email: ' + req.session.email);
            const { pid } = req.params;
            const result = await this.service.deleteProduct(pid);
            res.send({
                status: 'success',
                payload: result
            });
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: this.translateError(error)
            });
        }
    }   
}

module.exports = ProductController;
