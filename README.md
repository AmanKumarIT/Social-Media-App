### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **JWT (JSON Web Tokens)** for Authentication
- **Bcrypt.js** for password hashing
- **Multer** for image uploads

Backend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables. Open `backend/.env` and configure your `MONGO_URI`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=yoursupersecretkey
   ```
3. Start the backend development server:
   ```bash
   node server.js
   ```
