# Todo List API

## 📌 Description

**Todo List API** is a backend application built with **NestJS**, **TypeORM**, and **PostgreSQL**.  
It provides a secure and RESTful API for managing tasks,
featuring JWT-based authentication, CRUD operations, filtering, and pagination.

---

## ⚙️ Technologies Used

- **Node.js** – JavaScript/TypeScript runtime
- **NestJS** – Progressive Node.js framework for building scalable server-side apps
- **PostgreSQL** – Open-source relational database
- **TypeORM** – ORM for TypeScript and JavaScript (supports PostgreSQL)
- **JWT** – JSON Web Token-based authentication
- **Docker** – Containerization for the app and PostgreSQL
- **Jest** – Unit testing framework

---

## 📦 Installation

### 1. Create environment variables
- Run the command: cp .env.example .env

### Install dependencies
```bash
# development
$ npm install
```

### Running the App
```bash
# development
$ npm run start:dev
```

### Running with Docker
```bash
$ docker-compose up --build
```

## 🧪 Testing
# Run unit tests
npm run test

## 📬 HTTP Request Testing
A requests.http file is included in the src/ folder for convenient endpoint testing using WebStorm, GoLand, or similar IDEs.

### Usage Instructions
1. Open the project in a supported IDE.
2. Navigate to the requests.http file.
3. Start the server (npm run dev or docker-compose up).
4. Click "Send Request" above any request block to test the API.
