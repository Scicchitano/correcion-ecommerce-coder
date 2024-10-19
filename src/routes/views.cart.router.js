const express = require('express');
const cartManager = require('../dao/mongo/CartsManager.js');

const router = express.Router();

router.get('/:cid', async (req, res) => {
  if (!req.params.cid) return;

  try {
    const cartId = req.params.cid;

    const currentCart = await cartManager.getCartById(cartId);

    res.render('products/cart', { data: currentCart });
  } catch (error) {
    res.render('errors/error', { error: error });
  }
});

module.exports = router;
