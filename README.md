# Jennies - MERN Stack ERP System

A full-stack ERP (Enterprise Resource Planning) system built with the MERN stack, designed for prepared food manufacturing operations.

## 🎯 Overview

Jennies is a comprehensive business management solution that helps prepared food manufacturers streamline their operations, manage inventory, track production, and oversee the entire manufacturing workflow.

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Authentication**: bcrypt for password hashing
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18.3** with TypeScript
- **React Router** v6 for navigation
- **Reactstrap** and Bootstrap 5 for UI components
- **React Bootstrap Typeahead** for enhanced form controls
- **Vite** for fast development and optimized builds

## 📁 Project Structure

```
jennies/
├── client/           # React frontend application
├── models/           # MongoDB/Mongoose data models
├── routes/           # Express API routes
├── common/           # Shared utilities and helpers
├── bin/              # Binary/executable files
├── app.js            # Express server configuration
└── createSampleData.js  # Sample data generation script
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heime-a/jennies.git
   cd jennies
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory with your configuration:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   NODE_ENV=development
   ```

### Running the Application

**Development mode** (runs both server and client concurrently):
```bash
npm run dev
```

**Server only**:
```bash
npm start
```

**Client only**:
```bash
npm run client
```

The server will start on `http://localhost:5000` and the React app on `http://localhost:5173` (Vite default).

## 📊 Sample Data

To populate the database with sample data for testing:
```bash
node createSampleData.js
```

## 📜 Available Scripts

### Root Directory
- `npm start` - Start the production server
- `npm run dev` - Run server and client in development mode
- `npm run server` - Run server only
- `npm run client` - Run client only
- `npm run monitor` - Run server with nodemon (auto-restart)

### Client Directory
- `npm start` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔧 Development

This project uses:
- **ESLint** for code linting (Airbnb style guide)
- **Nodemon** for automatic server restarts during development
- **Concurrently** to run multiple npm scripts simultaneously

## 🚢 Deployment

The project is configured for Heroku deployment with a post-build script that automatically builds the client application:

```bash
npm run heroku-postbuild
```

## 📝 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👤 Author

**heime-a**
- GitHub: [@heime-a](https://github.com/heime-a)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

*Built with ❤️ for the prepared food manufacturing industry*