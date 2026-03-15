# Petal Frontend

This directory contains the frontend web application for the Petal Menstrual Health Platform. It is built using **React**, **Vite**, **Tailwind CSS**, and **React Router**.

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 18+ recommended)
- `npm` (comes with Node.js)

## Getting Started

1. **Install Dependencies**
   Navigate into this `frontend` directory and install the required npm packages:
   ```bash
   cd frontend
   npm install
   ```

2. **Run the Development Server**
   Start the local development server to view the app in your browser:
   ```bash
   npm run dev
   ```
   The app will typically run at `http://localhost:5173`.

## Project Structure & Editing Pages

- `src/pages/`: Contains the main page components (e.g., `Education.jsx`, `CommunityHub.jsx`, `Login.jsx`). If you want to create a new page or edit an existing one's main content, look here.
- `src/components/`: Contains reusable structural components (e.g., `Navbar.jsx`, `Footer.jsx`, `Sidebar.jsx`, `PetalIcon.jsx`). Edit these to change elements that appear exactly the same across multiple pages.
- `src/index.css`: Contains global Tailwind styles and custom design tokens (like the brand colors).

**To edit a page:**
1. Open the corresponding file in `src/pages/` (for example, `Education.jsx`).
2. Make your React/Tailwind changes.
3. Save the file. The browser will automatically hot-reload with your changes if `npm run dev` is running.

## Connecting to the Backend API

To fetch data from the FastAPI backend (located in the `../backend` directory), follow these conventions:

1. **Environment Variables:**
   Create a `.env` file in the root of the `frontend/` directory and define your backend API URL. For local development:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```
   
2. **Making Requests:**
   Use the `fetch` API or a library like `axios` to make requests to the backend. Example of fetching data in a React component:
   ```javascript
   import { useEffect, useState } from 'react';

   function ExampleComponent() {
     const [data, setData] = useState(null);

     useEffect(() => {
       const fetchData = async () => {
         // Use the environment variable for dynamic URLs
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/endpoint`);
         const result = await response.json();
         setData(result);
       };
       fetchData();
     }, []);

     return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
   }
   ```
   
3. **CORS Configuration:**
   Ensure the FastAPI backend is configured to allow Cross-Origin Resource Sharing (CORS) from `http://localhost:5173`, otherwise your browser will block the requests.
