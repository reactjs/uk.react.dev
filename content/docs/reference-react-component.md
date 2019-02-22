---
id: react-component
title: React.Component
layout: docs
category: Довідник
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

Ця сторінка містить API довідник для визначення класового компонента React. Ми припускаємо, що ви знайомі з фундаментальними концептами React, такими як [Компоненти та пропси](/docs/components-and-props.html), а також [Стан і життєвий цикл](/docs/state-and-lifecycle.html). Якщо ні, то спочатку ознайомтеся з ними.

## Огляд {#overview}

React дозволяє вам визначати компоненти як класи чи функції. Компоненти визначені як класи, наразі надають більше можливостей, які детально описані на цій сторінці. Щоб визначити класовий React-компонент, вам потрібно розширити `React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Привіт, {this.props.name}</h1>;
  }
}
```

Єдиний метод, який ви *зобов'язані* визначити в підкласі `React.Component` називається [`render()`](#render). Всі інші методи описані на цій сторінці є необов'язковими.

**Ми наполегливо рекомендуємо, щоб ви утримались від створення власних базових класів компонента.** В компонентах React, [повторне використання коду в першу чергу досягається за допомогою композиції, а не наслідування](/docs/composition-vs-inheritance.html).

>Примітка:
>
>React не змушує вас використовувати синтаксис класів ES6. Якщо ви намагаєтесь уникати його, натомість ви можете використовувати `create-react-class` модуль чи схожу власну абстракцію. Перегляньте [Використання React без ES6](/docs/react-without-es6.html) щоб дізнатися більше.

### Життєвий цикл компонента {#the-component-lifecycle}

Кожен компонент має декілька "методів життєвого циклу", які ви можете перевизначати, щоб запускати код в певний момент часу. **Ви можете використовувати [цю діаграму життєвого циклу](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) як шпаргалку.** В списку нижче найчастіше вживані меоди життєвого циклу виділені **напівжирним**. Решта існують лише для випадків, що трапляються відносно нечасто.

#### Монтування {#mounting}

