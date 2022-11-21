---
id: cdn-links
title: Посилання на CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

Як React, так і ReactDOM доступні через CDN.

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

Зазначені вище версії призначені тільки при розробці програми, але не підходять для використання в продакшн-оточенні. Мініфіковані та оптимізовані для продакшн версії React перераховані нижче:

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
Щоб завантажити конкретну версію `react` та `react-dom`, замініть `16` на номер версії, яка вам потрібна.
=======
To load a specific version of `react` and `react-dom`, replace `18` with the version number.
>>>>>>> e50e5634cca3c7cdb92c28666220fe3b61e9aa30

### Для чого атрибут `crossorigin`? {#why-the-crossorigin-attribute}

Якщо ви завантажуєте React з CDN, ми рекомендуємо вам скористатися атрибутом [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Також бажано перевірити, що використаний сервіс CDN встановлює HTTP-заголовок `Access-Control-Allow-Origin: *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Така практика дозволить покращити [обробку помилок](/blog/2017/07/26/error-handling-in-react-16.html) в React 16 і новіших версіях.
