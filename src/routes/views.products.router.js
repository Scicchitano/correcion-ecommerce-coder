const express = require('express');
const productManager = require('../dao/mongo/ProductsManager.js');
const { userService, productService } = require("../repositories")

const router = express.Router();

const viewsProductsRouter = (io) => {

  router.get('/products', async (req, res) => {
    try {
      const { limit, page, sort, query } = req.query;

      const products = await productService.getProducts(limit, page, sort, query);

      res.render('products/products', { products });
    } catch (error) {
      res.render('errors/error', { error: error });
    }
  });

  router.get('/product/:pid', async (req, res) => {
    try {
      if (!req.params.pid) return;

      const pid = req.params.pid;
      const formatPid = pid.trim();

      if (!formatPid) return;

      const product = await productService.getProductById(formatPid);

      res.render('products/product', { product });
    } catch (error) {
      res.render('errors/error', { error: error });
    }
  });

  router.get('/realtimeproducts', async (req, res) => {
    try {
      const products = await productService.getProducts();

      io.on('connection', (socket) => {
        io.emit('products', products);

        socket.on('addProduct', async (product) => {
          if (!product) return;

          //const { title, description, code, price, status, stock, category, thumbnails } = product;

          //await productService.createProduct(title, description, code, price, status, stock, category, thumbnails);

          const updatedProducts = await productService.getProducts();

          io.emit('products', updatedProducts);
        });

        socket.on('deleteProduct', async (pid) => {
          if (!pid) return;
          const productId = pid.trim();
          if (!productId) return;

          await productService.deleteProduct(productId);

          const updatedProducts = await productService.getProducts();

          io.emit('products', updatedProducts);
        });

        socket.on('updateProduct', async (product) => {
          if (!product) return;

          const { pid, field, data } = product;

          await productService.updateProduct(pid, field, data);
          const updatedProducts = await productService.getProducts();

          io.emit('products', updatedProducts);
        });
      });
      res.render('admin/realTimeProducts');
    } catch (error) {
      res.render('errors/error', { error: error });
    }
  });

  return router;
};

module.exports = viewsProductsRouter;
