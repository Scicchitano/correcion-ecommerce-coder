const cartsModel = require('../models/carts.model.js');
const productManager = require('../mongo/ProductsManager.js');

class CartManager {
  #carts;

  createCart = async (data) => {
    if (!data) throw new Error('Missed required arguments');

    try {
      const newCart = {
        products: [{
          product: data.productId,
          price: data.price,
          quantity: data.quantity
        }]
      };

      const currentCart = await cartsModel.create(newCart);
      console.log(currentCart);
      return currentCart;
    } catch (error) {
      throw new Error(`Error trying to create a cart: ${error}`);
    }
  };

  getCarts = async () => {
    try {
      const data = await cartsModel.find().lean().exec();

      this.#carts = data;

      return this.#carts;
    } catch (error) {
      throw new Error(error);
    }
  };

  getCartById = async (cartId) => {
    if (!cartId) throw new Error('Cart ID is required');

    try {
      const currentCart = await cartsModel.findById(cartId).lean().exec();

      if (!currentCart) {
        throw new Error(`Cart with ID ${cartId} not found`);
      }

      return currentCart;
    } catch (error) {
      throw new Error(`Error trying to get cart by ID: ${error}`);
    }
  };

  addProductToCart = async (cartId, productId, productQuantity) => {
    if (!cartId || !productId) throw new Error('Missing required arguments: cart ID or product ID');

    try {
      const cart = await cartsModel.findById(cartId);
      const indexProduct = cart.products.findIndex((item) => item.product == productId);

      if (indexProduct < 0) {
        const product = await productManager.getProductById(productId);

        let quantity = false;
        if (productQuantity) {
          quantity = parseInt(productQuantity);
        }
        const newProduct = {
          product: productId,
          price: product.price,
          quantity: quantity || 1
        };

        cart.products.push(newProduct);

        await cart.save();

        return cart;
      } else {
        let quantity = false;
        if (productQuantity) {
          quantity = parseInt(productQuantity);
        }

        cart.products[indexProduct].quantity += quantity || 1;

        await cart.save();

        return cart;
      }
    } catch (error) {
      throw new Error(`Error trying to add a new product to cart: ${error}`);
    }
  };

  deleteProductOfCart = async (cartId, productId) => {
    if (!cartId || !productId) throw new Error('Missing required arguments: cart ID or product ID');

    try {
      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productId } } },
        { new: true }
      );

      if (updatedCart) {
        return updatedCart;
      } else {
        throw new Error('Product not found in the cart.');
      }
    } catch (error) {
      throw new Error(`Error trying to delete a product of cart: ${error}`);
    }
  };

  deleteAllProductsOfCart = async (cartId) => {
    if (!cartId) throw new Error('Cart ID is required');

    try {
      const updatedCart = await cartsModel.findByIdAndUpdate(cartId, { products: [] }, { new: true }).lean().exec();

      if (!updatedCart) {
        throw new Error(`Cart with ID: ${cartId} not found`);
      }

      return updatedCart;
    } catch (error) {
      throw new Error(`Error trying to delete all products from the cart: ${error}`);
    }
  };

  updateAllProducts = async (cartId, products) => {
    if (!cartId || !products) throw new Error('Missing required arguments: cart ID or products');

    try {
      await this.deleteAllProductsOfCart(cartId);

      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cartId },
        { $set: { products: products } },
        { new: true }
      );

      return updatedCart;
    } catch (error) {
      throw new Error(`Error trying to update all products from the cart: ${error}`);
    }
  };

  updateQuantity = async (cartId, productId, updatedQuantity) => {
    if (!cartId || !productId || !updatedQuantity) throw new Error('Missing required arguments: cart ID, product ID, or new quantity');

    try {
      const updatedCart = await cartsModel.findOneAndUpdate(
        {
          _id: cartId,
          'products.product': productId 
        },
        {
          $set: { 'products.$.quantity': updatedQuantity }
        },
        { new: true }
      );

      return updatedCart;
    } catch (error) {
      throw new Error(`Error trying to update product quantity: ${error}`);
    }
  };
}

const cartManager = new CartManager();

module.exports = cartManager;
