---
id: forwarding-refs
title: Перенаправлення Рефів
permalink: docs/forwarding-refs.html
---

Перенаправлення рефів — це техніка для автоматичної передачі [рефа](/docs/refs-and-the-dom.html) від компонента до одного із його дітей. Зазвичай не є необхідною для більшості компонентів додатку. Тим неменше, може бути корисним в деяких випадках, особливо в перевикористовуваних компонентах бібліотек. Найбільш поширені сценарії є описані внизу.

Перенаправлення рефів це техніка для автоматичної передачі рефів з батьківського компонента до одного з його дочірних компонентів.
Зазвичай це не є необхідним для більшості компонентів. Тим немеше в деяких випадка ця техніка може бути користною, особливо для перевикористовуваних компоненетів бібліотек. Найбільш поширені сценарії є описані внизу.

Тим неменше, може бути корисним для деяких видів компонентів, особливо для перевикористовуваних компоненетів бібліотек. Найбільш поширені сценарії є описані внизу.


Ref forwarding is a technique for automatically passing a [ref](/docs/refs-and-the-dom.html) through a component to one of its children. This is typically not necessary for most components in the application. However, it can be useful for some kinds of components, especially in reusable component libraries. The most common scenarios are described below.

## Перенаправлення рефів в DOM-компоненти {#forwarding-refs-to-dom-components}

## Forwarding refs to DOM components {#forwarding-refs-to-dom-components}

Розглянемо компонент `FancyButton`, який рендерить нативний DOM-елемент `button`:

Consider a `FancyButton` component that renders the native `button` DOM element:
`embed:forwarding-refs/fancy-button-simple.js`

React-компоненти приховують деталі своєї реалізації та результат рендеренгу. Також іншим компонентам, які використовують `FancyButton`, **зазвичай не потрібно** [доступатись до рефа](/docs/refs-and-the-dom.html) його внутрішнього DOM-елемента `button`. 
І це добре тим, що запобігає надмірній залежності компонентів від структури DOM-у один одного.

Це добре тим що не дає компонентам надмірно покладатись на структури DOM один одного.

React components hide their implementation details, including their rendered output. Other components using `FancyButton` **usually will not need to** [obtain a ref](/docs/refs-and-the-dom.html) to the inner `button` DOM element. This is good because it prevents components from relying on each other's DOM structure too much.

Хоча, така енкапсуляції є бажаною для компонентів, які описують певну закінчену частину додатка, наприклад, `FeedStory` або `Comment`, це може бути незручним для часто перевикористовуваних "дрібних" компонентів, таких як `FancyButton` та `MyTextInput`. Ці компоненти використовуються в додатку подібно як звичайний DOM `button` чи `input` і доступ до їхніх DOM-вузлів може бути необхідним для управління фокусом, виділенням або анімацією.

Although such encapsulation is desirable for application-level components like `FeedStory` or `Comment`, it can be inconvenient for highly reusable "leaf" components like `FancyButton` or `MyTextInput`. These components tend to be used throughout the application in a similar manner as a regular DOM `button` and `input`, and accessing their DOM nodes may be unavoidable for managing focus, selection, or animations.

**Перенаправлення рефів дає можливість певному компоненту взяти отриманий `ref` і передати його далі (іншими словами "перенаправити") до дочірнього компоненту.**

**Ref forwarding is an opt-in feature that lets some components take a `ref` they receive, and pass it further down (in other words, "forward" it) to a child.**

На прикладі нижче, `FancyButton` використовує `React.forwardRef`, щоб отримати переданий йому `ref` і перенаправити його в DOM `button`, який він рендерить:

In the example below, `FancyButton` uses `React.forwardRef` to obtain the `ref` passed to it, and then forward it to the DOM `button` that it renders:

`embed:forwarding-refs/fancy-button-simple-ref.js`

Таким чином, компоненти, що використовують `FancyButton` можуть отримати `ref` до внутрішнього DOM-вузла `button` і якщо потрібно, доступатись до DOM `button` подібно до того, якби він використовувався напряму.

і доступатись до нього, якщо потрібно — напряму, подібно як до DOM `button`.

This way, components using `FancyButton` can get a ref to the underlying `button` DOM node and access it if necessary—just like if they used a DOM `button` directly.

Тут покроково пояснено, що відбувається в прикладі вище:

1. Ми створюємо [React реф](/docs/refs-and-the-dom.html), викликаючи `React.createRef` і записуєм його в змінну `ref`.
1. Ми передаємо наш `ref` в `<FancyButton ref={ref}>`, вказуючи його як JSX-атрибут.
1. React передає `ref` в функцію `(props, ref) => ...` всередині `forwardRef` другим аргументом.
1. Ми перенаправляєм аргумент `ref` дальше до `<button ref={ref}>`, вказуючи його як JSX-атрибут.
1. Після привязки рефа, `ref.current` буде вказувати на DOM-вузол `<button>`.

Here is a step-by-step explanation of what happens in the above example:

1. We create a [React ref](/docs/refs-and-the-dom.html) by calling `React.createRef` and assign it to a `ref` variable.
1. We pass our `ref` down to `<FancyButton ref={ref}>` by specifying it as a JSX attribute.
1. React passes the `ref` to the `(props, ref) => ...` function inside `forwardRef` as a second argument.
1. We forward this `ref` argument down to `<button ref={ref}>` by specifying it as a JSX attribute.
1. When the ref is attached, `ref.current` will point to the `<button>` DOM node.

