# Merge Request: Лабораторная работа №2 - Аутентификация и авторизация с JWT

## Описание

Реализована полная система аутентификации и авторизации с использованием JWT токенов для API управления мероприятиями.

Выполнены все требования лабораторной работы с учетом варианта:
- **Функциональный вариант 1**: Реализовать выход из системы с черным списком токенов

## Выполненные требования

### Основные функции аутентификации ✓

- ✓ POST /auth/register - Регистрация пользователя
- ✓ POST /auth/login - Вход в систему с выдачей JWT
- ✓ POST /auth/logout - Выход из системы с добавлением токена в черный список
- ✓ Защита маршрутов с использованием passport.js
- ✓ Безопасное хранение паролей (bcryptjs)

### Функциональный вариант 1: Выход из системы ✓

- Реализован эндпоинт POST /auth/logout
- Создана модель TokenBlacklist для хранения недействительных токенов
- Реализован middleware checkTokenBlacklist для проверки черного списка
- При выходе токен добавляется в черный список
- Попытка использовать отозванный токен возвращает 401 Unauthorized

### Дополнительные компоненты ✓

- ✓ Модель User с полем password и хешированием
- ✓ Стратегия JWT в Passport.js
- ✓ Экстракция токена из Authorization заголовка
- ✓ Проверка токена в каждом запросе к защищенным маршрутам
- ✓ Защита маршрутов /events и /users

### Дополнительные функции ✓

- ✓ **Логирование** (morgan) - Все HTTP запросы логируются
- ✓ **Swagger документация** - Доступна по /api-docs
- ✓ **Проверка API ключа** (middleware) - Требует X-API-Key заголовок
- ✓ **Пагинация** - Параметры page и limit для GET /events
- ✓ **Поиск** - Параметр search для поиска по названию и описанию
- ✓ **Фильтрация по датам** - Параметры startDate и endDate

## Структура проекта

```
backend/
├── config/
│   ├── db.js              # Конфигурация PostgreSQL
│   └── passport.js        # Настройка JWT стратегии
├── middleware/
│   ├── checkApiKey.js     # Проверка API ключа
│   ├── checkEventLimit.js # Ограничение событий в день
│   └── checkTokenBlacklist.js  # Проверка черного списка токенов (NEW)
├── models/
│   ├── User.js            # Модель пользователя с паролем
│   ├── Event.js           # Модель события
│   ├── TokenBlacklist.js  # Модель черного списка (NEW)
│   └── index.js           # Экспорт моделей
├── routes/
│   ├── auth.js            # Маршруты аутентификации (NEW)
│   ├── events.js          # Маршруты событий (защищены)
│   └── users.js           # Маршруты пользователей (защищены)
├── .env                   # Переменные окружения (обновлено)
├── index.js               # Главный файл приложения (обновлено)
├── package.json           # Зависимости (обновлено)
└── LAB2_README.md         # Полная документация (NEW)
```

## Технологический стек

- **Node.js & Express** - веб-фреймворк
- **Sequelize ORM** - работа с БД
- **PostgreSQL** - база данных
- **JWT (jsonwebtoken)** - создание и проверка токенов
- **bcryptjs** - хеширование паролей
- **Passport.js** - стратегия аутентификации
- **Morgan** - логирование HTTP запросов
- **Swagger** - автоматическая документация API

## Примеры использования

### Регистрация
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secure_password_123"}'
```

### Вход в систему
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secure_password_123"}'

# Ответ содержит JWT токен
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

### Создание события с авторизацией
```bash
curl -X POST http://localhost:5000/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-api-key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"title":"Conference 2024","description":"...","date":"2024-12-01T10:00:00Z","createdBy":1}'
```

### Выход из системы
```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Ответ
{"message": "Logout successful, token has been blacklisted"}
```

После логаута токен добавляется в черный список и больше не может быть использован.
├── config/db.js                    # Конфигурация PostgreSQL
├── middleware/
│   ├── checkApiKey.js              # Проверка API ключа
│   └── checkEventLimit.js          # Проверка лимита мероприятий
├── models/
│   ├── User.js                     # Модель User с soft delete
│   ├── Event.js                    # Модель Event с soft delete
│   └── index.js
├── routes/
│   ├── events.js                   # CRUD для мероприятий
│   └── users.js                    # CRUD для пользователей
├── index.js                        # Главное приложение
├── package.json                    # Зависимости
├── .env.example                    # Шаблон переменных
├── README.md                       # Инструкции
└── FEATURES.md                     # Документация функций
```

## Коммиты

1. **79474b8** - `init: Initial commit with project structure and README`
   - Создана структура проекта
   - Backend папка с package.json и README
   
2. **2f2b712** - `feat: Implement core API functionality`
   - Настройка Express сервера
   - Подключение к PostgreSQL
   - Создание моделей User и Event
   - Реализация всех CRUD операций
   - Добавление Swagger и логирования

3. **1bb4ec9** - `docs: Add detailed documentation for variant implementations`
   - Документация soft delete функции
   - Примеры использования rate limiting
   - Примеры API запросов

## Как запустить

```bash
# Перейти в папку backend
cd backend

# Установить зависимости
npm install

# Создать базу данных в PostgreSQL
createdb events_db

# Настроить .env (см. .env.example)

# Запустить в режиме разработки
npm run dev
```

Сервер будет доступен на `http://localhost:5000`  
Документация API на `http://localhost:5000/api-docs`

## Проверка работы

Все операции требуют заголовка `X-API-Key: your_api_key_here`

```bash
# Создание пользователя
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{"name":"Никита","email":"test@example.com"}'

# Создание события
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{"title":"Конферencia","date":"2026-02-15T10:00:00Z","createdBy":1}'

# Получение событий с фильтрацией
curl "http://localhost:5000/events?page=1&limit=10&search=конф" \
  -H "X-API-Key: your_api_key_here"
```

## Технологии

- Node.js + Express
- Sequelize ORM  
- PostgreSQL
- Morgan (логирование)
- Swagger/OpenAPI
- Dotenv
- CORS

## Примечания

- API ключ должен быть передан в каждом запросе через заголовок `X-API-Key`
- При удалении (DELETE) используется soft delete - данные не удаляются, а помечаются как удаленные
- Лимит на создание событий проверяется за последние 24 часа
- Все даты в UTC формате (ISO 8601)
