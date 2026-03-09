# Petal-Menstrual-Health-Platform

Welcome to the Petal Menstrual Health Platform repository! This document serves as a guide for the team to understand the project structure and where to place different types of code.

## 🗂️ Project Structure

The repository is organized into distinct logical components to keep our code clean, scalable, and easy to collaborate on for the entire team.

```text
Petal-Menstrual-Health-Platform/
├── backend/          # Backend API (FastAPI/Python) services & routes
├── frontend/         # Frontend Web Application (React/Next.js/Vue, etc.)
├── ml/               # Machine Learning experiments, training scripts, and Jupyter notebooks
└── README.md         # Project documentation (You are here)
```

### 🖥️ Frontend (Where to put frontend stuff)
The `frontend/` directory is dedicated exclusively to the user interface. 
- **What goes here:** All React/Vue/Next.js code, UI components, state management, CSS/Tailwind styles, and assets (images, icons).
- **Rule of thumb:** If it runs in the user's browser, it belongs in this folder.

### ⚙️ Backend
The `backend/` directory contains our server, database connections, and business logic.
- **`backend/routes/`**: API endpoints (e.g., `/api/users`, `/api/health`).
- **`backend/models/`**: Database schemas and Pydantic models.
- **`backend/services/`**: Core business logic and helper functions.
- **`backend/database.py`**: Database connection setup.

### 🤖 Machine Learning (Where to put ML codes)
Machine Learning code should be split based on its purpose (Training vs. Serving):

1. **Training & Exploration (`/ml/`)**: 
   - Feel free to create an `ml/` folder at the root of the project.
   - **What goes here:** Jupyter notebooks (`.ipynb`), model training scripts, dataset processing, data exploration, and saved model weights (`.pkl`, `.h5`, `.joblib`).
   
2. **Model Serving/Inference (`/backend/services/ml_service.py`)**:
   - When an ML model is ready to be used in the app, the code to *load* and *run predictions* on the model should go into the `backend/` (e.g., inside `backend/services/` or a dedicated `backend/ml/` folder).
   - **Why?** Because the backend needs to serve the ML model's predictions via API endpoints to the frontend.

## 🚀 Getting Started
*(Add instructions here later on how to run the backend, frontend, and install dependencies)*