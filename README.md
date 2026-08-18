# ScholarPath — Full-Stack Scholarship Platform

A production-ready, AI-powered scholarship discovery and matching platform.

---

## 📁 Project Structure

```
scholarpath/
├── client/                        ← Static frontend (HTML/CSS/JS)
│   ├── index.html                 ← Homepage
│   ├── css/
│   │   └── main.css               ← Global styles + CSS variables
│   ├── js/
│   │   ├── app.js                 ← Shared utilities (Auth, API, Toast, Theme)
│   │   └── components.js          ← Navbar + footer injection
│   └── pages/
│       ├── login.html             ← Login page
│       ├── register.html          ← Registration (student & org)
│       ├── forgot-password.html   ← Password reset request
│       ├── find.html              ← Scholarship search & filter
│       ├── scholarship.html       ← Scholarship detail + apply
│       ├── matcher.html           ← AI eligibility matcher
│       ├── dashboard.html         ← Student dashboard
│       ├── org-dashboard.html     ← Organisation dashboard
│       ├── admin.html             ← Admin panel
│       ├── community.html         ← Community Q&A
│       ├── about.html             ← About page
│       ├── faq.html               ← FAQ accordion
│       └── contact.html           ← Contact form
│
├── server/                        ← Node.js + Express backend
│   ├── index.js                   ← App entry point + Socket.io
│   ├── package.json
│   ├── .env.example
│   ├── controllers/
│   │   ├── authController.js      ← Register, login, verify, reset
│   │   ├── scholarshipController.js ← CRUD + AI matching algorithm
│   │   ├── mainController.js      ← Applications, notifications, community
│   │   ├── userController.js      ← Profile, password, bookmarks, stats
│   │   └── adminController.js     ← Full platform management
│   ├── models/
│   │   ├── User.js                ← User schema + bcrypt hooks
│   │   └── index.js               ← Scholarship, Application, Notification, Question, Report
│   ├── routes/
│   │   ├── auth.js
│   │   ├── scholarships.js
│   │   ├── applications.js
│   │   ├── users.js
│   │   ├── community.js
│   │   ├── notifications.js
│   │   ├── uploads.js
│   │   ├── analytics.js
│   │   ├── admin.js
│   │   └── contact.js
│   ├── middleware/
│   │   ├── auth.js                ← JWT protect + role guard
│   │   └── errorHandler.js        ← Global error handler
│   ├── services/
│   │   ├── emailService.js        ← Nodemailer (Gmail SMTP)
│   │   └── cronService.js         ← Deadline reminder cron job
│   └── utils/
│       └── seed.js                ← Database seeder with sample data
│
├── render.yaml                    ← Render.com deployment config
├── vercel.json                    ← Vercel deployment config
├── netlify.toml                   ← Netlify deployment config (alternative)
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/scholarpath.git
cd scholarpath
npm run install:all
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
# Edit .env with your values (see below)
```

