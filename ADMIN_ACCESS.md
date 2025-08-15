# Admin Dashboard Access Guide

## 🔐 How to Access Admin Dashboard

The admin dashboard is completely private and separate from the public website. Only the business owner (Arijit Panda) can access it.

### Access Methods:

1. **Direct URL**: Navigate to `admin-dashboard.html` in your browser
2. **From Login Page**: Click the small "🔐 Admin Access" link at the bottom of the login page

### Login Credentials:

- **Username**: `arijit_panda`
- **Password**: `admin123`

### What You Can Do in Admin Dashboard:

✅ **View Dashboard Statistics**
- Total contacts
- Total users  
- Recent contacts (7 days)
- New messages

✅ **Manage Customer Contacts**
- View all contact form submissions
- Search and filter contacts
- Update contact status (New → Read → Replied → Closed)
- Add notes to contacts
- Delete contacts

✅ **Contact Management Features**
- Search by name, email, or subject
- Filter by status
- Pagination for large contact lists
- Detailed contact view with modal
- Status updates and notes

### Security Features:

- JWT token authentication
- Owner role verification
- Secure API endpoints
- No public navigation access
- Automatic logout on token expiry

### Important Notes:

- The admin dashboard is NOT linked in the public navigation menu
- Only users with 'owner' role can access admin functions
- All admin actions are logged and secured
- The dashboard works with your Railway backend deployment

### Troubleshooting:

If you can't access the admin dashboard:
1. Make sure you're using the correct credentials
2. Check that your Railway backend is running
3. Clear browser cache and try again
4. Contact your developer if issues persist

---

**Keep your admin credentials secure and don't share them publicly!**
