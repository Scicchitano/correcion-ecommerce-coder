const { Router } = require('express');
const cartManager = require('../dao/mongo/CartsManager.js');
const ticketManager = require('../dao/mongo/TicketManager.js');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).send({ status: 'Success', payload: carts });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});

router.get('/:cid', async (req, res) => {
  if (!req.params.cid) {
    res.status(400).send({ status: 'Error', payload: 'Missed required arguments: cart id' });
  }

  try {
    const cartId = req.params.cid;
    const currentCart = await cartManager.getCartById(cartId);
    res.status(200).send({ status: 'Success', payload: currentCart });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  if (!req.params.cid || !req.params.pid || !req.body) {
    res.status(400).send({ status: 'Error', payload: 'Missed required arguments: cart id, product id or product quantity' });
  }

  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const productQuantity = req.body.quantity;

    const data = await cartManager.addProductToCart(cartId, productId, productQuantity);

    res.status(201).send({ status: 'Success', payload: data });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});

router.post('/', async (req, res) => {
  if (!req.body) {
    res.status(400).send({ status: 'Error', payload: 'Missed required arguments' });
  }

  try {
    const currentCart = await cartManager.createCart(req.body);
    res.status(201).send({ status: 'Success', payload: currentCart });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});

router.put('/:cid', async (req, res) => {
  if (!req.params.cid || !req.body) {
    res.status(400).send({ status: 'Error', payload: 'Missed required arguments: cart id or products to add' });
  }

  try {
    const cartId = req.params.cid;
    const newProducts = req.body;
    let products = [];

    products = newProducts.map((product) => {
      const newProduct = {
        product: product._id,
        price: product.price,
        quantity: product.quantity
      };

      return newProduct;
    });

    const updateCart = await cartManager.updateAllProducts(cartId, products);

    if (!updateCart) return;

    res.status(200).send({ status: 'Success', payload: updateCart });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});

router.put('/:cid/product/:pid', async (req, res) => {
  if (!req.params.cid || !req.params.pid || !req.body) {
    res.status(400).send({ status: 'Error', payload: 'Missed required arguments: cart id product id or quantity' });
  }

  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    const updateCart = await cartManager.updateQuantity(cartId, productId, quantity);

    if (!updateCart) return;

    res.status(200).send({ status: 'Success', payload: updateCart });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});

router.delete('/:cid/product/:pid', async (req, res) => {
  if (!req.params.cid || !req.params.pid) {
    res.status(400).send({ status: 'Error', payload: 'Missed required arguments: cart id or product id' });
  }

  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const data = await cartManager.deleteProductOfCart(cartId, productId);

    res.status(200).send({ status: 'Success', payload: data });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});

router.delete('/:cid', async (req, res) => {
  if (!req.params.cid) {
    res.status(400).send({ status: 'Error', payload: 'Missed required arguments: cart id' });
  }

  try {
    const cartId = req.params.cid;

    const data = await cartManager.deleteAllProductsOfCart(cartId);

    res.status(200).send({ status: 'Success', payload: data });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});



router.post('/:cid/purchase', async (req, res) => {
  console.log(req.body);
  if (!req.params.cid) {
    res.status(400).send({ status: 'Error', payload: 'Missed required arguments: cart id' });
  }

  try {
    const cartId = req.params.cid;
    const currentCart = await cartManager.getCartById(cartId);
    console.log("currentCart:");
    let totalPrice = 0;
    currentCart.products.forEach(products => {
      if(products.quantity  && products.quantity){
          console.log("Product price:", products.price);
          console.log("Product quantity:", products.quantity);
          totalPrice += products.price * products.quantity;
        }
        // Agrega más propiedades según sea necesario
      });
    console.log("Total price:", totalPrice);
    currentTicket = await ticketManager.createTicket(totalPrice,req.body.email,cartId)
    res.status(200).send({ status: 'Success', payload: currentTicket });
  } catch (error) {
    res.status(500).send({ status: 'Error', payload: `${error}` });
  }
});

module.exports = router;
