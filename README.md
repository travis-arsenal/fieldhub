# FieldHub – Hunt Arsenal Field Staff Portal

Internal portal for managing field & pro-staff communication, content, and deliverables.

**Branding**: Dark theme matching huntarsenal.com (black / teal `#108474` / white, stylized V mark).

## Features (v1)

- **Email + password auth** with roles (`admin`, `manager`, `staff`)
- **Staff Directory** (manager view)
- **Private 1:1 messaging** (text-thread style)
- **Broadcast** – sends the same message into every staff member’s private thread
- **Group Forum** – open collaboration for all staff
- **Deliverables** – assign tasks and track progress (Not Started → In Progress → Done)
- **Content uploads** – staff can upload field content (mock for now)

## Quick Start

```bash
cd fieldhub
npm install
npm run dev
```

Open http://localhost:5173

### Demo Accounts

| Role     | Email                        | Password     |
|----------|------------------------------|--------------|
| Manager  | manager@huntarsenal.com      | arsenal2026  |
| Staff    | alex.hunter@email.com        | staff123     |
| Staff    | sam.pro@email.com            | staff123     |
| Staff    | casey.field@email.com        | staff123     |

(All staff accounts use `staff123`.)

## Tech Stack

- Vite + React 19 + TypeScript
- React Router
- Tailwind CSS (custom Arsenal dark palette)
- Lucide icons
- date-fns

## Project Structure

```
src/
  components/   # Logo, Sidebar, Layout
  context/      # AuthContext (role-aware)
  data/         # Mock users, messages, forum, deliverables
  pages/        # Login, Dashboard, Staff, Messages, Forum, Deliverables, Uploads
  types/        # Shared TypeScript types
```

## Next Steps (ready for expansion)

- Wire real backend (Supabase / Next.js API + Postgres)
- Real file storage (S3 / Supabase Storage)
- Push / email notifications for new messages & assignments
- Product Development + Vendor modules (same RBAC foundation)

Built for Hunt Arsenal · Always Ready™
