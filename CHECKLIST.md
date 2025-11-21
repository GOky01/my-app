# Чеклист виконання ТЗ

## ✅ Навігація (Header)
- [x] Home (/) - реалізовано
- [x] Items (/items) - реалізовано
- [x] Profile (/profile) - реалізовано
- [x] Logout - реалізовано

## ✅ Роутинг та авторизація
- [x] / - головна сторінка, перенаправлення на /login якщо не авторизований
- [x] /login - сторінка логіну
- [x] /items - сторінка з таблицею (захищена)
- [x] /profile - сторінка профілю (захищена)
- [x] ProtectedRoute для захисту маршрутів

## ✅ Сторінка Items
- [x] Таблиця з даними (ID, Name, Description, Created At, Updated At, Status)
- [x] Select Columns - вибір видимих колонок
- [x] Пошук по всіх колонках
- [x] Сортування по колонках
- [x] Drag & Drop для зміни порядку колонок
- [x] Стилізація таблиці (градієнтний header, hover ефекти, тіні)

## ✅ Redux Store
- [x] Auth slice (login, logout, user state)
- [x] Items slice (items, visibleColumns, searchTerm, sortColumn, sortDirection)
- [x] Збереження токену в localStorage

## ✅ Backend API
- [x] Node.js + Express
- [x] MongoDB + Mongoose
- [x] JWT авторизація
- [x] POST /api/auth/login
- [x] GET /api/auth/me
- [x] GET /api/items

## ✅ MongoDB
- [x] Docker compose для локального запуску
- [x] Підтримка MongoDB Atlas (хмарна база)
- [x] Seed скрипт для тестових даних

## ✅ Додаткові вимоги
- [x] TypeScript для фронтенду
- [x] React Router для навігації
- [x] CORS налаштовано
- [x] Хешування паролів (bcrypt)
- [x] Middleware для JWT перевірки

## Тестові дані
- Email: test@example.com
- Password: password123

