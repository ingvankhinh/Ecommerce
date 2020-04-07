const repository = require('./repository');

class CartRepository extends repository {}

module.exports = new CartRepository('cart.json');
