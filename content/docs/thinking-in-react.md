---
id: thinking-in-react
title: Філософія React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

З нашої точки зору, React — це відмінний спосіб писати великі і швидкі JavaScript-додатки. Він дуже добре масшатабувався для нас у Facebook та Instagram.

Одна з особливостей React – це те, як він змушує думати про додатки в процесі їх створення. У цьому документі ми покажемо мисленний процес створення таблиці продуктів з пошуком за допомогою React.

## Почнемо з макета {#start-with-a-mock}

Уявіть, що у нас вже є JSON API і макет дизайну сайта. Він виглядає так:

![Мокап](../images/blog/thinking-in-react-mock.png)

Наш JSON API повертає дані, які виглядають наступним чином:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Крок 1: Розіб'ємо інтерфейс на компоненти {#step-1-break-the-ui-into-a-component-hierarchy}

Перше, що треба зробити – це уявити кордони кожного компонента (і подкомпонента) в макеті та дати їм імена. Якщо ви працюєте з дизайнерами, цілком можливо, що вони вже якось називають компоненти – вам варто поспілкуватися! Наприклад, шари Photoshop часто підказують імена для React-компонентів.

Але як вибрати, що є компонентом, а що ні? Це схоже на те, як ви вирішуєте, чи треба оголосити функцію або об'єкт. Можна застосувати [принцип єдиного обов'язку](https://uk.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF_%D1%94%D0%B4%D0%B8%D0%BD%D0%BE%D0%B3%D0%BE_%D0%BE%D0%B1%D0%BE%D0%B2'%D1%8F%D0%B7%D0%BA%D1%83): кожний компонент в ідеалі повинен займатися якимось одним завданням. Якщо функціонал компонента збільшується з плином часу, його слід розбити на більш дрібні подкомпоненти.

Багато інтерфейсів показують модель даних JSON. Тому добре побудована модель, як правило, вже відображає призначений для користувача інтерфейс (а значить, і структуру компонентів). Інтерфейс і моделі даних часто мають схожу інформаційну архітектуру, тому розділити інтерфейс на частини не складає труднощів. Просто розбийте його на компоненти, кожен з яких відображає частину моделі даних.

![Діаграма компонентів](../images/blog/thinking-in-react-components.png)

Ви побачите, що ми маємо п'ять компонентів у нашому простому додатку. Дані, які представляє кожен компонент, виділено курсивом.

  1. **`FilterableProductTable` (помаранчевий):** містить весь приклад
  2. **`SearchBar` (синій):** приймає всі *вхідні дані користувача*
  3. **`ProductTable` (зелений):** відображає та фільтрує *збір даних* на основі *вхідних даних користувача*
  4. **`ProductCategoryRow` (бірюзовий):** відображає заголовок для кожної *категорії*
  5. **`ProductRow` (червоний):** відображає рядок для кожного *продукту*

Зверніть увагу, що заголовок таблиці всередині `ProductTable` не є окремим компонентом. Відокремлювати його чи ні — це питання особистих уподобань. У цьому прикладі ми залишили його як частину `ProductTable`, оскільки він є малою частиною загального *збору даних*. Проте, якщо в майбутньому заголовок поповниться новими функціями(наприклад, можливістю сортувати товар), має сенс витягти його в самостійний компонент `ProductTableHeader`.

Тепер, коли ми визначили компоненти в нашому макеті, давайте розташуємо їх по порядку підпорядкованості. Це просто. Компоненти, які є частиною інших компонентів, в ієрархії відображаються як дочірні:

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Крок 2: Побудуємо статичну версію в React {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Приклад коду <a href="https://codepen.io/gaearon/pen/BwWzwm">Філософія React: Крок 2</a> на <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Тепер, коли всі компоненти розташовані в ієрархічному порядку, прийшов час реалізувати наш додаток. Найлегший спосіб – створити версію, яка використовує модель даних і рендерить інтерфейс, але не передбачає ніякої інтерактивності. Це корисно розділяти ці процеси. Написання статичної версії вимагає багато друкування і зовсім небагато мислення. З іншого боку, створення інтерактивності в додатку передбачає більш глибокий розумовий процес і лише частку рутинного друку. Ми розберемося, чому так виходить.

Щоб побудувати статичну версію додатка, яка буде показувати модель даних, нам потрібно створити компоненти, які використовують інші компоненти і передають дані через *пропси*. *Пропси* — це спосіб передачи даних від батьків до дочірних елементів. Якщо ви знайомі з поняттям *стану*, то для статичної версії це якраз те, що вам **використовувати не потрібно**. Стан передбачає собою дані, які змінюються з часом – інтерактивність. Так як ми працюємо над статичною версією додатка, то нам це не потрібно.

Написання коду можна почати як зверху вниз (з великого `FilterableProductTable`), так і знизу до верху (з маленького `ProductRow`). Простіші додатки зручніше починати з компонентів, що знаходяться вище за ієрархією. У більш складних додатках зручніше в першу чергу створювати і тестувати підкомпоненти.

Наприкінці цього кроку ви матимете бібліотеку компонентів, які можуть бути використовувані повторно. Так як це статична версія, то компоненти матимуть тільки методи `render()`. Компонент вище за ієрархією (`FilterableProductTable`) буде передавати модель даних через пропси. Якщо ви внесете зміни в базову модель даних і знову викличите `ReactDOM.render()`, то побачите зміни в інтерфейсі. Немає нічого складного у відостеженні змін та оновленні інтерфейсу. Завдяки **односторонньому потоку даних** (або *односторонньої прив'язці*) код працює швидко, але залишається зрозумілим.

Якщо у вас залишилися питання щодо виконання цього кроку, зверніться до [документації React](/docs/).

### Невеликий відступ: як пропси відрізняються від стану {#a-brief-interlude-props-vs-state}

Існує два типи "моделі" даних у React: пропси та стан. Важливо, щоб ви розуміли різницю між ними, в іншому випадку зверніться до [офіційної документації React](/docs/interactivity-and-dynamic-uis.html).

## Step 3: Identify The Minimal (but complete) Representation Of UI State {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

To make your UI interactive, you need to be able to trigger changes to your underlying data model. React makes this easy with **state**.

To build your app correctly, you first need to think of the minimal set of mutable state that your app needs. The key here is [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Figure out the absolute minimal representation of the state your application needs and compute everything else you need on-demand. For example, if you're building a TODO list, just keep an array of the TODO items around; don't keep a separate state variable for the count. Instead, when you want to render the TODO count, simply take the length of the TODO items array.

Think of all of the pieces of data in our example application. We have:

  * The original list of products
  * The search text the user has entered
  * The value of the checkbox
  * The filtered list of products

Let's go through each one and figure out which one is state. Simply ask three questions about each piece of data:

  1. Is it passed in from a parent via props? If so, it probably isn't state.
  2. Does it remain unchanged over time? If so, it probably isn't state.
  3. Can you compute it based on any other state or props in your component? If so, it isn't state.

The original list of products is passed in as props, so that's not state. The search text and the checkbox seem to be state since they change over time and can't be computed from anything. And finally, the filtered list of products isn't state because it can be computed by combining the original list of products with the search text and value of the checkbox.

So finally, our state is:

  * The search text the user has entered
  * The value of the checkbox

## Step 4: Identify Where Your State Should Live {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> on <a href="https://codepen.io">CodePen</a>.</p>

OK, so we've identified what the minimal set of app state is. Next, we need to identify which component mutates, or *owns*, this state.

Remember: React is all about one-way data flow down the component hierarchy. It may not be immediately clear which component should own what state. **This is often the most challenging part for newcomers to understand,** so follow these steps to figure it out:

For each piece of state in your application:

  * Identify every component that renders something based on that state.
  * Find a common owner component (a single component above all the components that need the state in the hierarchy).
  * Either the common owner or another component higher up in the hierarchy should own the state.
  * If you can't find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

Let's run through this strategy for our application:

  * `ProductTable` needs to filter the product list based on state and `SearchBar` needs to display the search text and checked state.
  * The common owner component is `FilterableProductTable`.
  * It conceptually makes sense for the filter text and checked value to live in `FilterableProductTable`

Cool, so we've decided that our state lives in `FilterableProductTable`. First, add an instance property `this.state = {filterText: '', inStockOnly: false}` to `FilterableProductTable`'s `constructor` to reflect the initial state of your application. Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as a prop. Finally, use these props to filter the rows in `ProductTable` and set the values of the form fields in `SearchBar`.

You can start seeing how your application will behave: set `filterText` to `"ball"` and refresh your app. You'll see that the data table is updated correctly.

## Step 5: Add Inverse Data Flow {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">See the Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> on <a href="https://codepen.io">CodePen</a>.</p>

So far, we've built an app that renders correctly as a function of props and state flowing down the hierarchy. Now it's time to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`.

React makes this data flow explicit to make it easy to understand how your program works, but it does require a little more typing than traditional two-way data binding.

If you try to type or check the box in the current version of the example, you'll see that React ignores your input. This is intentional, as we've set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.

Let's think about what we want to happen. We want to make sure that whenever the user changes the form, we update the state to reflect the user input. Since components should only update their own state, `FilterableProductTable` will pass callbacks to `SearchBar` that will fire whenever the state should be updated. We can use the `onChange` event on the inputs to be notified of it. The callbacks passed by `FilterableProductTable` will call `setState()`, and the app will be updated.

Though this sounds complex, it's really just a few lines of code. And it's really explicit how your data is flowing throughout the app.

## And That's It {#and-thats-it}

Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you're used to, remember that code is read far more than it's written, and it's extremely easy to read this modular, explicit code. As you start to build large libraries of components, you'll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)
