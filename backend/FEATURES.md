# API для управления мероприятиями - Документация

## Функциональные требования (Вариант 6)

### Soft Delete для пользователей и мероприятий

Реализовано мягкое удаление для обеспечения возможности восстановления данных:

- **Модель User**: добавлено поле `deletedAt` (DATE, nullable)
- **Модель Event**: добавлено поле `deletedAt` (DATE, nullable)

При удалении (DELETE запрос) запись не удаляется из БД, а устанавливается текущее время в поле `deletedAt`.

Все GET запросы автоматически фильтруют удаленные записи:
```javascript
where: { deletedAt: null }
```

### Примеры API использования

#### Удаление пользователя (soft delete)
```bash
DELETE /users/:id
X-API-Key: your_api_key_here
```

Ответ:
```json
{
  "message": "User deleted successfully"
}
```

Пользователь остается в БД с установленным `deletedAt`.

#### Удаление мероприятия (soft delete)
```bash
DELETE /events/:id
X-API-Key: your_api_key_here
```

#### Получение списка (только активные записи)
```bash
GET /events
X-API-Key: your_api_key_here
```

Вернет только мероприятия с `deletedAt = null`.

---

## Улучшения (Вариант 1)

### Ограничение количества мероприятий в день

Добавлена проверка лимита при создании нового мероприятия.

#### Параметры конфигурации (.env):
```
MAX_EVENTS_PER_DAY=10
```

#### Логика работы:
1. При POST /events проверяется количество мероприятий, созданных пользователем за последние 24 часа
2. Если лимит превышен, возвращается ошибка 429 (Too Many Requests)
3. Считаются только активные (не удаленные) мероприятия

#### Пример ошибки при превышении лимита:
```bash
POST /events
X-API-Key: your_api_key_here
Content-Type: application/json

{
  "title": "New Event",
  "date": "2026-02-15T10:00:00Z",
  "description": "Test event",
  "createdBy": 1
}
```

Ответ (429 Too Many Requests):
```json
{
  "error": "You can only create 10 events per day. Limit exceeded.",
  "currentCount": 10,
  "limit": 10
}
```

---

## Дополнительные функции

### Пагинация
```bash
GET /events?page=1&limit=10
```

### Поиск по названию и описанию
```bash
GET /events?search=concert
```

### Фильтрация по диапазону дат
```bash
GET /events?startDate=2026-02-01T00:00:00Z&endDate=2026-02-28T23:59:59Z
```

### Комбинированный запрос
```bash
GET /events?page=2&limit=5&search=exhibition&startDate=2026-02-01T00:00:00Z
```

---

## Требования к API ключу

Все запросы требуют заголовка `X-API-Key`:

```bash
curl -H "X-API-Key: your_api_key_here" http://localhost:5000/events
```

Без валидного ключа вернется 401:
```json
{
  "error": "Invalid or missing API key"
}
```

---

## Проверка работы

### 1. Создание пользователя
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "name": "Никита Качкаев",
    "email": "nikita@example.com"
  }'
```

### 2. Создание мероприятия
```bash
curl -X POST http://localhost:5000/events \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "title": "Конференция",
    "description": "Конференция по веб-разработке",
    "date": "2026-02-15T10:00:00Z",
    "createdBy": 1
  }'
```

### 3. Получение списка мероприятий
```bash
curl http://localhost:5000/events \
  -H "X-API-Key: your_api_key_here"
```

### 4. Мягкое удаление
```bash
curl -X DELETE http://localhost:5000/events/1 \
  -H "X-API-Key: your_api_key_here"
```

---

## Структура проекта

```
backend/
├── config/
│   └── db.js              # Конфигурация Sequelize и PostgreSQL
├── middleware/
│   ├── checkApiKey.js     # Проверка API ключа
│   └── checkEventLimit.js # Проверка лимита мероприятий
├── models/
│   ├── User.js            # Модель User с soft delete
│   ├── Event.js           # Модель Event с soft delete
│   └── index.js           # Экспорт моделей
├── routes/
│   ├── events.js          # API маршруты для мероприятий
│   └── users.js           # API маршруты для пользователей
├── .env                   # Переменные окружения
├── .gitignore             # Git правила исключения
├── index.js               # Главный файл приложения
├── package.json           # Зависимости
└── README.md              # Документация проекта
```

---

## Технологический стек

- **Node.js** + **Express** - веб-фреймворк
- **Sequelize** - ORM для работы с БД
- **PostgreSQL** - СУБД
- **Morgan** - логирование HTTP запросов
- **Swagger** - документация API
- **Dotenv** - управление переменными окружения
- **CORS** - кросс-доменные запросы
