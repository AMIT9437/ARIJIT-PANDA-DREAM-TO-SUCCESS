# ARIJIT PANDA - Dream to Success

A professional business services website with full backend functionality including user authentication, contact management, and admin dashboard.

## 🚀 Features

### Frontend
- **Responsive Design**: Modern, mobile-friendly interface
- **Professional Services**: GST, MCA Compliance, ITR Filing, Business Consulting
- **User Authentication**: Login/Registration system
- **Contact Forms**: Customer inquiry management
- **Admin Dashboard**: Full business management interface

### Backend
- **Node.js + Express**: Robust server framework
- **SQLite Database**: Lightweight, file-based database
- **JWT Authentication**: Secure user sessions
- **Role-Based Access**: Owner and Member roles
- **Contact Management**: Full CRUD operations
- **API Endpoints**: RESTful API design

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone/Download the project**
   ```bash
   # Navigate to your project directory
   cd arijit-panda-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   - Copy `config.env` to `.env` (or rename it)
   - Update the JWT_SECRET for production use

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:3000/api`

## 📁 Project Structure

```
arijit-panda-website/
├── config/
│   └── database.js          # Database configuration
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── contact.js          # Contact form routes
│   └── admin.js            # Admin-only routes
├── js/
│   └── api.js              # Frontend API integration
├── data/                   # Database files (auto-created)
├── images/                 # Website images
├── server.js               # Main server file
├── package.json            # Dependencies
├── config.env              # Environment variables
├── README.md               # This file
└── HTML files...          # All website pages
```

## 🔐 Default Admin Account

When you first run the application, a default owner account is automatically created:

- **Username**: `arijit_panda`
- **Password**: `admin123`
- **Role**: `owner`

⚠️ **Important**: Change this password immediately in production!

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Contact Management
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact/stats` - Get contact statistics

### Admin (Owner Only)
- `GET /api/admin/contacts` - Get all contacts
- `GET /api/admin/contacts/:id` - Get single contact
- `PUT /api/admin/contacts/:id/status` - Update contact status
- `POST /api/admin/contacts/:id/note` - Add note to contact
- `DELETE /api/admin/contacts/:id` - Delete contact
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users

## 👥 User Roles

### Owner
- Full access to all features
- Manage contacts and users
- View business statistics
- Access admin dashboard

### Member
- Basic user features
- View own profile
- Change password
- Limited access

## 🎯 Usage Guide

### For Business Owners
1. **Login** with default credentials
2. **Access Admin Dashboard** at `/admin-dashboard.html`
3. **Manage Contacts** - view, update status, add notes
4. **Monitor Business** - view statistics and trends
5. **User Management** - oversee registered users

### For Customers
1. **Browse Services** - explore business offerings
2. **Contact Business** - submit inquiries via contact form
3. **Register Account** - create member account (optional)
4. **Access Dashboard** - view personal information

### For Developers
1. **API Integration** - use RESTful endpoints
2. **Customization** - modify routes and functionality
3. **Database** - extend with additional tables
4. **Deployment** - deploy to Render, Heroku, etc.

## 🚀 Deployment

### Render (Recommended)
1. **Create Web Service** (not Static Site)
2. **Connect GitHub** repository
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**: Add from `.env` file

### Other Platforms
- **Heroku**: Add `Procfile` with `web: npm start`
- **Vercel**: Configure as Node.js project
- **Railway**: Direct deployment from GitHub

## 🔧 Configuration

### Environment Variables
```env
PORT=3000                           # Server port
NODE_ENV=production                # Environment mode
JWT_SECRET=your-secret-key        # JWT signing secret
FRONTEND_URL=https://yoursite.com # CORS origin
```

### Database
- **SQLite**: File-based, no setup required
- **Location**: `./data/database.sqlite`
- **Backup**: Copy the database file regularly

## 🛡️ Security Features

- **JWT Authentication**: Secure session management
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Express-validator middleware
- **Rate Limiting**: Prevent abuse
- **CORS Protection**: Controlled cross-origin access
- **Helmet**: Security headers

## 📱 Responsive Design

- **Mobile First**: Optimized for all devices
- **CSS Grid/Flexbox**: Modern layout system
- **Font Awesome**: Professional icons
- **Custom CSS**: Tailored styling

## 🔄 Updates & Maintenance

### Regular Tasks
- **Database Backup**: Weekly database file backup
- **Log Monitoring**: Check server logs for errors
- **Security Updates**: Update npm packages regularly
- **Performance**: Monitor API response times

### Adding Features
1. **Create Route** in appropriate file
2. **Add Database** table if needed
3. **Update Frontend** with new functionality
4. **Test Thoroughly** before deployment

## 📞 Support

For technical support or questions:
- **Email**: info@dreamtosuccess.com
- **Business**: Arijit Panda - Dream to Success

## 📄 License

This project is proprietary software for ARIJIT PANDA - Dream to Success business use.

---

**Built with ❤️ for business success and growth**
