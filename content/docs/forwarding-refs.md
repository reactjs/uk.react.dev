---
id: forwarding-refs
title: Перенаправлення рефів
permalink: docs/forwarding-refs.html
---

<<<<<<< HEAD
Перенаправлення рефів — це техніка для автоматичної передачі [рефа](/docs/refs-and-the-dom.html) від компонента до одного із його дітей. Для більшості компонентів, зазвичай, вона не є необхідною. Тим не менше, може бути корисною в деяких випадках, особливо якщо ви пишете бібліотеку. Давайте розглянемо найбільш поширені сценарії.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Manipulating the DOM with Refs](https://beta.reactjs.org/learn/manipulating-the-dom-with-refs)
> - [`forwardRef`](https://beta.reactjs.org/reference/react/forwardRef)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

Ref forwarding is a technique for automatically passing a [ref](/docs/refs-and-the-dom.html) through a component to one of its children. This is typically not necessary for most components in the application. However, it can be useful for some kinds of components, especially in reusable component libraries. The most common scenarios are described below.
>>>>>>> d4e42ab21f0cc7d8b79d1a619654e27c79e10af6

## Перенаправлення рефів у DOM-компоненти {#forwarding-refs-to-dom-components}

Розглянемо компонент `FancyButton`, який рендерить нативний DOM-елемент `button`:
`embed:forwarding-refs/fancy-button-simple.js`

React-компоненти приховують деталі своєї реалізації та результат рендеренгу. Також іншим компонентам, які використовують `FancyButton`, **зазвичай не потрібен** [доступ до рефа](/docs/refs-and-the-dom.html) його внутрішнього DOM-елементу `button`. І це добре тим, що це запобігає надмірній залежності компонентів від структури DOM-у один одного.

Хоча, така інкапсуляція є бажаною для компонентів, які описують певну закінчену частину додатка, наприклад, `FeedStory` або `Comment`, це може бути незручним для часто перевикористовуваних "дрібних" компонентів, таких як `FancyButton` та `MyTextInput`. Ці компоненти використовуються в додатку подібно до звичайних DOM `button` чи `input` і доступ до їхніх DOM-вузлів може бути необхідним для управління фокусом, виділенням або анімацією.

**Перенаправлення рефів дає можливість певному компоненту взяти отриманий реф і передати його далі (іншими словами "перенаправити") до дочірнього компонента.**

У прикладі нижче, `FancyButton` використовує `React.forwardRef`, щоб отримати переданий йому `ref` і перенаправити його в DOM `button`, який він рендерить:

`embed:forwarding-refs/fancy-button-simple-ref.js`

Таким чином, компоненти, що використовують `FancyButton` можуть отримати реф внутрішнього DOM-вузла `button` і якщо потрібно, мати доступ до DOM `button` подібно до того, якби він використовувався напряму.

Розглянемо цей приклад покроково:

1. Ми створюємо [React-реф](/docs/refs-and-the-dom.html), викликаючи `React.createRef` і записуєм його у змінну `ref`.
1. Ми передаємо наш `ref` у `<FancyButton ref={ref}>`, вказуючи його як JSX-атрибут.
1. React передає `ref` у функцію `(props, ref) => ...` всередині `forwardRef` другим аргументом.
1. Ми перенаправляєм аргумент `ref` далі у `<button ref={ref}>`, вказуючи його як JSX-атрибут.
1. Після прив'язки рефа, `ref.current` буде вказувати на DOM-вузол `<button>`.

>Примітка
>
>Другий аргумент `ref` існує тільки тоді, коли ви визначаєте компонент як виклик функції `React.forwardRef`. Звичайні функціональні або класові компоненти не отримують `ref` у якості аргумента чи пропса.
>
>Перенаправлення рефів не обмежуються DOM-компонентами. Ви також можете перенаправити реф у екземпляр класового компонента.

## Примітка для розробників бібліотек компонентів {#note-for-component-library-maintainers}

**Коли ви починаєте використовувати `forwardRef` у бібліотеці компонентів, ви повинні вважати це як несумісну зміну і випустити нову мажорну версію.** Причина цього в тому, що, швидше за все, компонент буде мати помітно іншу поведінку (наприклад: зміниться тип експортованих даних і елемент, до якого прив'язаний реф), в результаті чого додатки та інші бібліотеки, що покладаються на стару поведінку, перестануть працювати.

З цієї ж причини ми не рекомендуємо викликати `React.forwardRef` умовно (тобто перевіряючи чи функція існує). Це змінить поведінку вашої бібліотеки і додатки ваших користувачів можуть перестати працювати при оновленні версії React.

## Перенаправлення рефів у компоненти вищого порядку {#forwarding-refs-in-higher-order-components}

Ця техніка також може бути особливо корисною у [компонентах вищого порядку](/docs/higher-order-components.html) (ще відомі, як КВП або англ. — HOC). Давайте почнемо з прикладу КВП, який виводить пропси компонента в консоль:
`embed:forwarding-refs/log-props-before.js`

КВП "logProps" передає всі `props` до компонента, який він обгортає, так що результат рендеру буде такий самий. Наприклад, ми можемо використати цей КВП, щоб вивести усі пропси передані в наш компонент `FancyButton`:
`embed:forwarding-refs/fancy-button.js`

Щодо прикладу вище є одне застереження: тут рефи не будуть передаватись. Це тому, що `ref` не є пропом. React опрацьовує `ref` по-іншому, подібно до `key`. Якщо ви додасте реф до КВП, реф буде вказувати на зовнішній компонент-контейнер, а не на обгорнутий компонент.

Це означає, що рефи призначені для компонента `FancyButton` насправді будуть прив'язані до компонента `LogProps`:
`embed:forwarding-refs/fancy-button-ref.js`

На щастя, ми можемо явно перенаправити реф до внутрішнього компонента `FancyButton`, використовуючи `React.forwardRef` API. `React.forwardRef` приймає функцію рендеринга, яка отримує параметри `props` і `ref` та повертає React-вузол. Наприклад:
`embed:forwarding-refs/log-props-after.js`

## Відображення іншого імені в DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` отримує фукнцію рендерингу. React DevTools використовує цю функцію, щоб визначити, як відображати компонент перенаправлення рефа.

Наприклад, наступний компонент буде відображатись в DevTools, як "*ForwardRef*":

`embed:forwarding-refs/wrapped-component.js`

Якщо надати ім'я функції рендеринга, то воно з'явиться у назві компонента в DevTools (наприклад, "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

Ви можете навіть додати властивість до функції `displayName` і вказати в ній, який саме компонент обгорнутий.

`embed:forwarding-refs/customized-display-name.js`
