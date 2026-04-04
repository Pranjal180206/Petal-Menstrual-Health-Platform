# Petal Menstrual Health Platform

Petal is a menstrual health awareness platform built with Upay (NGO) to support young women and menstruating individuals (13+).  
It combines cycle logging, AI-assisted prediction, risk analysis, education content, quizzes, and a moderated community space in one product.

## Key Features

- Cycle tracking with next-period prediction (ML + fallback logic)
- Menstrual risk analysis with trend visuals and downloadable PDF reports
- Personalized and population-level insights
- Education hub (articles, myths vs facts, and videos)
- Quizzes for menstrual health awareness
- Moderated community forum (posts, replies, likes, reporting)
- Multi-language support: English, Hindi, Marathi
- Admin panel for NGO/content team management

## Tech Stack

### Frontend
- React 19 + Vite 7
- React Router v7
- Tailwind CSS
- Axios
- i18next + react-i18next
- Framer Motion

### Backend
- FastAPI + Uvicorn
- MongoDB Atlas (Motor async driver)
- Pydantic v2
- JWT auth (`python-jose`)
- `passlib` + bcrypt
- SlowAPI (rate limiting)
- APScheduler (background jobs)

### ML
- Python + scikit-learn
- Random Forest Regressor
- Model artifact served from `ml/menstrual_model.joblib`
- Reference dataset: [Menstrual Cycle Data (Kaggle)](https://www.kaggle.com/datasets/nikitabisht/menstrual-cycle-data)

## Repository Structure

```text
Petal-Menstrual-Health-Platform/
├── frontend/   # React web app
├── backend/    # FastAPI API server
├── ml/         # Training artifacts, notebooks, datasets, model files
└── README.md
```

## Getting Started (Local Development)

### 1) Clone the repository

```bash
git clone https://github.com/Pranjal180206/Petal-Menstrual-Health-Platform.git
cd Petal-Menstrual-Health-Platform
```

### 2) Backend setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend API docs: `http://localhost:8000/docs`

### 3) Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend app: `http://localhost:5173`

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend (`backend/.env`)

```env
MONGO_URI=
SECRET_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ALLOWED_ORIGINS=
RESET_PASSWORD_BASE_URL=http://localhost:5173
# SMTP_* variables for password reset emails
```

## Core Product Areas

- **Authentication:** email/password + Google OAuth
- **Cycle Tracker:** logging, history, settings, trends
- **Reports & Insights:** risk analysis + downloadable PDF
- **Education & Quizzes:** learning-first content model
- **Community:** moderated peer discussion
- **Admin:** content CRUD, user moderation, platform stats

## Privacy & Security Highlights

- Health data privacy by design
- Account deletion workflow with data purge + post anonymization
- Rate-limited sensitive endpoints
- Password hashing with bcrypt
- JWT-based protected routes and admin authorization checks
- Input sanitization for community content

## Admin Access

Promote a user to admin:

```bash
python backend/scripts/promote_admin.py --email your@email.com
```

The user should log out and log back in to refresh permissions.

## Notes

- The chatbot endpoint currently returns a placeholder response (under active development).
- This README is focused on project onboarding and GitHub visibility. Detailed technical references remain in `PLATFORM_OVERVIEW.txt`.
