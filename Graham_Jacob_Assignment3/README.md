# Jacob's Pokémon Card Shop

A secure e-commerce web application for selling Pokémon trading cards, built with Node.js and Express.

## Features

- **Secure Authentication**: Bcrypt password hashing, session management
- **Product Catalog**: Cards, Premium Collection Boxes, Elite Trainer Boxes
- **Shopping Cart**: Add items, calculate totals with tax and shipping
- **Invoice Generation**: Email receipts to customers
- **Security**: Rate limiting, input validation, CSRF protection, security headers

## Security Improvements

This application has been enhanced with modern security practices:

- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting for authentication routes
- ✅ Security headers with Helmet.js
- ✅ Session security configuration
- ✅ Environment variable configuration
- ✅ Error handling middleware
- ✅ Structured route organization

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration

5. Migrate existing passwords (if upgrading):
   ```bash
   node scripts/migrate-passwords.js
   ```

6. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## Environment Variables

- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment (development/production)
- `SESSION_SECRET`: Secret key for session encryption
- `EMAIL_HOST`: SMTP server host
- `EMAIL_PORT`: SMTP server port
- `EMAIL_USER`: Email username
- `EMAIL_FROM`: From email address
- `BCRYPT_ROUNDS`: Password hashing rounds (default: 12)
- `TAX_RATE`: Tax rate for calculations
- `FREE_SHIPPING_THRESHOLD`: Minimum order for free shipping
- `STANDARD_SHIPPING_RATE`: Standard shipping cost
- `PREMIUM_SHIPPING_RATE`: Premium shipping rate percentage

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── routes/
│   ├── auth.js           # Authentication routes
│   └── shop.js           # Shopping and invoice routes
├── models/
│   └── User.js           # User data management
├── utils/
│   ├── auth.js           # Authentication utilities
│   └── validation.js     # Input validation functions
├── scripts/
│   └── migrate-passwords.js # Password migration script
├── public/               # Static files (HTML, CSS, JS, images)
└── user_data.json       # User database (JSON file)
```

## API Endpoints

### Authentication
- `POST /process_login` - User login
- `POST /process_register` - User registration
- `GET /logout` - User logout

### Shopping
- `POST /process_form` - Process shopping cart
- `POST /gen_invoice` - Generate and email invoice

## Security Features

### Rate Limiting
- General: 100 requests per 15 minutes per IP
- Authentication: 5 attempts per 15 minutes per IP

### Input Validation
- Username: Letters and numbers only, 3-20 characters
- Name: Letters and spaces only, 1-30 characters
- Email: Valid email format required
- Password: Minimum 6 characters, confirmation required
- Quantities: Non-negative integers only

### Session Security
- HttpOnly cookies
- Secure cookies in production
- 24-hour session expiration
- CSRF protection ready

## Development

### Adding New Products
Update `public/products_data.js` with new product information.

### Adding New Routes
Create route files in the `routes/` directory and import them in `server.js`.

### Database Migration
Currently uses JSON file storage. For production, consider migrating to:
- MongoDB with Mongoose
- PostgreSQL with Sequelize
- MySQL with Sequelize

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a proper database instead of JSON files
3. Configure HTTPS
4. Set up proper logging
5. Use a process manager like PM2
6. Configure reverse proxy (nginx)
7. Set up monitoring and backups

## License

MIT License - see LICENSE file for details.

## Original Author

Jacob Graham (2021) - Original implementation
Enhanced with security and best practices (2025)