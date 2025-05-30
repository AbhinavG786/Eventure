# 🎉 Eventure – Event Management & Discovery Platform

Eventure is a mobile-first backend system built with TypeScript, Node.js, and PostgreSQL to manage college/university events. It supports user registration, OTP-based login, event creation, following societies, personalized event feeds, calendar integration, and more.

---

## 🚀 Tech Stack

| Layer         | Technology                  |
| ------------- | --------------------------- |
| Language      | TypeScript                  |
| Runtime       | Node.js                     |
| Framework     | Express.js                  |
| ORM           | TypeORM                     |
| Database      | PostgreSQL                  |
| Caching/OTP   | Redis                       |
| Image Upload  | ImageKit                    |
| Auth          | JWT + Google OAuth          |
| Email Service | Nodemailer + HTML templates |
| DevOps        | Docker + Docker Compose     |

---

## ✅ Features

* 🔐 OTP-based signup & login (Redis caching)
* 📧 Email verification with custom HTML templates
* 🗕️ Event calendar (with start and end times)
* ⭐ Bookmark, rate, and register for events
* 📍 Discover trending events
* 🡥 Follow societies and get personalized event feeds
* 📷 Profile & event image uploads (via ImageKit)
* 🔍 Search & filter events/societies
* 🔄 Password reset with magic link

---

## 📦 Local Installation (Non-Docker)

### 1. Clone the repo

```bash
git clone https://github.com/AbhinavG786/Eventure.git
cd eventure
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=eventure

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Email
EMAIL_USER=your@email.com
EMAIL_PASS=your_password
```

### 4. Start Redis & PostgreSQL

Make sure Redis and PostgreSQL are running locally:

* Redis: `redis-server`
* PostgreSQL: Use pgAdmin or CLI to create a `eventure` DB.

### 5. Run the app

```bash
npm run dev
```

---

## 🐳 Docker Setup

### 1. Build & Run containers

```bash
docker-compose up --build
```

### 2. `.env` (used inside containers)

Make sure the service names match Docker Compose:

```env
DB_HOST=eventure-db
REDIS_URL=redis://redis:6379
```

### 3. Services Exposed

| Service       | Port             |
| ------------- | ---------------- |
| App (Express) | `localhost:3000` |
| PostgreSQL    | `localhost:5432` |
| Redis         | `localhost:6379` |

### 4. Test via Postman

Use endpoints like:

```
POST http://localhost:3000/auth/register
POST http://localhost:3000/auth/verify-otp
GET  http://localhost:3000/events/personalized/:userId
```

---

## 📁 Project Structure

```
/src
├── controllers/
├── services/
├── routes/
├── entities/
├── middlewares/
├── utils/
├── config/
├── types/
└── server.ts
```

---

## 🔑 Environment Variables Summary

* `PORT`: App port
* `DB_*`: PostgreSQL config
* `REDIS_URL`: Redis endpoint
* `JWT_SECRET`: JWT secret key
* `IMAGEKIT_*`: For image uploads
* `EMAIL_*`: SMTP config for email OTPs & reset

---


## 👨‍💻 Maintainer

Made with ❤️ by [Abhinav Gupta](https://github.com/AbhinavG786/Eventure)
