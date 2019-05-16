---
id: faq-functions
title: Передача функцій компонентам
permalink: docs/faq-functions.html
layout: docs
category: FAQ
---

### Як передати обробник події (наприклад, onClick) компоненту? {#how-do-i-pass-an-event-handler-like-onclick-to-a-component}

Передавайте обробник події та інші функції через пропси дочірнім компонентам:

```jsx
<button onClick={this.handleClick}>
```

Якщо ви хочете отримати доступ до батьківського компонента через обробник, вам потрібно прив'язати функцію до екземпляру компонента (див. нижче).

### Як прив'язати функцію до екземпляру компонента? {#how-do-i-bind-a-function-to-a-component-instance}

У залежності від того, який синтаксис і підхід до створення компонентів ви використовуєте, існує декілька способів впевнитись, що функції мають доступ до таких атрибутів компонента, як `this.props` та `this.state`.

#### Прив'язка в конструкторі (ES2015) {#bind-in-constructor-es2015}

```jsx
class Foo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('Натискання відбулось');
  }
  render() {
    return <button onClick={this.handleClick}>Натисни мене</button>;
  }
}
```

#### Прив'язка у властивостях класу (пропозиція-кандидат) {#class-properties-stage-3-proposal}

```jsx
class Foo extends Component {
  // Примітка: даний синтаксис знаходиться на стадії розробки і ще не стандартизований.
  handleClick = () => {
    console.log('Натискання відбулось');
  }
  render() {
    return <button onClick={this.handleClick}>Натисни мене</button>;
  }
}
```

