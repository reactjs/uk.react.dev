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
Для рендерингу React-елементу в кореневому DOM вузлі, викличте функцію `ReactDOM.render()` з React-елементом та кореневим DOM вузлом у якості аргументів:
=======
To render a React element into a root DOM node, pass both to [`ReactDOM.render()`](/docs/react-dom.html#render):
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

`embed:rendering-elements/render-an-element.js`

[](codepen://rendering-elements/render-an-element)

На сторінці відобразиться "Hello, world".

## Оновлення відображеного елемента {#updating-the-rendered-element}

React-елементи є [незмінними](https://uk.wikipedia.org/wiki/Незмінний_об%27єкт). Як тільки елемент створений, ви не можете змінювати його дочірні елементи чи атрибути. Елемент схожий на кадр із фільму: він відображає інтерфейс користувача в певний момент часу.

<<<<<<< HEAD
З нашими поточними знаннями, єдиний спосіб оновити інтерфейс користувача — створити новий елемент і передати його в `ReactDOM.render()`.
=======
With our knowledge so far, the only way to update the UI is to create a new element, and pass it to [`ReactDOM.render()`](/docs/react-dom.html#render).
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

Розглянемо наступний приклад годинника:

`embed:rendering-elements/update-rendered-element.js`

[](codepen://rendering-elements/update-rendered-element)

<<<<<<< HEAD
Він щосекунди викликає `ReactDOM.render()` у функції зворотнього виклику [`setInterval()`](https://developer.mozilla.org/uk/docs/Web/API/WindowOrWorkerGlobalScope/setInterval).
=======
It calls [`ReactDOM.render()`](/docs/react-dom.html#render) every second from a [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504

>**Примітка:**
>
<<<<<<< HEAD
>На практиці, більшість React-додатків викликає `ReactDOM.render()` лише раз. У наступних розділах ми дізнаємось, як такий код інкапсулюється в [компоненти зі станом](/docs/state-and-lifecycle.html).
=======
>In practice, most React apps only call [`ReactDOM.render()`](/docs/react-dom.html#render) once. In the next sections we will learn how such code gets encapsulated into [stateful components](/docs/state-and-lifecycle.html).
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504
>
>Ми рекомендуємо вам не пропускати ці теми, тому що вони залежать одна від одної.

## React оновлює лише те, що необхідно {#react-only-updates-whats-necessary}

React DOM порівнює елемент і його дочірні елементи з попередніми та вносить в DOM тільки необхідні зміни для приведення DOM у бажаний стан.

Ви можете пересвідчитись в цьому, перевіривши [останній приклад](codepen://rendering-elements/update-rendered-element) за допомогою інструментів браузера:

![DOM-інспектор показує лише оновлення деталей](../images/docs/granular-dom-updates.gif)

Не дивлячись на те, що ми створили елемент, який щосекундно описує структуру дерева інтерфейсу користувача, лише текстовий вузол, вміст якого змінився, оновлюється за допомогою React DOM.

<<<<<<< HEAD
З нашого досвіду — роздуми про те, як інтерфейс користувача має виглядати в будь-який даний момент, а не про те, як він повинен змінюватись протягом часу, виключає цілий клас можливих помилок.
=======
In our experience, thinking about how the UI should look at any given moment, rather than how to change it over time, eliminates a whole class of bugs.
>>>>>>> fb382ccb13e30e0d186b88ec357bb51e91de6504
