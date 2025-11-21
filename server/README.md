# Backend Server

Node.js + Express + MongoDB + Mongoose + JWT

## Встановлення

1. Встановіть залежності:
```bash
npm install
```

2. Створіть файл `.env` (скопіюйте з `.env.example`):
```bash
PORT=3001
MONGODB_URI=mongodb://localhost:27017/react-redux-app
JWT_SECRET=your-secret-key-change-this-in-production
```

## Запуск MongoDB

### Варіант 1: Docker (рекомендовано)
```bash
docker-compose up -d
```

### Варіант 2: MongoDB Atlas (хмарна база)
1. Створіть безкоштовний акаунт на https://www.mongodb.com/cloud/atlas
2. Створіть кластер
3. Отримайте connection string
4. Оновіть `MONGODB_URI` в `.env` файлі

### Варіант 3: Локальна установка
Встановіть MongoDB локально з https://www.mongodb.com/try/download/community

## Запуск сервера

1. Запустіть seed для створення тестових даних:
```bash
node seed.js
```

2. Запустіть сервер:
```bash
npm start
```

або для розробки з автоперезавантаженням:
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Авторизація
- `GET /api/auth/me` - Отримати поточного користувача (потрібен токен)

### Items
- `GET /api/items` - Отримати список items (потрібен токен)

## Тестові дані

Після запуску seed.js:
- Email: `test@example.com`
- Password: `password123`
