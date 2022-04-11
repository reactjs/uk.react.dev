---
id: react-api
title: React API верхнього рівня
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React` є точкою входу у бібліотеку React. Якщо ви завантажуєте React з тега `<script>`, API верхнього рівня доступні в глобальному об'єкті `React`. Якщо ви використовуєте ES6 разом із npm, ви можете написати `import React from 'react'`, якщо ES5 -- `var React = require('react')`.

## Огляд {#overview}

### Компоненти {#components}

React-компоненти дозволяють розділити інтерфейс користувача на незалежні частини, які можна використовувати повторно та працювати з кожною окремо. Компоненти у React можуть бути визначені за допомогою підкласу `React.Component` або `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

Якщо ви не використовуєте ES6 класи, замість них ви можете використовувати модуль `create-react-class`. Для додаткової інформації, читайте [Використання React без ES6](/docs/react-without-es6.html).

React-компоненти також можуть бути визначені як функції, що обгорнуті у:

- [`React.memo`](#reactmemo)

### Створення React-елементів {#creating-react-elements}

Ми рекомендуємо [використання JSX](/docs/introducing-jsx.html) для опису того, як повинен виглядати ваш інтерфейс користувача. Кожен JSX-елемент — це просто синтаксичний цукор для виклику [`React.createElement()`](#createelement). Вам не доведеться використовувати наступні методи безпосередньо, якщо ви використовуєте JSX.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

Для додаткової інформації, дивіться [Використання React без JSX](/docs/react-without-jsx.html).

### Трансформація елементів {#transforming-elements}

`React` надає декілька API для маніпулювання елементами:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Фрагменти {#fragments}

`React` також надає компонент для рендерингу множини елементів без обгортки.

- [`React.Fragment`](#reactfragment)

### Довідки {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Затримка {#suspense}

Затримка дозволяє компонентам "почекати" чого-небудь перед рендерингом. На даний час існує тільки один спосіб використання затримки: [динамічне завантаження компонентів із `React.lazy`](/docs/code-splitting.html#reactlazy). В майбутньому варіантів застосування затримки стане більше, наприклад, вибірка даних.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

<<<<<<< HEAD
### Хуки {#hooks}
=======
### Transitions {#transitions}

*Transitions* are a new concurrent feature introduced in React 18. They allow you to mark updates as transitions, which tells React that they can be interrupted and avoid going back to Suspense fallbacks for already visible content.

- [`React.startTransition`](#starttransition)
- [`React.useTransition`](/docs/hooks-reference.html#usetransition)

### Hooks {#hooks}
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

*Хуки* є новим доповненням у React 16.8. Вони дозволяють вам використовувати стан та інші React особливості без написання класу. Хукам [присвячено секцію в документації](/docs/hooks-intro.html) та окремий API довідник:

- [Основні хуки](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [Додаткові хуки](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)
  - [`useDeferredValue`](/docs/hooks-reference.html#usedeferredvalue)
  - [`useTransition`](/docs/hooks-reference.html#usetransition)
  - [`useId`](/docs/hooks-reference.html#useid)
- [Library Hooks](/docs/hooks-reference.html#library-hooks)
  - [`useSyncExternalStore`](/docs/hooks-reference.html#usesyncexternalstore)
  - [`useInsertionEffect`](/docs/hooks-reference.html#useinsertioneffect)

* * *

## Довідка {#reference}

### `React.Component` {#reactcomponent}

`React.Component` є базовим класом для React-компонентів, коли вони визначені за допомогою [ES6 класів](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Classes):

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Привіт, {this.props.name}</h1>;
  }
}
```

Дивіться [довідник React.Component API](/docs/react-component.html) для пошуку методів та властивостей, що пов'язані із базовим класом `React.Component`.

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` подібний до [`React.Component`](#reactcomponent). Різниця між ними тільки в тому, що [`React.Component`](#reactcomponent) не реалізує [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), а `React.PureComponent` реалізує його через поверхове порівняння пропсів та стану.

Якщо метод `render()` компонента React відображає той самий результат з тими самими пропсами та станом, ви можете використовувати `React.PureComponent` для підвищення продуктивності у деяких випадках.

> Примітка
>
> Метод `shouldComponentUpdate()` класу `React.PureComponent` тільки поверхово порівнює об'єкти. Якщо вони містять складні структури даних, це може призвести до помилкових спрацьовувань під час більш глибокого порівняння. Розширюйте `PureComponent` тільки тоді, коли ви очікуєте на прості пропси та стан, або використовуйте [`forceUpdate()`](/docs/react-component.html#forceupdate), коли ви знаєте, що структури даних змінилися. Або розгляньте можливісь застосування [незмінних об'єктів](https://facebook.github.io/immutable-js/) для спрощення швидкого порівняння вкладених даних.
>
> Крім того, метод `shouldComponentUpdate()` класу `React.PureComponent` пропускає оновлення пропсів для всього піддерева компоненту. Впевніться, що всі дочірні компоненти також "чисті".

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* рендер з використанням пропсів */
});
```

`React.memo` є [компонентом вищого порядку](/docs/higher-order-components.html).

Якщо ваш компонент відображає той самий результат з тими самими пропсами та станом, ви можете обгорнути його у виклик `React.memo` для підвищення продуктивності в деяких випадках шляхом запам'ятовування результату. Це означає, що React пропустить рендеринг компоненту та повторно використає останній результат рендерингу.

<<<<<<< HEAD
`React.memo` тільки перевіряє чи змінилися пропси. Якщо ваша функція, згорнута у `React.memo`, має [`useState`](/docs/hooks-state.html) або [`useContext`](/docs/hooks-reference.html#usecontext) хуки в своїй імплементації, вона все ще буде ререндеритися при зміні стана або контекста.
=======
`React.memo` only checks for prop changes. If your function component wrapped in `React.memo` has a [`useState`](/docs/hooks-state.html), [`useReducer`](/docs/hooks-reference.html#usereducer) or [`useContext`](/docs/hooks-reference.html#usecontext) Hook in its implementation, it will still rerender when state or context change.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

За замовчуванням він тільки поверхово порівнює складні об'єкти, що знаходяться в об'єкті пропсів. Якщо ви хочете контролювати процес порівняння, ви також можете надати користувальницьку функцію для порівняння помістивши її другим аргументом.

```javascript
function MyComponent(props) {
  /* рендер з використанням пропсів */
}
function areEqual(prevProps, nextProps) {
  /*
  повертає true, якщо передавання nextProps для рендерингу
  поверне той самий результат, що і передавання prevProps,
  інакше повертає false
  */
}
export default React.memo(MyComponent, areEqual);
```

Цей метод існує тільки для **[оптимізації продуктивності](/docs/optimizing-performance.html).** Не покладайтеся на нього, щоб "запобігти" рендерингу, бо це може призвести до помилок.

> Примітка
>
> На відміну від методу [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) для компонентів-класів, функція `areEqual` повертає `true`, якщо пропси рівні і `false`, якщо пропси не рівні. Це інверсія `shouldComponentUpdate`.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Створює та повертає новий [React-елемент](/docs/rendering-elements.html) вказаного типу. Аргумент типу може бути або рядком тегу (наприклад, `'div'` або `'span'`), або типом [компоненту React](/docs/components-and-props.html) (клас чи функція), або [фрагментом React](#reactfragment).

Код написаний за допомогою [JSX](/docs/introducing-jsx.html) буде конвертований у виклики `React.createElement()`. Зазвичай ви не викликаєте `React.createElement()` безпосередньо, коли використовуєте JSX. Для того, щоб дізнатися більше, читайте [React без JSX](/docs/react-without-jsx.html).

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [config],
  [...children]
)
```

<<<<<<< HEAD
Клонує та повертає новий елемент React, використовуючи `element` як зразок. Отриманий елемент буде містити пропси оригінального елемента з новими властивостями, об'єднаними поверхово. Нові потомки замінять існуючих. `key` і `ref` з оригінального елемента будуть збережені.
=======
Clone and return a new React element using `element` as the starting point. `config` should contain all new props, `key`, or `ref`. The resulting element will have the original element's props with the new props merged in shallowly. New children will replace existing children. `key` and `ref` from the original element will be preserved if no `key` and `ref` present in the `config`.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

`React.cloneElement()` майже рівнозначний:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

<<<<<<< HEAD
Проте, він також зберігає посилання. Це означає, що якщо ви отримаєте потомка з атрибутом `ref`, ви не зможете випадково вкрасти його у свого предка. Ви отримаєте той самий `ref`, доданий до вашого нового елемента.
=======
However, it also preserves `ref`s. This means that if you get a child with a `ref` on it, you won't accidentally steal it from your ancestor. You will get the same `ref` attached to your new element. The new `ref` or `key` will replace old ones if present.
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

Цей API був впроваджений як заміна застарілого `React.addons.cloneWithProps()`.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Повертає функцію, яка створює React-елементи вказаного типу. Подібно до [`React.createElement()`](#createelement), аргумент типу може бути або рядком тегу (наприклад, `'div'` або `'span'`), або типом [компоненту React](/docs/components-and-props.html) (клас чи функція), або [фрагментом React](#reactfragment).

Цей помічник вважається застарілим, тому ми рекомендуємо використовувати або JSX, або безпосередньо `React.createElement()`.

Зазвичай ви не викликаєте `React.createFactory()` безпосередньо, коли використовуєте JSX. Для того, щоб дізнатися більше, дивіться [React без JSX](/docs/react-without-jsx.html).

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Перевіряє чи об'єкт є елементом React. Повертає `true` або `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` надає утиліти для роботи з непрозорою структурою даних `this.props.children`.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Викликає функцію для кожного дочірнього елемента, що міститься в `children` із `this` встановленим у `thisArg`. Якщо `children` є масивом, він буде пройдений та функція виконається для кожного його елемента. Якщо `children` дорівнює `null` або `undefined`, функція поверне `null` або `undefined`, а не масив.

> Примітка
>
> Якщо `children` — це компонент `Fragment`, він буде розглядатися як один потомок і не буде пройдений.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Подібний до [`React.Children.map()`](#reactchildrenmap), але не повертає масив.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Повертає загальну кількість компонентів у `children`, що дорівнює кількості викликів функції зворотнього виклику, яка передана у `map` чи `forEach`.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Перевіряє чи `children` має тільки один дочірній елемент (React-елемент) і повертає його. В іншому випадку цей метод спричиняє помилку.

> Примітка:
>
>`React.Children.only()` не приймає значення, яке повертає метод [`React.Children.map()`](#reactchildrenmap), бо воно є масивом, а не елементом React.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Повертає непрозору структуру даних `children` як плоский масив з ключами, призначеними для кожного потомка. Це корисно, якщо ви хочете маніпулювати колекціями потомків у ваших рендер-методах, особливо якщо ви хочете змінити порядок або обрізати `this.props.children`, перш ніж передавати його далі.

> Примітка:
>
> `React.Children.toArray()` змінює ключі для збереження семантики вкладених масивів під час вирівнювання списку потомків. Тобто, `toArray` додає префікс до кожного ключа у повернутому масиві, тому ключ кожного елемента охоплює вхідний масив, що його містить.

* * *

### `React.Fragment` {#reactfragment}

Компонент `React.Fragment` доволяє вам повертати множину елементів у методі `render()` без створення додаткового DOM елемента:

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

Крім того, ви можете використовувати скорочений синтаксис `<></>`. Для отримання додаткової інформації, дивіться [React v16.2.0: Покращена підтримка для фрагментів](/blog/2017/11/28/react-v16.2.0-fragment-support.html).


### `React.createRef` {#reactcreateref}

`React.createRef` створює [посилання](/docs/refs-and-the-dom.html), яке може бути додане до елемента React через ref атрибут.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` створює React-компонент, що передає атрибут [ref](/docs/refs-and-the-dom.html), який він отримав, іншому компоненту, розташованому нижче у дереві. Цей прийом не дуже поширений, але він особливо корисний у двох випадках:

* [Передавання посилань DOM компонентам](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Передавання посилань у компоненти вищого порядку](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` приймає рендер-функцію як аргумент. React викличе цю функцію з двома аргументами `props` і `ref`. Ця функція повинна повертати вузол React.

`embed:reference-react-forward-ref.js`

У прикладі вище, React передає посилання `ref`, передане елементу `<FancyButton ref={ref}>`, у рендер-функцію всередині виклику `React.forwardRef` в якості другого аргументу. Потім ця функція передає посилання `ref` у елемент `<button ref={ref}>`.

В результаті, коли React додасть посилання, `ref.current` буде посилатися беспосередньо на DOM елемент `<button>`.

Для отримання додаткової інформації, дивіться розділ про [передавання посилань](/docs/forwarding-refs.html).

### `React.lazy` {#reactlazy}

`React.lazy()` дає вам змогу визначити компонент, що динамічно завантажується. Це допомагає зменшити розмір бандлу шляхом затримки рендерингу компонентів, які не використовуються під час початкового рендерингу.

Більш детальіше ви можете дізнатися у розділі документації про [розділення коду](/docs/code-splitting.html#reactlazy), а також прочитавши [дану статтю](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d).

```js
// Цей компонент завантажується динамічно
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Зверніть увагу, що рендеринг `lazy` компонентів потребує наявності компонента `<React.Suspense>`, розташованого вище у дереві рендерингу. Таким чином ви можете вказати індикатор завантаження.

<<<<<<< HEAD
> **Примітка**
>
> Використання `React.lazy` з динамічним імпортом вимагає підтримки промісів від вашого JS оточення. Для IE11 та нижче, потрібно використовувати polyfill.

### `React.Suspense` {#reactsuspense}

`React.Suspense` дозволяє вам вказати індикатор завантаження у випадку, якщо деякі компоненти у дереві нижче ще не готові до рендерингу. Сьогодні, ледаче завантаження компонентів — це **єдиний** варіант використання, що підтримується `<React.Suspense>`:
=======
### `React.Suspense` {#reactsuspense}

`React.Suspense` lets you specify the loading indicator in case some components in the tree below it are not yet ready to render. In the future we plan to let `Suspense` handle more scenarios such as data fetching. You can read about this in [our roadmap](/blog/2018/11/27/react-16-roadmap.html).

Today, lazy loading components is the **only** use case supported by `<React.Suspense>`:
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b

```js
// Цей компонент завантажується динамічно
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Відображає <Spinner> поки OtherComponent завантажується
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Це задокументовано у розділі про [розділення коду](/docs/code-splitting.html#reactlazy). Зауважте, що `lazy` компоненти можуть бути розташовані глибоко всередині дерева `Suspense` -- йому не обов'язково обгортати кожнен з них. Найкраще розміщувати `<Suspense>` там, де ви хочете бачити індикатор завантаження, але `lazy()` використовувати всюди, де ви хочете розділити код.

<<<<<<< HEAD
Хоча це і не підтримується на даний час, в майбутньому ми плануємо дати можливість `Suspense` обробляти більше сценаріїв, наприклад, вибірку даних. Ви можете прочитати про це у [нашому плані дій](/blog/2018/11/27/react-16-roadmap.html).

>Примітка:
>
>`ReactDOMServer` не підтримує `React.lazy()` та `<React.Suspense>`. Це відоме обмеження буде вирішено в майбутньому.
=======
> Note
> 
> For content that is already shown to the user, switching back to a loading indicator can be disorienting. It is sometimes better to show the "old" UI while the new UI is being prepared. To do this, you can use the new transition APIs [`startTransition`](#starttransition) and [`useTransition`](/docs/hooks-reference.html#usetransition) to mark updates as transitions and avoid unexpected fallbacks.

#### `React.Suspense` in Server Side Rendering {#reactsuspense-in-server-side-rendering}
During server side rendering Suspense Boundaries allow you to flush your application in smaller chunks by suspending.
When a component suspends we schedule a low priority task to render the closest Suspense boundary's fallback. If the component unsuspends before we flush the fallback then we send down the actual content and throw away the fallback.

#### `React.Suspense` during hydration {#reactsuspense-during-hydration}
Suspense boundaries depend on their parent boundaries being hydrated before they can hydrate, but they can hydrate independently from sibling boundaries. Events on a boundary before its hydrated will cause the boundary to hydrate at 
a higher priority than neighboring boundaries. [Read more](https://github.com/reactwg/react-18/discussions/130)

### `React.startTransition` {#starttransition}

```js
React.startTransition(callback)
```
`React.startTransition` lets you mark updates inside the provided callback as transitions. This method is designed to be used when [`React.useTransition`](/docs/hooks-reference.html#usetransition) is not available.

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transitions will not show a fallback for re-suspended content, allowing the user to continue interacting while rendering the update.
>
> `React.startTransition` does not provide an `isPending` flag. To track the pending status of a transition see [`React.useTransition`](/docs/hooks-reference.html#usetransition).
>>>>>>> 84ad3308338e2bb819f4f24fa8e9dfeeffaa970b