**Required environment variables:**
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret, min 32 chars |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password (not your regular password) |
| `CLIENT_URL` | Your frontend URL (e.g. https://scholarpath.vercel.app) |

### 3. Seed the Database

```bash
npm run seed
```
Creates: `admin@scholarpath.com` / `Admin@1234` and sample scholarships.

### 4. Run

```bash
npm run dev     # Development with hot reload
npm start       # Production
```

Server starts on `http://localhost:5000`

### 5. Open the Frontend

Open `client/index.html` in your browser, or serve with:
```bash
npx serve client -p 3000
```

---

## 🌐 Deployment

### Backend → Render.com

1. Push repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Set **Root Directory** to `server`
5. Build: `npm install` · Start: `node index.js`
6. Add all environment variables from `.env.example`
7. Deploy!

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your repo
3. Set **Root Directory** to `client`
4. No build step needed (static HTML)
5. Add env var: `VITE_API_BASE = https://your-render-url.onrender.com/api`
6. Deploy!

### Database → MongoDB Atlas

1. Create free M0 cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP: `0.0.0.0/0` (allow all — Render uses dynamic IPs)
4. Copy connection string to `MONGO_URI`

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login → returns JWT |
| GET | `/api/auth/verify/:token` | — | Verify email |
| POST | `/api/auth/forgot-password` | — | Send reset email |
| POST | `/api/auth/reset-password/:token` | — | Reset password |
| GET | `/api/auth/me` | ✓ | Get current user |

### Scholarships
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/scholarships` | — | List/search/filter |
| GET | `/api/scholarships/:id` | — | Get single scholarship |
| POST | `/api/scholarships/match` | ✓ | AI eligibility matching |
| GET | `/api/scholarships/org/mine` | org | Org's own scholarships |
| POST | `/api/scholarships` | org | Create scholarship |
| PUT | `/api/scholarships/:id` | org | Update scholarship |
| DELETE | `/api/scholarships/:id` | org | Delete scholarship |
| POST | `/api/scholarships/:id/bookmark` | ✓ | Toggle save/unsave |
| GET | `/api/scholarships/:id/applicants` | org | View applicants |

### Applications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/applications/:id/apply` | student | Submit application |
| GET | `/api/applications/mine` | student | My applications |
| PATCH | `/api/applications/:id/status` | org | Accept/reject |

### Community
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/community` | — | List questions |
| POST | `/api/community` | ✓ | Post question |
| POST | `/api/community/:id/answer` | ✓ | Post answer |
| POST | `/api/community/:id/upvote` | ✓ | Upvote question |

### User Profile
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/users/profile` | ✓ | Get full profile |
| PUT | `/api/users/profile` | ✓ | Update profile |
| PUT | `/api/users/password` | ✓ | Change password |
| GET | `/api/users/bookmarks` | ✓ | Saved scholarships |
| GET | `/api/users/dashboard-stats` | ✓ | Dashboard statistics |

### Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications` | ✓ | Get all notifications |
| POST | `/api/notifications/read` | ✓ | Mark all as read |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/analytics/org` | org | Organisation metrics |
| GET | `/api/analytics/admin` | admin | Platform-wide stats |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | admin | Platform overview |
| GET | `/api/admin/users` | admin | All users |
| PATCH | `/api/admin/users/:id/role` | admin | Change user role |
| DELETE | `/api/admin/users/:id` | admin | Delete user |
| GET | `/api/admin/scholarships` | admin | All scholarships |
| PATCH | `/api/admin/scholarships/:id/status` | admin | Moderate |
| GET | `/api/admin/reports` | admin | All reports |
| PATCH | `/api/admin/reports/:id` | admin | Resolve report |
| PATCH | `/api/admin/orgs/:id/verify` | admin | Verify organisation |
| GET | `/api/admin/activity` | admin | Activity log |

### Misc
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/uploads` | ✓ | Upload file (max 10MB) |
| POST | `/api/contact` | — | Contact form submission |
| GET | `/api/health` | — | Health check |

---

## 🧠 Eligibility Matching Algorithm

`POST /api/scholarships/match` scores all scholarships against a student profile:

| Criterion | Points |
|---|---|
| Level of study match | 30 |
| Field of study match | 25 |
| Country / destination match | 20 |
| Funding type match | 15 |
| GPA strength | 10 |
| **Total** | **100** |

Scores are normalised 0–97% with confidence labels (high / medium / low).
The frontend Eligibility Matcher also calls Claude AI (`claude-sonnet-4-20250514`) to generate natural-language match reasoning when the backend is unavailable.

---

## 👥 User Roles

| Role | Key Capabilities |
|---|---|
| `student` | Browse, search, save, apply, dashboard, community |
| `organization` | Post scholarships, manage applicants, analytics, messaging |
| `admin` | Full moderation: users, scholarships, orgs, reports, activity |

---

## 🔒 Security Checklist

- [x] Passwords hashed with bcrypt (12 salt rounds)
- [x] JWT tokens with configurable expiry
- [x] Rate limiting (200 requests / 15 min)
- [x] Helmet.js security headers
- [x] CORS configured to `CLIENT_URL` only in production
- [x] Multer file type + size validation
- [x] Mongoose schema validation (injection protection)
- [x] Role-based access control on all sensitive routes
- [x] Environment variables for all secrets
- [x] Cryptographic reset tokens (SHA-256 hashed, 1hr expiry)

---

## 🎨 Design System

| Token | Value |
|---|---|
| Deep Blue | `#123E63` |
| Bright Orange | `#FF8A1F` |
| Yellow Accent | `#F9C74F` |
| Teal Accent | `#3EC1C9` |
| Light Background | `#EEF7FB` |
| Font: Display | Syne (700, 800) |
| Font: Body | DM Sans (300, 400, 500) |

---

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate a new App Password for "Mail"
4. Use that 16-character password as `SMTP_PASS` (not your regular Gmail password)

---

## 🐛 Troubleshooting

**`MongooseServerSelectionError`** — Check that your `MONGO_URI` is correct and your MongoDB Atlas cluster is running. Verify the IP whitelist includes `0.0.0.0/0`.

**`JWT malformed`** — Ensure `JWT_SECRET` is set and the same across all server instances.

**Emails not sending** — Confirm your Gmail App Password is correct. Check the `SMTP_USER` matches the account the App Password was created for.

**CORS errors** — Set `CLIENT_URL` in your `.env` to exactly match your frontend URL (no trailing slash).

---

## 📄 License

MIT — ScholarPath Platform 2025
