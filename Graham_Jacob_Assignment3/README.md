# Jacob's Pokémon Card Shop

A secure, production-ready e-commerce web application for selling Pokémon trading cards, built with Node.js and Express.

## Features

- **Secure Authentication**: Bcrypt password hashing, session management, rate limiting
- **Product Catalog**: Cards, Premium Collection Boxes, Elite Trainer Boxes
- **Shopping Cart**: Add items, calculate totals with tax and shipping
- **Email System**: Invoice receipts, welcome emails, automated notifications
- **Enterprise Security**: Input validation, CSRF protection, security headers
- **Modular Architecture**: Clean separation of concerns, maintainable codebase
- **Developer Tools**: Automated backups, migration scripts, development utilities

## Recent Optimizations (2025)

### Architecture Improvements
- **Modular Configuration**: Centralized config management in `/config` directory
- **Service Layer**: Dedicated email and database services
- **Middleware Organization**: Structured authentication middleware
- **Clean File Structure**: Optimized project organization

### Security Enhancements
- **Password Security**: Bcrypt hashing with configurable rounds
- **Input Validation**: Comprehensive sanitization and validation
- **Rate Limiting**: Tiered protection (general + auth-specific)
- **Security Headers**: Helmet.js with CSP configuration
- **Session Management**: Secure, HttpOnly cookies with expiration
- **Environment Config**: Secure credential management

### Developer Experience
- **Automated Scripts**: Migration, backup, and maintenance tools
- **Code Quality**: Removed redundant code and comments
- **Documentation**: Comprehensive setup and deployment guides
- **Error Handling**: Robust error management throughout

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd pokemon-card-shop
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Initialize database** (if upgrading from old version):
   ```bash
   npm run migrate
   ```

4. **Start the application**:
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   ```

5. **Access the application**:
   - Open http://localhost:8080
   - Default test users available (see user_data.json)

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 8080 | No |
| `NODE_ENV` | Environment mode | development | No |
| `SESSION_SECRET` | Session encryption key | - | Yes |
| `EMAIL_HOST` | SMTP server host | - | Yes |
| `EMAIL_PORT` | SMTP server port | 25 | No |
| `EMAIL_FROM` | From email address | - | Yes |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 | No |
| `TAX_RATE` | Tax rate (decimal) | 0.04712 | No |
| `FREE_SHIPPING_THRESHOLD` | Free shipping minimum | 50 | No |
| `STANDARD_SHIPPING_RATE` | Standard shipping cost | 5 | No |
| `PREMIUM_SHIPPING_RATE` | Premium shipping rate | 0.05 | No |

### Example .env
```bash
PORT=8080
NODE_ENV=development
SESSION_SECRET=your-super-secret-key-here
EMAIL_HOST=mail.hawaii.edu
EMAIL_PORT=25
EMAIL_FROM=your-email@hawaii.edu
BCRYPT_ROUNDS=12
TAX_RATE=0.04712
```

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── config/
│   ├── database.js       # Database configuration
│   ├── email.js          # Email service
│   └── products.js       # Product catalog data
├── routes/
│   ├── auth.js           # Authentication routes
│   └── shop.js           # Shopping and invoice routes
├── models/
│   └── User.js           # User data management
├── middleware/
│   └── auth.js           # Authentication middleware
├── utils/
│   ├── auth.js           # Authentication utilities
│   └── validation.js     # Input validation functions
├── scripts/
│   ├── migrate-passwords.js # Password migration script
│   └── backup-data.js    # Data backup script
├── public/               # Static files (HTML, CSS, JS, images)
└── user_data.json       # User database (JSON file)
```

## API Endpoints

### Authentication Routes
| Method | Endpoint | Description | Rate Limited |
|--------|----------|-------------|--------------|
| `POST` | `/process_login` | User authentication | Yes (5/15min) |
| `POST` | `/process_register` | User registration | Yes (5/15min) |
| `GET` | `/logout` | User logout | No |

### Shopping Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/process_form` | Process shopping cart | No |
| `POST` | `/gen_invoice` | Generate invoice & email | Yes |

### Static Routes
- `GET /` - Homepage
- `GET /login.html` - Login page
- `GET /register.html` - Registration page
- `GET /cards.html` - Individual cards catalog
- `GET /coll_boxes.html` - Collection boxes catalog
- `GET /etbs.html` - Elite trainer boxes catalog

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

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm run migrate    # Migrate passwords to hashed format
npm run backup     # Create data backup
```

### Adding New Features

#### **New Products**
1. Edit `config/products.js`
2. Add product images to `public/images/`
3. Update product pages in `public/`

#### **New Routes**
1. Create route file in `routes/`
2. Import and use in `server.js`
3. Add rate limiting if needed

#### **New Email Templates**
1. Add methods to `config/email.js`
2. Use EmailService in routes

### Code Organization
```
config/     # Configuration & services
├── database.js    # Data operations
├── email.js       # Email templates
└── products.js    # Product catalog

middleware/ # Custom middleware
└── auth.js        # Authentication

models/     # Data models
└── User.js        # User management

routes/     # Route handlers
├── auth.js        # Login/register
└── shop.js        # Shopping/checkout

utils/      # Utilities
├── auth.js        # Auth helpers
└── validation.js  # Input validation
```

## Production Deployment

### Pre-deployment Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure secure `SESSION_SECRET`
- [ ] Set up HTTPS certificates
- [ ] Configure production database
- [ ] Set up email service (SMTP)
- [ ] Configure reverse proxy
- [ ] Set up monitoring and logging

### Deployment Steps

1. **Environment Setup**:
   ```bash
   export NODE_ENV=production
   # Configure production .env
   ```

2. **Database Migration**:
   ```bash
   # Backup current data
   npm run backup
   
   # For production, migrate to proper DB
   # MongoDB, PostgreSQL, or MySQL
   ```

3. **Process Management**:
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start with PM2
   pm2 start server.js --name pokemon-shop
   pm2 startup
   pm2 save
   ```

4. **Reverse Proxy (nginx)**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. **SSL/HTTPS**:
   ```bash
   # Using Let's Encrypt
   certbot --nginx -d yourdomain.com
   ```

### Monitoring & Maintenance
- **Logs**: `pm2 logs pokemon-shop`
- **Status**: `pm2 status`
- **Restart**: `pm2 restart pokemon-shop`
- **Backups**: Schedule `npm run backup` via cron

## Testing

### Manual Testing
1. **Registration**: Create new user account
2. **Login**: Authenticate with credentials  
3. **Shopping**: Add items to cart
4. **Checkout**: Complete purchase flow
5. **Email**: Verify invoice delivery

### Test Users (Development)
```json
{
  "dport": { "password": "portspassword" },
  "kazman": { "password": "kazmanpassword" },
  "itm352": { "password": "grader" },
  "jacobrg": { "password": "admintest" }
}
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details.

## Author
- **Jacob Graham** 
 - Original implementation (2021)
 - Security hardening, architecture optimization, production readiness (2025)