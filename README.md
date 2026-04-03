### Frontend
- **React.js** (Vite)
- **React Router DOM** for navigation
- **Axios** for API requests
- **Material UI (@mui/material)** for styling (No Tailwind CSS)

## 🌟 Features

- **Authentication**: JWT-based User Signup and Login. Protected routes.
- **Create Post**: Users can publish posts containing text, an image, or both.
- **Feed**: View all posts from all users in reverse chronological order.
- **Like System**: Toggle likes on any post, updating instantly.
- **Comment System**: Add comments to posts with real-time UI updates.
- **Responsive UI**: Card-based, clean design utilizing Material UI.

---

Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables. Open `frontend/.env` (if custom API url needed):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173`.

---