#### Прив'язка в методі render() {#bind-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Натискання відбулось');
  }
  render() {
    return <button onClick={this.handleClick.bind(this)}>Натисни мене</button>;
  }
}
```

>**Примітка:**
>
>Використання `Function.prototype.bind` у render() створює нову функцію при кожному рендері компонента, що може вплинути на продуктивність (див. нижче).

#### Стрілкова функція у render() {#arrow-function-in-render}

```jsx
class Foo extends Component {
  handleClick() {
    console.log('Натискання відбулось');
  }
  render() {
    return <button onClick={() => this.handleClick()}>Натисни мене</button>;
  }
}
```

>**Примітка:**
>
>Використання стрілкової функції створює нову функцію при кожному рендері компонента, що може порушувати оптимізації, які використовують суворе порівняння для визначення ідентичності.

### Чи можна використовувати стрілкові функції у методі render()? {#is-it-ok-to-use-arrow-functions-in-render-methods}

Загалом, так. Зазвичай це найпростіший спосіб передати параметри через функції зворотнього виклику.

Якщо у вас виникли проблеми з продуктивністю — оптимізуйте!

### Навіщо взагалі потрібна прив'язка? {#why-is-binding-necessary-at-all}

У JavaScript наступні фрагменти коду **не** рівноцінні:

```js
obj.method();
```

```js
var method = obj.method;
method();
```

Прив'язка гарантує, що другий фрагмент працюватиме так само, як і перший.

У React, як правило, слід прив'язувати тільки ті методи, які ви плануєте *передати* іншим компонентам. Наприклад, `<button onClick={this.handleClick}>` передає `this.handleClick`, тому його слід прив'язати. Утім, метод `render` та методи життєвого циклу прив'язувати не обов'язково, так як ми не передаємо їх через інші компоненти.

[Ознайомтесь зі статтею Єхуди Катц](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), у якій більш детально пояснюється, що таке прив'язка і як працюють функції в JavaScript.

### Чому моя функція викликається кожного разу при рендері компонента? {#why-is-my-function-being-called-every-time-the-component-renders}

Впевніться, що ви не _викликаєте функцію_, коли передаєте її компоненту:

```jsx
render() {
  // Неправильно: замість посилання функція handleClick була викликана!
  return <button onClick={this.handleClick()}>Натисни мене</button>
}
```

Замість цього *передайте саму функцію* (без дужок):

```jsx
render() {
  // Правильно: handleClick передається як посилання!
  return <button onClick={this.handleClick}>Натисни мене</button>
}
```

### Як передати параметри до обробника події чи функції зворотнього виклику? {#how-do-i-pass-a-parameter-to-an-event-handler-or-callback}

Щоб передати параметри до обробника події, обгорніть його у стрілкову функцію:

```jsx
<button onClick={() => this.handleClick(id)} />
```

Дана дія рівноцінна до використання `.bind`:

```jsx
<button onClick={this.handleClick.bind(this, id)} />
```

#### Приклад: Передача параметрів з використанням стрілкових функцій {#example-passing-params-using-arrow-functions}

```jsx
const A = 65 // ASCII-код символу

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }
  handleClick(letter) {
    this.setState({ justClicked: letter });
  }
  render() {
    return (
      <div>
        Натиснута літера: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} onClick={() => this.handleClick(letter)}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

#### Приклад: Передача параметрів з використанням атрибутів даних {#example-passing-params-using-data-attributes}

Як альтернативу, ви можете використовувати DOM API для збереження даних, необхідних обробникам подій. Розгляньте цей підхід, якщо вам потрібно оптимізувати велику кількість елементів чи використати дерево візуалізації, що покладається на React.PureComponent для перевірки на рівність.

```jsx
const A = 65 // AASCII-код символу

class Alphabet extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      justClicked: null,
      letters: Array.from({length: 26}, (_, i) => String.fromCharCode(A + i))
    };
  }

  handleClick(e) {
    this.setState({
      justClicked: e.target.dataset.letter
    });
  }

  render() {
    return (
      <div>
        Натиснута літера: {this.state.justClicked}
        <ul>
          {this.state.letters.map(letter =>
            <li key={letter} data-letter={letter} onClick={this.handleClick}>
              {letter}
            </li>
          )}
        </ul>
      </div>
    )
  }
}
```

### Як попередити занадто швидкий чи занадто частий виклик функції? {#how-can-i-prevent-a-function-from-being-called-too-quickly-or-too-many-times-in-a-row}

Якщо ви використовуєте обробники подій, такі як `onClick` чи `onScroll`, і хочете попередити швидке спрацьовування функцій зворотнього виклику, ви можете обмежити швидкість виконання даної функції. Для цього ви можете використати:

- **тротлінг (throttling)**: вибіркові зміни, залежні від частоти, що базується на часі (напр. [`_.throttle`](https://lodash.com/docs#throttle))
- **дебаунсинг (debouncing)**: зміни, задіяні після певного періоду бездіяльності (напр. [`_.debounce`](https://lodash.com/docs#debounce))
- **`тротлінг за допомогою requestAnimationFrame`**: вибіркові зміни, засновані на [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) (напр. [`raf-schd`](https://github.com/alexreardon/raf-schd))

Погляньте на [візуалізацію](http://demo.nimius.net/debounce_throttle/),  що порівнює функції `throttle` та `debounce`.

> Примітка:
>
> `_.debounce`, `_.throttle` та `raf-schd` передбачають метод `cancel` для скасування відкладених функцій зворотнього виклику. Вам потрібно або викликати цей метод з `componentWillUnmount`, _або_ впевнитись, що компонент все ще примонтований у межах функції зворотнього виклику.

#### Throttle {#throttle}

Тротлінг запобігає повторному виклику функції у заданий проміжок часу. Цей метод використовується у прикладі нижче, щоб не допустити виклик обробника "click" частіше, ніж раз у секунду.

```jsx
import throttle from 'lodash.throttle';

class LoadMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickThrottled = throttle(this.handleClick, 1000);
  }

  componentWillUnmount() {
    this.handleClickThrottled.cancel();
  }

  render() {
    return <button onClick={this.handleClickThrottled}>Завантажити більше</button>;
  }

  handleClick() {
    this.props.loadMore();
  }
}
```

#### Debounce {#debounce}

Дебаунсинг гарантує, що функція не буде виконуватись доти, доки не пройде певна кількість часу з моменту її останнього виклику. Цей метод стане у нагоді, якщо вам потрібно провести ресурсомісткий розрахунок у відповідь на подію, яка може швидко повторитися (наприклад, прокрутка сторінки чи натиснення клавіш). У прикладі нижче для введення тексту використовується затримка у 250 мс.

```jsx
import debounce from 'lodash.debounce';

class Searchbox extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.emitChangeDebounced = debounce(this.emitChange, 250);
  }

  componentWillUnmount() {
    this.emitChangeDebounced.cancel();
  }

  render() {
    return (
      <input
        type="text"
        onChange={this.handleChange}
        placeholder="Пошук..."
        defaultValue={this.props.value}
      />
    );
  }

  handleChange(e) {
    // React розташовує події в пулі, тому значення зчитується перед debounce.
    // Як альтернативу, ми могли б викликати `event.persist()` і передати подію в повному обсязі.
    // Більш детально дана тема розглядається тут: reactjs.org/docs/events.html#event-pooling
    this.emitChangeDebounced(e.target.value);
  }

  emitChange(value) {
    this.props.onChange(value);
  }
}
```

#### `requestAnimationFrame` throttling {#requestanimationframe-throttling}

[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) — це спосіб організації черги функції, що буде виконуватись у браузері у найоптимальніший проміжок часу для продуктивності рендерингу. Функція, поставлена в чергу за допомогою `requestAnimationFrame`, запуститься в наступному кадрі. Браузер докладе усіх зусиль, щоб забезпечити 60 кадрів у секунду (60 fps — frames per second). Однак, якщо браузер не в змозі справитися з цією задачею, він звичним способом *обмежить* кількість кадрів у секунду. Наприклад, якщо ваш пристрій підтримує тільки 30 fps, то і отримаєте ви тільки 30 кадрів. Використання `requestAnimationFrame` для тротлінгу є дуже корисним методом, так як він допомагає запобігти виконанню більше 60 оновлень у секунду. Якщо ви виконуєте 100 оновлень у секунду, це створює зайву роботу для браузера, яку користувач усе одно не помітить.

>**Примітка:**
>
>Використання даної техніки захопить тільке останнє опубліковане значення в кадрі. Приклад роботи даної оптимізації ви можете знайти на сайті [`MDN`](https://developer.mozilla.org/en-US/docs/Web/Events/scroll)

```jsx
import rafSchedule from 'raf-schd';

class ScrollListener extends React.Component {
  constructor(props) {
    super(props);

    this.handleScroll = this.handleScroll.bind(this);

    // Створюємо нову функцію для планування оновлень.
    this.scheduleUpdate = rafSchedule(
      point => this.props.onScroll(point)
    );
  }

  handleScroll(e) {
    // Призначаємо оновлення при активізації події прокрутки.
    // Якщо у рамках кадру ми отримуємо забагато оновлень, публікуємо тільки останнє значення.
    this.scheduleUpdate({ x: e.clientX, y: e.clientY });
  }

  componentWillUnmount() {
    // Відміняємо будь-які очікуючі оновлення, так як компонент буде демонтовано.
    this.scheduleUpdate.cancel();
  }

  render() {
    return (
      <div
        style={{ overflow: 'scroll' }}
        onScroll={this.handleScroll}
      >
        <img src="/my-huge-image.jpg" />
      </div>
    );
  }
}
```

#### Тестування обмеження швідкості {#testing-your-rate-limiting}

Коли тестування показує, що ваш код обмеження швидкості працює правильно, корисно мати можливість прокрутити час. Якщо ви використовуєте [`jest`](https://facebook.github.io/jest/), вам може знадобитися [`mock timers`](https://facebook.github.io/jest/docs/en/timer-mocks.html). Якщо ви використовуєте `requestAnimationFrame`, то [`raf-stub`](https://github.com/alexreardon/raf-stub) може виявитися корисним інструментом для керування зміною кадрів анімації.
