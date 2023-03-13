---
id: rendering-elements
title: Рендеринг елементів
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

Елементи — це найменші будівельні блоки React-додатку.

Елемент описує те, що ви хочете бачити на екрані:

```js
const element = <h1>Привіт, світе</h1>;
```

На відміну від DOM-елементів, елементи React — звичайні об'єкти, легкі для створення. React DOM бере на себе оновлення DOM для його відповідності React-елементам.

>**Примітка:**
>
>Можна сплутати елементи з більш загальновідомою концепцією "компонентів". Ми представимо компоненти в [наступному розділі](/docs/components-and-props.html). Елементи — це те, з чого "зроблені" компоненти, перш ніж рухатись далі, ми рекомендуємо вам ознайомитись з цим розділом.

## Рендеринг елемента в DOM {#rendering-an-element-into-the-dom}

Припустимо, що у вашому HTML файлі існує `<div>`:

```html
<div id="root"></div>
```

Ми називаємо його "кореневим" DOM вузлом, тому що все всередині нього буде керуватись за допомогою React DOM.

Додатки, створені за допомогою самого лише React, зазвичай мають лише один кореневий вузол DOM. Якщо ви інтегруєте React в існуючий додаток — ви можете мати будь-яку кількість ізольованих кореневих DOM вузлів.

<<<<<<< HEAD
Для рендерингу React-елементу в кореневому DOM вузлі, викличте функцію [`ReactDOM.render()`](/docs/react-dom.html#render) з React-елементом та кореневим DOM вузлом у якості аргументів:
=======
To render a React element, first pass the DOM element to [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot), then pass the React element to `root.render()`:
>>>>>>> 19aa5b4852c3905757edb16dd62f7e7506231210

`embed:rendering-elements/render-an-element.js`

**[Try it on CodePen](https://codepen.io/gaearon/pen/ZpvBNJ?editors=1010)**

На сторінці відобразиться "Hello, world".

## Оновлення відображеного елемента {#updating-the-rendered-element}

React-елементи є [незмінними](https://uk.wikipedia.org/wiki/Незмінний_об%27єкт). Як тільки елемент створений, ви не можете змінювати його дочірні елементи чи атрибути. Елемент схожий на кадр із фільму: він відображає інтерфейс користувача в певний момент часу.

<<<<<<< HEAD
З нашими поточними знаннями, єдиний спосіб оновити інтерфейс користувача — створити новий елемент і передати його в [`ReactDOM.render()`](/docs/react-dom.html#render).
=======
With our knowledge so far, the only way to update the UI is to create a new element, and pass it to `root.render()`.
>>>>>>> 19aa5b4852c3905757edb16dd62f7e7506231210

Розглянемо наступний приклад годинника:

`embed:rendering-elements/update-rendered-element.js`

**[Try it on CodePen](https://codepen.io/gaearon/pen/gwoJZk?editors=1010)**

<<<<<<< HEAD
Він щосекунди викликає [`ReactDOM.render()`](/docs/react-dom.html#render) у функції зворотнього виклику [`setInterval()`](https://developer.mozilla.org/uk/docs/Web/API/WindowOrWorkerGlobalScope/setInterval).
=======
It calls [`root.render()`](/docs/react-dom.html#render) every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.
>>>>>>> 19aa5b4852c3905757edb16dd62f7e7506231210

>**Примітка:**
>
<<<<<<< HEAD
>На практиці, більшість React-додатків викликає [`ReactDOM.render()`](/docs/react-dom.html#render) лише раз. У наступних розділах ми дізнаємось, як такий код інкапсулюється в [компоненти зі станом](/docs/state-and-lifecycle.html).
=======
>In practice, most React apps only call `root.render()` once. In the next sections we will learn how such code gets encapsulated into [stateful components](/docs/state-and-lifecycle.html).
>>>>>>> 19aa5b4852c3905757edb16dd62f7e7506231210
>
>Ми рекомендуємо вам не пропускати ці теми, тому що вони залежать одна від одної.

## React оновлює лише те, що необхідно {#react-only-updates-whats-necessary}

React DOM порівнює елемент і його дочірні елементи з попередніми та вносить в DOM тільки необхідні зміни для приведення DOM у бажаний стан.

<<<<<<< HEAD
Ви можете пересвідчитись в цьому, перевіривши [останній приклад](codepen://rendering-elements/update-rendered-element) за допомогою інструментів браузера:
=======
You can verify by inspecting the [last example](https://codepen.io/gaearon/pen/gwoJZk?editors=1010) with the browser tools:
>>>>>>> 19aa5b4852c3905757edb16dd62f7e7506231210

![DOM-інспектор показує лише оновлення деталей](../images/docs/granular-dom-updates.gif)

Не дивлячись на те, що ми створили елемент, який щосекундно описує структуру дерева інтерфейсу користувача, лише текстовий вузол, вміст якого змінився, оновлюється за допомогою React DOM.

З нашого досвіду — роздуми про те, як інтерфейс користувача має виглядати в будь-який даний момент, а не про те, як він повинен змінюватись протягом часу, виключає цілий клас можливих помилок.
