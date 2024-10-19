const mongoose = require('mongoose');

const cartsCollection = 'carts';

const cartsSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: String
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      }
    },
  ],
}, { timestamps: true });

// cartsSchema.pre('find', function (next) {
//   this.populate('products.product');
//   next();
// });

// cartsSchema.pre('findOne', function (next) {
//   this.populate('products.product');
//   next();
// });

// cartsSchema.pre('findOneAndUpdate', function (next) {
//   this.populate('products.product');
//   next();
// });

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

module.exports = cartsModel;

