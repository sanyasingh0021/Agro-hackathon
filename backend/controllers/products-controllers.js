const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Product = require('../models/product');
const User = require('../models/user');

const getProductById = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find a product.', 500));
  }

  if (!product) {
    return next(new HttpError('Could not find a product for the provided id.', 404));
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithProducts;
  try {
    userWithProducts = await User.findById(userId).populate('products');
  } catch (err) {
    return next(new HttpError('Fetching products failed, please try again later', 500));
  }

  if (!userWithProducts || userWithProducts.products.length === 0) {
    return next(new HttpError('Could not find products for the provided user id.', 404));
  }

  res.json({
    products: userWithProducts.products.map(product => product.toObject({ getters: true }))
  });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, quantity, unit, price, category } = req.body;

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError('Creating product failed, please try again', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id', 404));
  }

  const createdProduct = new Product({
    title,
    description,
    image: req.file.path,
    quantity,
    unit,
    price,
    category,
    state: user.state,
    district: user.district,
    location: user.location,
    creator: req.userData.userId
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess });
    user.products.push(createdProduct);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Creating product failed, please try again.', 500));
  }

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, quantity, price } = req.body;
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update product.', 500));
  }

  if (product.creator.toString() !== req.userData.userId) {
    return next(new HttpError('You are not allowed to edit this product.', 401));
  }

  product.title = title;
  product.description = description;
  product.quantity = quantity;
  product.price = price;

  try {
    await product.save();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update product.', 500));
  }

  res.status(200).json({ product: product.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId).populate('creator');
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete product.', 500));
  }

  if (!product) {
    return next(new HttpError('Could not find product for this id.', 404));
  }

  if (product.creator.id !== req.userData.userId) {
    return next(new HttpError('You are not allowed to delete this product.', 401));
  }

  const imagePath = product.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove({ session: sess });
    product.creator.products.pull(product);
    await product.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete product.', 500));
  }

  fs.unlink(imagePath, err => {
    if (err) {
      console.log(err);
    }
  });

  res.status(200).json({ message: 'Deleted product.' });
};

const getFilteredProducts = async (req, res, next) => {
  console.log("Getting filtered products");
  console.log(req.query);
  const { lat, lng, dist, price } = req.query;

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const maxDistance = parseFloat(dist) || 1000; // Default to 1000 km if dist is not provided
  const maxPrice = parseFloat(price) || 999; // Default to 9999 if price is not provided
  console.log({ maxDistance, maxPrice });

  if (isNaN(latitude) || isNaN(longitude)) {
    console.log("nan lat or lng");
    return next(new HttpError('Invalid location parameters.', 400));
  }
  if (isNaN(maxDistance)) {
    console.log("nan dist");
    return next(new HttpError('Invalid distance parameter.', 400));
  }
  if (isNaN(maxPrice)) {
    console.log("nan price");
    return next(new HttpError('Invalid price parameter.', 400));
  }

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    console.log("R*c", R * c);
    return R * c; // Distance in km
  };

  try {
    const products = await Product.find().exec();

    const filteredProducts = products.filter(product => {
      const productLat = product.location.lat;
      const productLng = product.location.lng;
      const distance = haversineDistance(latitude, longitude, productLat, productLng);
      const priceWithinRange = product.price <= maxPrice;
      console.log({ distance, priceWithinRange });
      return distance <= maxDistance && priceWithinRange;
    });

    res.json({
      products: filteredProducts.map(product => product.toObject({ getters: true }))
    });
  } catch (err) {
    return next(new HttpError('Fetching products failed, please try again later.', 500));
  }
};

exports.getProductById = getProductById;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getFilteredProducts = getFilteredProducts;
