const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');
const authRouter = require('./routes/admin/auth');
const productsAdminRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	//ecncrypt the cookies with this key
	cookieSession({
		keys: [ 'asdjflk123' ]
	})
);
app.use(authRouter);
app.use(productsAdminRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
	console.log('listening');
});