Ці методи викликаються в наступному порядку, коли екземпляр компонента створюється і вставляється в DOM:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Примітка:
>
>Ці методи вважаються застарілими і ви маєте [уникати їх](/blog/2018/03/27/update-on-async-rendering.html) в новому коді:
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Оновлення {#updating}

Оновлення може бути спричиненим зміною пропсів чи стану. Ці методи викликаються в наступному порядку, коли компонент повторно рендериться:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Примітка:
>
>Ці методи вважаються застарілими і ви маєте [уникати їх](/blog/2018/03/27/update-on-async-rendering.html) в новому коді:
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Демонтування {#unmounting}

Цей метод викликається, коли компонент видаляється з DOM:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Обробка Помилок {#error-handling}

Наступні методи викликаються якщо виникла помилка під час рендерингу, в методі житєвого циклу чи конструкторі будь-якого дочірнього компонента.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Інші API {#other-apis}

Кожен компонент також надає деякі інші API:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Властивості класу {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Властивості екземпляру {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Довідник {#reference}

### Часто використовані методи життєвого циклу {#commonly-used-lifecycle-methods}

Методи в цьому розділі охоплюють переважну більшість випадків з якими ви зустрінетесь під час створення React-компонентів. **Для наглядної ілюстрації, перегляньте [цю діаграму життєвого циклу](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

Метод `render()` — єдиний необхідний метод в класових компонентах.

При виклику він перевіряє `this.props` та `this.state` і повертає один з наступних типів:

- **React-елементи.** Зазвичай створені за допомогою [JSX](/docs/introducing-jsx.html). Наприклад, `<div />` і `<MyComponent />` є React-елементами, які інструктують React відрендерити вузол DOM або інший компонент визначений користувачем, відповідно.
- **Масиви та фрагменти.** Дозволяють повернути декілька елементів під час рендерингу. Перегляньте документацію для [фрагментів](/docs/fragments.html), щоб дізнатися більше.
- **Портали**. Дозволють рендерити дочірні елементи в іншому піддереві DOM. Перегляньте документацію для [порталів](/docs/portals.html), щоб дізнатися більше.
- **Рядки і числа.** Будуть відрендерені як текстові вузли в DOM.
- **Логічні значення чи `null`**. Не рендерять нічого. (Існують, здебільшого, для підтримки шаблону `return test && <Child />`, де `test` — логічне значення.)

Функція `render()` має бути чистою, а це означає, що вона не змінює стан компонента, повертає однаковий результат при кожному виклиці і не взаємодіє з браузером напряму.

Якщо вам потрібно взаємодіяти з браузером, виконуйте необхідні дії в `componentDidMount()` чи інших методах життєвого циклу. Збереження `render()` чистим, робить компонент легшим для розуміння.

> Примітка
>
> `render()` не викличеться, якщо [`shouldComponentUpdate()`](#shouldcomponentupdate) повертає false.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**Якщо ви не ініціалізуєте стан і не прив'язуєте методи, вам не потрібно реалізовувати конструктор у вашому React-компоненті.**

Конструктор для React-компонента викликається до того, як він буде примонтований. При реалізації конструктора для підкласу `React.Component`, ви маєте викликати `super(props)` перед будь-яким іншим виразом. У іншому випадку, `this.props` буде невизначеним в конструкторі, що може призвести до помилок.

Як правило, у React конструктори використовуються лише для двох цілей:

* Ініціалізація [локального стану](/docs/state-and-lifecycle.html) шляхом присвоєння об'єкта `this.state`.
* Прив'язка методів [обробника подій](/docs/handling-events.html) до екземпляру.

**Не варто викликати `setState()`** в `constructor()`. Натомість, якщо компонент потребує використання локального стану, **присвойте початкове значення `this.state`** безпосередньо в конструкторі:

```js
constructor(props) {
  super(props);
  // Не викликайте this.setState() тут!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

Конструктор — єдине місце, де ви маєте присвоювати `this.state` напряму. У всіх інших методах для цього слід використовувати `this.setState()`.

Уникайте додавання будь-яких побічних ефектів чи підписок в конструкторі. Для таких випадків використовуйте `componentDidMount()`.

>Примітка
>
>**Уникайте копіювання пропсів в стан! Це поширена помилка:**
>
>```js
>constructor(props) {
>  super(props);
>  // Не робіть цього!
>  this.state = { color: props.color };
>}
>```
>
>Проблема в тім, що це є і надлишковим (ви можете просто використати `this.props.color` напряму), і приводить до помилок (оновлення пропу `color` не буде зафіксоване в стані).
>
>**Використовуйте даний підхід лише тоді, коли ви навмисно хочете ігнорувати оновлення пропу.** В такому випадку є сенс перейменувати проп в `initialColor` чи `defaultColor`. Потім ви можете змусити компонент "скинути" його внутрішній стан, [змінивши його `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key), за необхідності.
>
>Прочитайте нашу [статтю в блозі про уникнення похідного стану](/blog/2018/06/07/you-probably-dont-need-derived-state.html),щоб дізнатися що робити, якщо вам потрібен деякий стан, залежний від пропсів.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` викликається відразу після монтування компонента (вставки в DOM-дерево). Ініціалізація яка потребує DOM-вузли має знаходитись тут. Якщо вам потрібно завантажити дані з віддаленого сервера, це гарне місце для створення мережевого запиту.

Також цей метод — підходяще місце для налаштування підписок. Якщо ви це зробите, то не забудьте відписатись в `componentWillUnmount()`.

Ви **можете негайно викликати `setState()`** в `componentDidMount()`. Це запустить додатковий рендер, але це станеться до того, як браузер оновить екран. Це гарантує те, що навіть якщо `render()` в цьому випадку буде викликаний двічі, користувач не побачить проміжного стану. Обережно використовуйте цей підхід, тому що він часто приводить до проблем з продуктивністю. В більшості випадків, замість цього у вас має бути можливість присвоїти початковий стан у `constructor()`. Однак, це може бути необхідно для таких випадків як модальні вікна і спливаючі підказки, коли вам потрібно відрендерити щось, що залежить від розмірів та позиції вузла DOM.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` викликається відразу після оновлення. Цей метод не викликається під час першого рендеру.

Використовуйте це як можливість працювати з DOM при оновленні компонента. Також це хороше місце для мережевих запитів, якщо ви порівнюєте поточні пропси з попередніми (наприклад, мережевий запит може ббути не потрібним, якщо проп не змінився).

```js
componentDidUpdate(prevProps) {
  // Типове використання (не забудьте порівняти пропси):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

Ви **можете відразу викликати `setState()`** у `componentDidUpdate()`, але зверніь увагу, що цей виклик **має бути обгорнутий в умову** як у прикладі вище, інакше можна спричинити безкінечний цикл. Крім того, це спричинить додатковий повторний рендер який, хоч і не буде видимий користувачу, може вплинути на продуктивність компонента. Якщо ви намагаєтесь "дзеркально відобразити" певний стан в пропі, що приходять зверху, розгляньте безпосереднє використання пропу. Докладніше про те, [чому копіювання пропсів в стан спричиняє помилки](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

Якщо ваш компонент реалізує метод життєвого циклу `getSnapshotBeforeUpdate()` (що трапляється доволі рідко), значення, яке він повертає, буде передане третім "snapshot" параметром в `componentDidUpdate()`. В іншому випадку цей параметр буде невизначеним.

> Примітка
>
> `componentDidUpdate()` не викликається якщо [`shouldComponentUpdate()`](#shouldcomponentupdate) повертає false.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` викликається безпосередньо перед тим як компонент буде демонтовано і знищено. Виконуйте будь-яку необхідну очистку в цьому методі, таку як скасування таймерів, мережевих запитів чи підписок створених у `componentDidMount()`.

Ви **не повинні викликати `setState()`** у `componentWillUnmount()`, тому що компонент не буде повторно рендеритись. Як тільки екземпляр компонента буде демонтований, він ніколи не буде примонтованим знову.

* * *

### Рідковживані методи життєвого циклу {#rarely-used-lifecycle-methods}

Методи в цьому розділі відповідають малопоширеним випадкам використання. Вони є корисними час від часу, але швидше за все, більшість ваших компонентів не потребують жодного з них. **Ви можете побачити більшість наведених нижче методів на [цій діаграмі життєвого циклу](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) якщо натиснете прапорець "Show less common lifecycles" зверху сторінки.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Використовуйте `shouldComponentUpdate()`, щоб дати знати React, чи поточна зміна стану і пропсів не впливає на виведення компонента. Поведінка за замовчуванням полягає в повторному рендері при кожній зміні стану і в переважній більшості випадків ви маєте покладатись на поведінку за замовчуванням.

`shouldComponentUpdate()` викликається перед рендерингом при отриманні нових пропсів і стану. За замовчуванням має значення `true`. Цей метод не викликається при першому рендері чи коли використовується `forceUpdate()`.

Цей метод існує лише в якості **[оптимізації продуктивності](/docs/optimizing-performance.html).** Не покладайтесь на нього, щоб "запобігти" рендерингу, оскільки це може привести до помилок. **Розгляньте можливість використая вбудованого [`PureComponent`](/docs/react-api.html#reactpurecomponent)** замість написання власного `shouldComponentUpdate()`. `PureComponent` виконує поверхневе порівняння пропсів та стану і зменшує шанс того, що ви пропустите необхідне оновлення.

Якщо ви впевнені, що ви хочете реалізувати його власноруч, ви можете порівняти `this.props` із `nextProps` і `this.state` із `nextState`, і повернути `false`, щоб сказати React, що це оновлення можна пропустити. Зверніть увагу на те, що повернення `false` не запобігає повторному рендерингу дочірніх компонентів, коли *їх* стан змінюється.

Ми не рекомендуємо робити глибокі порівняння або використовувати `JSON.stringify()` у `shouldComponentUpdate()`. Це надзвичайно неефективно і негативно вплине на продуктивність.

Наразі, якщо `shouldComponentUpdate()` повертає `false`, тоді [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), і [`componentDidUpdate()`](#componentdidupdate) не будуть викликані. В майбутньому React може розглядати `shouldComponentUpdate()` як пораду, а не строгу вимогу, і повернення `false` може спричинити повторний рендеринг компоненту, як зазвичай.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` викликається безспосередньо перед викликом методу render, як при першому рендерингу, так і при всіх наступних оновленнях. Він має повернути об'єкт для оновлення стану або null, щоб не оновлювати нічого.

Цей метод існує для [малопширених випадків](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) коли стан залежить від змін в пропсах з часом. Наприклад, він може бути корисним для реалізації компоненту `<Transition>` котрий порівнює свої попередні і наступні дочірні елементи, щоб вирішити котрі з них потрібно анімувати для появи і зникнення.

Успадкування стану приводить до багатослівного коду і робить ваші компоненти важчими для розуміння.
[Впевніться, що ви знайомі з більш простими альтернативами:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* Якщо вам потрібно **виконати побічний ефект** (наприклад, вибірку даних чи анімацію) у відповідь на зміну пропсів, використовуйте натомість метод [`componentDidUpdate`](#componentdidupdate).

* Якщо вам потрібно **повторно обрахувати якісь дані лише коли проп змінюється**, [використовуйте натомість допоміжний метод мемоізації](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* Якщо ви хочете **"скинути" деякий стан при зміні пропу**, подумайте про те, щоб натомість зробити компонент [повністю контрольованим](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) або [повністю неконтрольованим з `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

Цей метод не має доступу до екземпляра компонента. Якщо ви бажаєте, ви можете повторно використовувати код між `getDerivedStateFromProps()` й іншими методами класу витягуючи чисті функції пропсів і стану компонента за межі класу.

Зверніть увагу, що цей метод викликається при *кожному* рендеринг, незалежно від причини. На відміну від `UNSAFE_componentWillReceiveProps`, котрий запускається лиш тоді, коли батьківський компонент викликає повторний рендеринг, а не як результат локального `setState`.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` викликається безпосередньо перед  тим, як останній відрендерений вивід буде зафіксовано, наприклад в DOM. Він дозволяє вашому компоненту захопити деяку інформацію з DOM (наприклад, позицію прокрутки) перед її можливою зміною. Будь-яке значення повернуте цим методом життєвого циклу, буде передане як параметр в `componentDidUpdate()`.

Цей випадок не поширений, але він може бути в UI, таких як ланцюжок повідомлень в чаті, який має оброблювати позицію прокрутки особливим чином.

Значення знімку (або `null`) має бути повернуте.

Наприклад:

`embed:react-component-reference/get-snapshot-before-update.js`

В наведених вище прикладах є важливим прочитати `scrollHeight` властивість у `getSnapshotBeforeUpdate`, тому що можуть виникати затримки між "рендер" етапами життєвого циклу (таких як `render`) і етапами "фіксації" життєвого циклу (такими як `getSnapshotBeforeUpdate` і `componentDidUpdate`).

* * *

### Запобіжники {#error-boundaries}

[Запобіжники](/docs/error-boundaries.html) — це React-компоненти, котрі перехоплюють помилки JavaScript будь-де в їхньому дереві дочірніх компонентів, логують їх і відображають резервний UI замість невалідного дерева компонентів. Запобіжники перехоплюють помилки протягом рендерингу, в методах життєвого циклу і конструкторах всього дерева під ними.

Класовий компонент стає запобіжником, якщо він визначає один (або обидва) з методів життєвого циклу — `static getDerivedStateFromError()` чи `componentDidCatch()`. Оновлення стану з цих методів дозволить вам перехопити необроблену помилку JavaScript в дереві нижче і відобразити резервний UI.

Використовуйте запобіжники тільки для відновлення від несподіваних виключних ситуацій; **не намагайтесь використовувати їх для управління потоком.**

Щоб дізнатися більше, перегляньте [*Обробка помилок в React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> Примітка
>
> Запобіжники перехоплюють лише помилки в компонентах у дереві **нижче** за них. Запобіжник не перехоплює помилки, що виникли в ньому.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

Цей метод життєвого циклу викликається після того, як компонент-нащадок згенерує помилку.
Як параметр він отримує помилку, що була згенерована і повинен повернути значення, щоб оновити стан.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Оновити стан, щоб наступний рендеринг показав резервний UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Ви можете рендерити будь-який власний резервний UI
      return <h1>Щось пішло не так.</h1>;
    }

    return this.props.children;
  }
}
```

> Примітка
>
> `getDerivedStateFromError()` викликається на "render" етапі, а отже побічні ефекти не допускаються.
Для таких випадків використовуйте `componentDidCatch()`.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

Цей метод життєвого циклу викликається після того, як компонент-нащадок згенерує помилку.
Ві отримує два параметри:

1. `error` - Помилка, яка була згенерована.
2. `info` - Об'єкт з ключем `componentStack`, який містить [інформацію про компонент, який згенерував помилку](/docs/error-boundaries.html#component-stack-traces).


`componentDidCatch()` викликається на етапі "фіксації", а отже побічні ефекти допустимі.
Він має використовуватись для таких речей, як логування помилок:

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Оновити стан, щоб наступний рендеринг показав резервний UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Приклад "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Ви можете рендерити будь-який власний резервний UI
      return <h1>Щось пішло не так.</h1>;
    }

    return this.props.children;
  }
}
```

> Примітка
>
> При виникненні помилки, ви можете рендерити резервний UI `componentDidCatch()` викликом `setState`, але така поведінка буде вважатися застарілою в наступному релізі.
> Натомість використовуйте `static getDerivedStateFromError()` для обробки резервного рендерингу.

* * *

### Legacy Lifecycle Methods {#legacy-lifecycle-methods}

The lifecycle methods below are marked as "legacy". They still work, but we don't recommend using them in the new code. You can learn more about migrating away from legacy lifecycle methods in [this blog post](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Note
>
> This lifecycle was previously named `componentWillMount`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

`UNSAFE_componentWillMount()` is invoked just before mounting occurs. It is called before `render()`, therefore calling `setState()` synchronously in this method will not trigger an extra rendering. Generally, we recommend using the `constructor()` instead for initializing state.

Avoid introducing any side-effects or subscriptions in this method. For those use cases, use `componentDidMount()` instead.

This is the only lifecycle method called on server rendering.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Note
>
> This lifecycle was previously named `componentWillReceiveProps`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

> Note:
>
> Using this lifecycle method often leads to bugs and inconsistencies
>
> * If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) lifecycle instead.
> * If you used `componentWillReceiveProps` for **re-computing some data only when a prop changes**, [use a memoization helper instead](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * If you used `componentWillReceiveProps` to **"reset" some state when a prop changes**, consider either making a component [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.
>
> For other use cases, [follow the recommendations in this blog post about derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` is invoked before a mounted component receives new props. If you need to update the state in response to prop changes (for example, to reset it), you may compare `this.props` and `nextProps` and perform state transitions using `this.setState()` in this method.

Note that if a parent component causes your component to re-render, this method will be called even if props have not changed. Make sure to compare the current and next values if you only want to handle changes.

React doesn't call `UNSAFE_componentWillReceiveProps()` with initial props during [mounting](#mounting). It only calls this method if some of component's props may update. Calling `this.setState()` generally doesn't trigger `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Note
>
> This lifecycle was previously named `componentWillUpdate`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

`UNSAFE_componentWillUpdate()` is invoked just before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.

Note that you cannot call `this.setState()` here; nor should you do anything else (e.g. dispatch a Redux action) that would trigger an update to a React component before `UNSAFE_componentWillUpdate()` returns.

Typically, this method can be replaced by `componentDidUpdate()`. If you were reading from the DOM in this method (e.g. to save a scroll position), you can move that logic to `getSnapshotBeforeUpdate()`.

> Note
>
> `UNSAFE_componentWillUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

## Other APIs {#other-apis-1}

Unlike the lifecycle methods above (which React calls for you), the methods below are the methods *you* can call from your components.

There are just two of them: `setState()` and `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

`setState()` does not always immediately update the component. It may batch or defer the update until later. This makes reading `this.state` right after calling `setState()` a potential pitfall. Instead, use `componentDidUpdate` or a `setState` callback (`setState(updater, callback)`), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the `updater` argument below.

`setState()` will always lead to a re-render unless `shouldComponentUpdate()` returns `false`. If mutable objects are being used and conditional rendering logic cannot be implemented in `shouldComponentUpdate()`, calling `setState()` only when the new state differs from the previous state will avoid unnecessary re-renders.

The first argument is an `updater` function with the signature:

```javascript
(state, props) => stateChange
```

`state` is a reference to the component state at the time the change is being applied. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from `state` and `props`. For instance, suppose we wanted to increment a value in state by `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Both `state` and `props` received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with `state`.

The second parameter to `setState()` is an optional callback function that will be executed once `setState` is completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

You may optionally pass an object as the first argument to `setState()` instead of a function:

```javascript
setState(stateChange[, callback])
```

This performs a shallow merge of `stateChange` into the new state, e.g., to adjust a shopping cart item quantity:

```javascript
this.setState({quantity: 2})
```

This form of `setState()` is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the current state, we recommend using the updater function form, instead:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

For more detail, see:

* [State and Lifecycle guide](/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

* * *

## Class Properties {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for undefined props, but not for null props. For example:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

If `props.color` is not provided, it will be set by default to `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

If `props.color` is set to null, it will remain null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName` {#displayname}

The `displayName` string is used in debugging messages. Usually, you don't need to set it explicitly because it's inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) for details.

* * *

## Instance Properties {#instance-properties-1}

### `props` {#props}

`this.props` contains the props that were defined by the caller of this component. See [Components and Props](/docs/components-and-props.html) for an introduction to props.

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

### `state` {#state}

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

If some value isn't used for rendering or data flow (for example, a timer ID), you don't have to put it in the state. Such values can be defined as fields on the component instance.

See [State and Lifecycle](/docs/state-and-lifecycle.html) for more information about the state.

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.
