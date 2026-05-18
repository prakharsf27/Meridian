# Meridian Performance Portal

A **role-based goal management system** for employee performance planning, quarterly reviews, and audit-ready tracking.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Charts | Recharts |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + role-based middleware |

## Project Structure

```
hackathon/
├── frontend/       # React SPA
└── backend/        # Express API
```

## Roles

| Role | Access |
|---|---|
| **Employee** | Create goals, submit, view progress, quarterly check-ins |
| **Manager** | Review/approve team goals, add comments, view team progress |
| **Admin/HR** | Manage cycles, unlock goals, view audit logs, run reports |

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI + JWT_SECRET
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (Render / Railway)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random secret for signing JWTs |
| `PORT` | Port to run the server on (default: 5000) |
| `FRONTEND_URL` | Vercel frontend URL (for CORS) |
| `NODE_ENV` | `production` |

### Frontend (Vercel)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (e.g. `https://your-app.onrender.com/api`) |

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Employee | rahul.sharma@meridian.co | demo1234 |
| Manager | priya.mehta@meridian.co | demo1234 |
| Admin/HR | kavitha.rao@meridian.co | demo1234 |

## Key Features

- ✅ UoM score formulas (Min / Max / Timeline / Zero — BRD compliant)
- ✅ Shared goals pushed by Admin (read-only for recipients)
- ✅ Conversational validation messages
- ✅ Role-based escalation cron (3 business rules)
- ✅ Analytics: QoQ trends, thrust area pie, manager effectiveness, heatmap
- ✅ In-app notification center
- ✅ One-click demo role-switcher
- ✅ CSV / XLSX export
- ✅ Forensic audit log with diff view
