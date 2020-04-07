const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
	requireTitle: check('title').trim().isLength({ min: 5, max: 40 }).withMessage('Must be between 5 and 40'),
	requirePrice: check('price').trim().toFloat().isFloat({ min: 1 }).withMessage('Must be a number greater than 1'),
	requireEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			const ExistingUser = await usersRepo.getOneBy({ email });
			if (ExistingUser) {
				throw new Error('Email in use');
			}
		}),
	requirePassword: check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters'),
	requirePasswordConfirmation: check('passwordConfirmation')
		.trim()
		.isLength({ min: 4, max: 20 })
		.custom(async (passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error('Password must match ');
			}
		}),
	requireEmailExists: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Email must be valid')
		.custom(async (email) => {
			const user = await usersRepo.getOneBy({ email });
			if (!user) {
				throw new Error('email not found');
			}
		}),
	requireValidPasswordForUser: check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Password must be valid')
		.custom(async (password, { req }) => {
			const user = await usersRepo.getOneBy({ email: req.body.email });
			if (!user) {
				throw new Error('invalid password');
			}
			const validPassword = await usersRepo.comparePasswords(user.password, password);
			if (!validPassword) {
				throw new Error('invalid password');
			}
		})
};
