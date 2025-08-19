const express = require('express');
const { body, validationResult } = require('express-validator');
const queryString = require('query-string');
const { isNonNegInt } = require('../utils/validation');
const { requireAuth } = require('../utils/auth');
const User = require('../models/User');
const EmailService = require('../config/email');

const router = express.Router();
const userModel = new User();
const emailService = new EmailService();
const data = require('../config/products.js');
const productsList = data.productsList;
const processFormValidation = [
    body('quantity_textbox*').custom((value, { req }) => {
        const quantities = Object.keys(req.body).filter(key => key.startsWith('quantity_textbox'));
        for (const key of quantities) {
            const qty = req.body[key];
            if (qty && !isNonNegInt(qty)) {
                throw new Error('All quantities must be non-negative integers');
            }
        }
        return true;
    })
];

router.post('/process_form', processFormValidation, (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const stringified = queryString.stringify(req.body);
            return res.redirect('./index.html?' + stringified);
        }

        let hasAmount = false;
        let legitAmount = true;

        // Validate quantities
        for (const productType in productsList) {
            for (let i = 0; i < productsList[productType].length; i++) {
                const qty = parseInt(req.body[`quantity_textbox_${productType}_${i}`] || 0);
                if (qty > 0) {
                    hasAmount = true;
                }
                if (!isNonNegInt(qty)) {
                    legitAmount = false;
                }
            }
        }

        const stringified = queryString.stringify(req.body);

        if (legitAmount && hasAmount) {
            res.redirect('./login.html?' + stringified);
        } else {
            res.redirect('./index.html?' + stringified);
        }
    } catch (error) {
        console.error('Process form error:', error);
        const stringified = queryString.stringify(req.body);
        res.redirect('./index.html?' + stringified);
    }
});

router.post('/gen_invoice', requireAuth, async (req, res) => {
    try {
        const cart = JSON.parse(req.query['cartData'] || '{}');
        const user = userModel.getUser(req.cookies.username);
        
        if (!user) {
            return res.redirect('./login.html?error=Please log in to continue');
        }

        let subtotal = 0;
        let invoiceItems = '';

        // Calculate totals
        for (const productType in productsList) {
            for (let i = 0; i < productsList[productType].length; i++) {
                const quantities = parseInt(cart[`${productType}${i}`] || 0);
                if (quantities > 0) {
                    const product = productsList[productType][i];
                    const extendedPrice = quantities * product.price;
                    subtotal += extendedPrice;
                    
                    invoiceItems += `
                        <tr>
                            <td width="43%">${product.brand}</td>
                            <td align="center" width="11%">${quantities}</td>
                            <td width="13%">$${product.price.toFixed(2)}</td>
                            <td width="54%">$${extendedPrice.toFixed(2)}</td>
                        </tr>
                    `;
                }
            }
        }

        const taxRate = parseFloat(process.env.TAX_RATE) || 0.04712;
        const taxAmount = taxRate * subtotal;
        
        let shipping = 0;
        const freeShippingThreshold = parseFloat(process.env.FREE_SHIPPING_THRESHOLD) || 50;
        const standardShippingRate = parseFloat(process.env.STANDARD_SHIPPING_RATE) || 5;
        const premiumShippingRate = parseFloat(process.env.PREMIUM_SHIPPING_RATE) || 0.05;

        if (subtotal <= freeShippingThreshold) {
            shipping = 0;
        } else if (subtotal <= 100) {
            shipping = standardShippingRate;
        } else {
            shipping = premiumShippingRate * subtotal;
        }

        const total = subtotal + taxAmount + shipping;

        const invoiceHTML = `
            <link href="./style/style_products.css" rel="stylesheet">
            <h1>Purchase confirmed!</h1>
            <br><b>Thank you for shopping at Jacob's Pokémon Card Shop!</b></br>
            <br><b>An email has been sent to ${user.email}.</b></br>
            <br><b><a href="/logout">Clear cookies and sessions (Logout)</a></b></br>

            <table id="invoice" border="2">
                <tbody>
                    <tr>
                        <th style="text-align: center;" width="43%">Item</th>
                        <th style="text-align: center;" width="11%">Quantity</th>
                        <th style="text-align: center;" width="13%">Price</th>
                        <th style="text-align: center;" width="54%">Extended Price</th>
                    </tr>
                    ${invoiceItems}
                    <tr>
                        <td colspan="4" width="100%">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;" colspan="3" width="67%">Subtotal</td>
                        <td width="54%">$${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;" colspan="3" width="67%">Tax @ ${(taxRate*100).toFixed(3)}%</td>
                        <td width="54%">$${taxAmount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;" colspan="3" width="67%">Shipping</td>
                        <td width="54%">$${shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
                        <td width="54%"><strong>$${total.toFixed(2)}</strong></td>
                    </tr>
                </tbody>
            </table>
        `;

        await emailService.sendInvoice(user.email, invoiceHTML);
        
        res.send(invoiceHTML);
    } catch (error) {
        console.error('Invoice generation error:', error);
        res.status(500).send('An error occurred while generating your invoice. Please try again.');
    }
});

module.exports = router;