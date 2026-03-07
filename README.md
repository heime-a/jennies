# Jennies - Modern ERP System with Bun & MongoDB

A full-stack ERP (Enterprise Resource Planning) system built for prepared food manufacturing operations, now optimized with **Bun**.

## 🎯 Overview

Jennies is a comprehensive business management solution that helps prepared food manufacturers streamline their operations, manage inventory, track production, and oversee the entire manufacturing workflow.

## 🛠️ Tech Stack

### Backend
- **Bun** (High-performance JS runtime)
- **Express.js**
- **MongoDB** with Mongoose ODM
- **Authentication**: bcrypt for password hashing

### Frontend
- **React 18.3** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** v6, **Reactstrap**, and **Bootstrap 5**

## 📁 Project Structure

```
jennies/
├── client/           # React frontend application
├── models/           # MongoDB/Mongoose data models
├── routes/           # Express API routes
├── common/           # Shared utilities and helpers
├── app.js            # Express server configuration
└── createSampleData.js  # Sample data generation script
```

## 🚀 Getting Started

### Prerequisites
- **Bun** (v1.0 or higher) - [Install Bun](https://bun.sh)
- **MongoDB** (v7.0 recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heime-a/jennies.git
   cd jennies
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   bun install
   cd ..
   ```

### Running MongoDB

If you installed MongoDB via the system package manager (apt), you can manage it with `systemctl`:

- **Start MongoDB**: `sudo systemctl start mongod`
- **Check Status**: `sudo systemctl status mongod`
- **Stop MongoDB**: `sudo systemctl stop mongod`
- **Enable on Boot**: `sudo systemctl enable mongod`

### Running the Application

**Development mode** (runs both server and client concurrently with hot-reloading):
```bash
bun run dev
```

**Server only** (with auto-reload):
```bash
bun run monitor
```

The server runs on `http://localhost:3000` (default) and the React app on `http://localhost:5173`.

## 📊 Sample Data

To populate the database with sample data (Ingredients, Recipes, Work Orders, etc.):
```bash
bun createSampleData.js
```
*Note: This will drop the existing `jennies` database.*

## 📜 Available Scripts (Root)
- `bun run dev` - Run server (watch mode) and client concurrently
- `bun run server` - Run server only
- `bun run monitor` - Run server with built-in watch mode
- `bun run client` - Run client only

## 👤 Author

**heime-a**
- GitHub: [@heime-a](https://github.com/heime-a)

---

*Built with ❤️ for the prepared food manufacturing industry*
