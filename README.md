# VILLAIN — сайт-визитка

Тёмная кинематографичная визитка: Vite + React + TypeScript + framer-motion.
Фоновый дым сгенерирован в Higgsfield (`public/hero-smoke.webp`).

## Запуск

```bash
npm install      # один раз
npm run dev      # http://localhost:5173
npm run build    # продакшен-сборка в dist/
npm run preview  # посмотреть продакшен-сборку
```

## Как редактировать

Всё личное — в одном файле: **`src/config.ts`**

- **Ссылки** — массив `links`: поменяй `handle` / `url`, добавь или удали объект — кнопки обновятся сами. Если у ссылки нет `url` (как у Discord), клик копирует `handle` в буфер обмена.
- **Имя / слоган** — объект `profile`.
- **Evil schemes** — массив `schemes`: три фазы плана (codename, title, 4 пункта, статус `'in progress'` / `'coming soon'`).
- **Dossier** — объект `dossier`: `about`, `facts`, `achievements`, `projects` (добавь `url`, чтобы карточка проекта стала ссылкой), `skills`.

## Дизайн

Палитра и радиусы — CSS-переменные в `src/index.css` (`--accent`, `--burgundy`, `--bg-base`...).
Шрифты: Bebas Neue (заголовки) + Source Sans 3 (текст), подключены в `index.html`.
Анимации уважают `prefers-reduced-motion`.
