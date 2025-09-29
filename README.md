
# Professional Accounting Website with Contact Form & Email Integration

A sophisticated, fully-functional accounting services website with integrated booking system and email contact form.

## ✨ Features

### 📧 **Contact Form with Email**
- Beautiful, validated contact form
- Automatic email notifications via Gmail API
- Auto-reply confirmation to users
- Professional HTML email templates
- Error handling and success messages
- Real-time form validation

### 📅 **Booking System**
- Interactive calendar with availability
- Time slot selection
- Automatic Google Calendar sync
- Email confirmations for bookings
- Booking history tracking

### 🎨 **Premium Design**
- Elegant brown/burgundy color scheme
- Fully responsive on all devices
- Smooth animations and transitions
- Professional typography
- Accessible UI components

## 🚀 Setup Instructions

### 1. Google Cloud Console Setup

#### Enable Gmail API:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable **Gmail API** and **Google Calendar API**
4. Go to "Credentials" → "Create Credentials" → "Service Account"
5. Download the JSON key file

#### Configure Service Account:
1. Open Gmail → Settings → "See all settings"
2. Go to "Accounts and Import"
3. Add the service account email with "Send mail as" permission
4. Verify the email address

### 2. Environment Variables

Update `.env.local` with your credentials:

```bash
# Your Google Calendar ID
GOOGLE_CALENDAR_ID=your-email@gmail.com

# Your service account credentials (minified JSON)
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"..."}

# Where contact form emails will be sent
RECIPIENT_EMAIL=your-email@gmail.com

# Optional: Business info for auto-reply
BUSINESS_PHONE=+1 (555) 123-4567
BUSINESS_ADDRESS=123 Main Street, Suite 100, City, ST 12345
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard:
# Settings → Environment Variables → Add each variable
```

### 4. Test the Forms

#### Contact Form Test:
1. Fill out the contact form
2. Submit the form
3. Check your email inbox for the submission
4. User should receive auto-reply confirmation

#### Booking Form Test:
1. Select a date from the calendar
2. Choose a time slot
3. Fill out booking details
4. Submit the form
5. Check Google Calendar for new event
6. Both parties receive email confirmations

## 📁 Project Structure

```
├── api/
│   ├── booking.ts          # Booking & calendar sync
│   └── contact.ts          # Contact form email handler
├── src/
│   ├── components/
│   │   ├── BookingCalendar/
│   │   │   ├── BookingCalendar.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   ├── TimeSlotPicker.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── Contact/
│   │   │   ├── Contact.tsx
│   │   │   └── Contact.css
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Services/
│   │   └── NavigationTabs/
│   ├── App.tsx
│   └── index.tsx
├── .env.local
├── vercel.json
└── package.json
```

## 🎯 Key Features

### Contact Form
- ✅ Real-time validation
- ✅ Loading states
- ✅ Success/error messages
- ✅ Professional email templates
- ✅ Auto-reply to users
- ✅ Mobile-responsive
- ✅ Accessible (WCAG compliant)

### Email Templates
- Beautiful HTML emails with branding
- Plain text fallback for compatibility
- Proper MIME multipart formatting
- Responsive email design
- Professional formatting

### Security
- Input validation on client and server
- Email format verification
- Rate limiting ready
- CORS configured
- Environment variables for secrets

## 🔧 Customization

### Update Business Information
Edit the placeholder text in:
- `src/components/Hero/Hero.tsx`
- `src/components/About/About.tsx`
- `src/components/Services/Services.tsx`
- `src/components/Contact/Contact.tsx`

### Modify Email Templates
Edit email HTML/text in:
- `api/contact.ts` → `createEmailMessage()`
- `api/contact.ts` → `createAutoReplyMessage()`

### Change Colors
Update CSS variables in:
- `src/App.css`
- Individual component CSS files

### Add More Services
Update service lists in:
- `src/components/Services/Services.tsx`
- `src/components/BookingCalendar/BookingForm.tsx`
- `src/components/Contact/Contact.tsx`

## 📧 Email Flow

### Contact Form Submission:
1. User fills out contact form
2. Client-side validation
3. POST to `/api/contact`
4. Email sent to business owner
5. Auto-reply sent to user
6. Success message shown

### Booking Submission:
1. User selects date/time
2. Fills booking form
3. POST to `/api/booking`
4. Event added to Google Calendar
5. Confirmation emails sent
6. Booking confirmation modal shown

## 🎨 Design System

### Colors
- **Primary**: `#722f37` (Burgundy)
- **Secondary**: `#d4a574` (Gold)
- **Background**: `#faf8f5` (Cream)
- **Text**: `#2c1810` (Dark Brown)

### Typography
- **Headings**: Playfair Display
- **Body**: Lato
- **Accents**: Libre Baskerville

### Components
- Smooth animations
- Hover effects
- Loading states
- Error handling
- Success feedback

## 🌐 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📱 Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## 🔐 Security Notes
- Never commit `.env.local` to git
- Keep Google credentials secure
- Use environment variables in production
- Implement rate limiting for production
- Add reCAPTCHA for spam prevention

## 🆘 Troubleshooting

### Emails Not Sending
1. Verify Gmail API is enabled
2. Check service account permissions
3. Confirm credentials are correct
4. Test service account email access
5. Check Vercel function logs

### Calendar Not Syncing
1. Verify Calendar API is enabled
2. Check calendar ID is correct
3. Confirm service account has calendar access
4. Check environment variables

### Form Validation Errors
1. Check required fields
2. Verify email format
3. Ensure all data is provided
4. Check browser console for errors

## 📝 License
MIT License - feel free to use for commercial projects

## 🤝 Support
For issues or questions, please open a GitHub issue or contact support.

---

Built with ❤️ using React, TypeScript, and modern web technologies
