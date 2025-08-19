// Email configuration and service
const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false,
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    /**
     * Send invoice email
     */
    async sendInvoice(email, invoiceHTML) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Your Pokemon Card Shop Invoice',
                html: invoiceHTML
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Invoice email sent successfully to:', email);
            return true;
        } catch (error) {
            console.error('Email sending error:', error);
            return false;
        }
    }

    /**
     * Send welcome email
     */
    async sendWelcome(email, name) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Welcome to Pokemon Card Shop!',
                html: `
                    <h1>Welcome ${name}!</h1>
                    <p>Thank you for registering at Jacob's Pokemon Card Shop.</p>
                    <p>You can now browse our collection and make purchases.</p>
                    <p>Happy shopping!</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Welcome email sent successfully to:', email);
            return true;
        } catch (error) {
            console.error('Welcome email error:', error);
            return false;
        }
    }
}

module.exports = EmailService;