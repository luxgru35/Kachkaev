# Лабораторная работа №2 - Аутентификация и авторизация с JWT

## Реализованный функциональный вариант: 1
**Реализовать выход из системы (Logout)**

## Описание

Реализована система аутентификации и авторизации с использованием JWT токенов. Система поддерживает регистрацию пользователей, вход в систему, защиту маршрутов и выход из системы с механизмом черного списка токенов.

## Основные компоненты

### 1. Аутентификация и авторизация
- **POST /auth/register** - Регистрация нового пользователя
  - Параметры: `name`, `email`, `password`
  - Пароли хешируются с использованием bcryptjs

- **POST /auth/login** - Вход в систему
  - Параметры: `email`, `password`
  - Возвращает JWT токен с временем жизни 24 часа

- **POST /auth/logout** - Выход из системы
  - Требует авторизации (JWT токен)
  - Добавляет токен в черный список

### 2. Защита маршрутов
Все защищенные маршруты требуют:
- Валидный JWT токен в заголовке `Authorization: Bearer <token>`
- Проверку черного списка токенов

Защищенные маршруты:
- **POST /events** - Создание события
- **PUT /events/:id** - Обновление события
- **DELETE /events/:id** - Удаление события
- **DELETE /users/:id** - Удаление пользователя

### 3. Функциональный вариант 1: Выход из системы
При выходе из системы:
1. Клиент отправляет токен на эндпоинт `/auth/logout`
2. Токен добавляется в таблицу `TokenBlacklist`
3. При каждом запросе к защищенным маршрутам:
   - Middleware `checkTokenBlacklist` проверяет, находится ли токен в черном списке
   - Если найден - запрос отклоняется с ошибкой 401

## Установка и запуск

### Требования
- Node.js 14+
- PostgreSQL 11+

### Установка зависимостей
```bash
npm install
```

### Конфигурация
Отредактируйте файл `.env`:
```
DB_NAME=events_db
DB_USER=postgres
DB_PASSWORD=databatuv200211
DB_HOST=localhost
DB_PORT=5433
PORT=5000
NODE_ENV=development
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_key_change_in_production_12345678
MAX_EVENTS_PER_DAY=10
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Запуск в режиме продакшена
```bash
npm start
```

## Примеры использования API

### 1. Регистрация пользователя
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

### 2. Вход в систему
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure_password_123"
  }'
```

Ответ содержит JWT токен:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### 3. Создание события с авторизацией
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-api-key: your_api_key_here" \
  -d '{
    "title": "Conference 2024",
    "description": "Annual tech conference",
    "date": "2024-12-01T10:00:00Z",
    "createdBy": 1
  }'
```

### 4. Выход из системы
```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

После логаута токен добавляется в черный список и не может быть использован повторно.

### 5. Попытка использовать токен после логаута
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer REVOKED_TOKEN" \
  -H "x-api-key: your_api_key_here" \
  -d '{...}'
```

Ответ: 401 Unauthorized - "Token has been revoked"

## Структура БД

### Таблица users
- `id` - PRIMARY KEY
- `name` - VARCHAR
- `email` - VARCHAR (UNIQUE)
- `password` - VARCHAR (хеш пароля)
- `createdAt` - DATE

### Таблица tokenblacklist
- `id` - PRIMARY KEY
- `token` - TEXT (UNIQUE)
- `userId` - INTEGER
- `expiresAt` - DATE (время истечения токена)
- `createdAt` - DATE

## Технологический стек

- **Express.js** - веб фреймворк
- **Sequelize** - ORM для работы с БД
- **JWT (jsonwebtoken)** - для создания и проверки токенов
- **bcryptjs** - для хеширования паролей
- **Passport.js** - стратегия аутентификации
- **PostgreSQL** - база данных

## Реализованные требования

✓ Пользователи могут зарегистрироваться и войти в систему
✓ Авторизованные пользователи получают JWT токен
✓ Доступ к защищенным маршрутам требует аутентификации
✓ Пароли хешируются с использованием bcryptjs
✓ Реализован middleware для проверки авторизации
✓ Реализован черный список токенов (вариант 1)
✓ Использование правильной структуры ветвления в git
✓ Коммиты по установленному соглашению

## Команды для работы с git

Создание ветки для лабораторной:
```bash
git checkout -b feature/lab2-authentication
```

Коммит после основного задания:
```bash
git add .
git commit -m "feat: LAB2 Реализована аутентификация и авторизация с JWT"
```

Коммит после реализации варианта 1:
```bash
git add .
git commit -m "feat: LAB2 Реализован выход из системы с черным списком токенов"
```

Создание Merge Request:
```bash
git push origin feature/lab2-authentication
```

## Дополнительные возможности для развития

1. Refresh tokens для продления сеанса
2. Роли пользователей (admin, user)
3. Блокировка аккаунта после неудачных попыток входа
4. Email уведомления при входе с нового устройства
5. 2FA (двухфакторная аутентификация)

## Тестирование

Для тестирования API рекомендуется использовать:
- **Postman** - графический инструмент для тестирования
- **curl** - командная строка
- **Swagger UI** - доступен на /api-docs

## Авторы и лицензия

Лабораторная работа №2 по дисциплине "Основы веб-разработки"
