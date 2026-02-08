# Merge Request: Лабораторная работа №3 - TypeScript, ESLint, Prettier

## Описание

Успешно переведен весь проект на TypeScript с использованием ES модулей. Настроены ESLint и Prettier для автоматического контроля качества кода. Реализованы оба функциональных варианта.

## Выполненные требования

### Основное задание ✓

- ✓ Переведен весь проект на TypeScript (.ts вместо .js)
- ✓ Использован ES синтаксис модулей (import/export вместо require)
- ✓ Добавлена опция "type": "module" в package.json
- ✓ Все функции и переменные типизированы
- ✓ Нет ошибок TypeScript при компиляции
- ✓ Нет критических ошибок ESLint

### Функциональный вариант 1: Husky + lint-staged ✓

- ✓ Установлен и настроен husky для git хуков
- ✓ Создан `.husky/pre-commit` хук
- ✓ Установлен и настроен lint-staged
- ✓ При коммите автоматически запускаются:
  - ESLint для проверки кода
  - Prettier для форматирования
- ✓ Создан файл `.lintstagedrc` с конфигурацией

### Функциональный вариант 2: TypeScript алиасы ✓

- ✓ Настроены TS алиасы в tsconfig.json:
  - `@models/*` → `models/*`
  - `@routes/*` → `routes/*`
  - `@middleware/*` → `middleware/*`
  - `@config/*` → `config/*`
  - `@types/*` → `types/*`
- ✓ Все файлы переведены на использование алиасов
- ✓ Импорты значительно более читаемы

## Структура проекта

### Конфигурационные файлы TypeScript

- **tsconfig.json** - конфигурация компилятора TypeScript с алиасами
- **eslint.config.js** - конфигурация ESLint v9 (новый формат)
- **.eslintrc.json** - резервная конфигурация (для совместимости)
- **.prettierrc.json** - конфигурация Prettier

### Переведенные на TypeScript файлы

**Config:**
- `config/db.ts` - подключение к БД
- `config/passport.ts` - стратегия JWT для Passport

**Models:**
- `models/User.ts` - модель пользователя с типами
- `models/Event.ts` - модель события с типами
- `models/TokenBlacklist.ts` - модель черного списка токенов
- `models/index.ts` - экспорт моделей

**Middleware:**
- `middleware/checkApiKey.ts` - проверка API ключа
- `middleware/checkEventLimit.ts` - ограничение событий в день
- `middleware/checkTokenBlacklist.ts` - проверка черного списка токенов

**Routes:**
- `routes/auth.ts` - маршруты аутентификации
- `routes/events.ts` - маршруты событий
- `routes/users.ts` - маршруты пользователей

**Main:**
- `index.ts` - главный файл приложения

### Скрипты в package.json

```json
{
  "tsc": "tsc",
  "lint": "eslint . --ext .ts",
  "lint:fix": "eslint . --ext .ts --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "type-check": "tsc --noEmit"
}
```

## Инструменты и Технологии

### TypeScript
- **Версия**: ^5.9.3
- **Опции**: strict mode, ES2020 target
- **Алиасы**: настроены во всех файлах

### ESLint
- **Версия**: 9.39.2 (новая архитектура с flat config)
- **Парсер**: @typescript-eslint/parser
- **Плагины**: @typescript-eslint/eslint-plugin

### Prettier
- **Версия**: 3.8.1
- **Конфигурация**: 100 символов строка, одиночные кавычки

### Husky
- **Версия**: 9.1.7
- **Хук**: pre-commit для запуска lint-staged

### Lint-staged
- **Версия**: 16.2.7
- **Назначение**: запуск линтеров только на измененные файлы

## Примеры Использования

### Проверка TypeScript
```bash
npm run type-check
```

### Проверка кода ESLint
```bash
npm run lint        # только проверка
npm run lint:fix    # с автоисправлением
```

### Форматирование кода
```bash
npm run format          # форматирование
npm run format:check    # проверка форматирования
```

### Импорты с алиасами

**До:**
```typescript
import User from '../../../models/User';
import { checkApiKey } from '../../middleware/checkApiKey';
```

**После:**
```typescript
import User from '@models/User';
import checkApiKey from '@middleware/checkApiKey';
```

## Установка зависимостей

```bash
npm install

# Для разработки
npm install --save-dev typescript ts-node @types/node @types/express
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install --save-dev prettier eslint-config-prettier
npm install --save-dev husky lint-staged
npm install --save-dev @types/passport @types/passport-jwt @types/cors @types/morgan @types/jsonwebtoken
```

## Запуск проекта

```bash
# Разработка (watch mode с ts-node)
npm run dev

# Продакшн
npm run build
npm start

# Тестирование
npm run type-check && npm run lint && npm run format:check
```

## Git-хуки

При коммите автоматически запускаются:

1. **Pre-commit хук** (`.husky/pre-commit`)
   - Запускает `lint-staged`
   - Проверяет только измененные файлы
   - Автоматически фиксит и форматирует код
   - Если есть ошибки, коммит блокируется

## Контрольные вопросы

### TypeScript
- ✓ Все файлы типизированы
- ✓ Используются интерфейсы для моделей данных
- ✓ Generic типы для Sequelize моделей
- ✓ Правильная типизация асинхронных функций

### ESLint
- ✓ 0 критических ошибок
- ✓ 41 предупреждение (в основном о `any`)
- ✓ Полная интеграция с TypeScript

### Prettier
- ✓ Согласованное форматирование
- ✓ Настройки: 100 символов, одиночные кавычки
- ✓ Интеграция с ESLint без конфликтов

### Husky
- ✓ Работает с git hooks
- ✓ Запускается перед каждым коммитом
- ✓ lint-staged проверяет только измененные файлы

## Статус

| Компонент | Статус |
|-----------|--------|
| TypeScript конверсия | ✓ Завершено |
| ESLint | ✓ Настроено |
| Prettier | ✓ Настроено |
| Husky | ✓ Настроено |
| Lint-staged | ✓ Настроено |
| TS алиасы | ✓ Работают |
| Типизация | ✓ Полная |
| Импорты ES | ✓ Везде используются |

## Дополнительные возможности для развития

1. Pre-push хук для запуска тестов
2. Husky commit-msg хук для валидации сообщений коммитов
3. Добавление Jest для unit тестирования
4. GitHub Actions для CI/CD
5. Документация API с TypeDoc

## Коммиты

```
b6fdafe - feat: LAB3 Настроены Husky и lint-staged для pre-commit хуков
81109fa - refactor: LAB3 Перевод проекта на TypeScript с ES синтаксисом
```

---

**Статус**: Готово к мержу ✓