>Примітка
>
>Другий аргумент `ref` існує тільки тоді, коли ви визачаєте комонент викликом функції `React.forwardRef`. Звичайні функціональні або класові компоненти не отримують `ref` в якості аргумента чи пропси.
>
>Перенаправлення рефів не обмежуються DOM-компонентами. Ви також можете перенапарвити реф в екземпляр класового компонента.

>Note
>
>The second `ref` argument only exists when you define a component with `React.forwardRef` call. Regular function or class components don't receive the `ref` argument, and ref is not available in props either.
>
>Ref forwarding is not limited to DOM components. You can forward refs to class component instances, too.

## Замітка для розробників бібліотеки компонентів {#note-for-component-library-maintainers}

## Note for component library maintainers {#note-for-component-library-maintainers}

**Коли ви починаєте використовувати `forwardRef` в бібліотеці компонентів, ви повинні вважати це як несумісну зміну і випустити нову мажорну версію.** Це тому, що ваша бібліотека, скоріше за все, буде мати замітно іншу поведінку (такі як: те, на що вказує реф; які типи експортуються), в результаті може поламатись додаток або інші бібліотеки, що залежать від старої поведінки.

Також, по тій же причині, не рекомендується застосовувати `React.forwardRef` умовно, з перевіркою чи функція існує. Оскільки це міняє те, як ваша бібліотека буде поводитись, після того, як користувач бібліотеки обновить версію React.

**When you start using `forwardRef` in a component library, you should treat it as a breaking change and release a new major version of your library.** This is because your library likely has an observably different behavior (such as what refs get assigned to, and what types are exported), and this can break apps and other libraries that depend on the old behavior.

Conditionally applying `React.forwardRef` when it exists is also not recommended for the same reasons: it changes how your library behaves and can break your users' apps when they upgrade React itself.

## Перенаправлення рефів в компонентах вищого порядку {#forwarding-refs-in-higher-order-components}

Ця техніка також може бути особливо корисною в [компонентах вищого порядку](/docs/higher-order-components.html) (ще відомі, як КВП). Давайте почнемо з прикладу КВП, який виводить логи компонента в консоль:
`embed:forwarding-refs/log-props-before.js`

## Forwarding refs in higher-order components {#forwarding-refs-in-higher-order-components}

This technique can also be particularly useful with [higher-order components](/docs/higher-order-components.html) (also known as HOCs). Let's start with an example HOC that logs component props to the console:
`embed:forwarding-refs/log-props-before.js`

КВП "logProps" передає всі `props` до компонента, якого він обгортає, такщо результат рендеру буде такий самий. Наприклад, ми можемо використати цей КВП, щоб вивести всі пропси передані в наш компонент 'FancyButton':
`embed:forwarding-refs/fancy-button.js`

The "logProps" HOC passes all `props` through to the component it wraps, so the rendered output will be the same. For example, we can use this HOC to log all props that get passed to our "fancy button" component:
`embed:forwarding-refs/fancy-button.js`

Є одне застереження щодо прикладу вище: тут рефи не будуть передаватись. Це тому, що `ref` не є пропом. Подібно до `key`, React опрацьовує `ref` по-іншому. Якщо ви добавити реф до КВП, реф буде вказувати на зовнішній компонент-контейнер, а не на обгорнутий компонент.

There is one caveat to the above example: refs will not get passed through. That's because `ref` is not a prop. Like `key`, it's handled differently by React. If you add a ref to a HOC, the ref will refer to the outermost container component, not the wrapped component.

Це означає, що рефи призначені для компонента `FancyButton` насправді будуть привязані до компонента `LogProps`:
`embed:forwarding-refs/fancy-button-ref.js`

This means that refs intended for our `FancyButton` component will actually be attached to the `LogProps` component:
`embed:forwarding-refs/fancy-button-ref.js`

Нащастя, ми можем явно перенаправити реф до внутрішнього компонента `FancyButton` використовуючи `React.forwardRef` API. `React.forwardRef` приймає рендер функцію, яка отримує параметри `props` і `ref` та повертає React-вузол. Наприклад:
`embed:forwarding-refs/log-props-after.js`

Fortunately, we can explicitly forward refs to the inner `FancyButton` component using the `React.forwardRef` API. `React.forwardRef` accepts a render function that receives `props` and `ref` parameters and returns a React node. For example:
`embed:forwarding-refs/log-props-after.js`

## Відображення  ? імені в DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` отримує рендер фукнцію. React DevTools використовує цю функцію, щоб визначити, як відображати компонент перенаправлення рефа.

Наприклад, наступний компонент буде відображатись в DevTools, як "*ForwardRef*":

`embed:forwarding-refs/wrapped-component.js`

Якщо ви називаєте рендер функцію, DevTools відобразить також її ім'я ("*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

Ви можете навіть визначити функції властивість `displayName` і вказати в ньому, який компонент є обгорнутий.

`embed:forwarding-refs/customized-display-name.js`

## Displaying a custom name in DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` accepts a render function. React DevTools uses this function to determine what to display for the ref forwarding component.

For example, the following component will appear as "*ForwardRef*" in the DevTools:

`embed:forwarding-refs/wrapped-component.js`

If you name the render function, DevTools will also include its name (e.g. "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

You can even set the function's `displayName` property to include the component you're wrapping:

`embed:forwarding-refs/customized-display-name.js`
