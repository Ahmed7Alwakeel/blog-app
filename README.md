# 📝 Blog APP

A simple RESTful Blog API built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

---

## ⚙️ Installation

### 1. Clone the Repository

```terminal
git clone https://github.com/yourusername/blog-app.git
cd blog-app
```

### 2. Install Dependencies

```terminal
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file at the root of the project and add the following:

### `.env.example`

```env
PORT=4000
MONGO_LOCAL_URL=mongodb://localhost:27017/blogs
JWT_SECRET=your-secret-key
```

---

## ▶️ Running the App

### 1. Start MongoDB

If MongoDB is installed locally, run:

```terminal
mongod
```

> Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and paste your connection URI in the `.env` file.

### 2. Start the Server

```terminal
npm start
```

---

## 🧪 Running Tests

```terminal
npm run test
```