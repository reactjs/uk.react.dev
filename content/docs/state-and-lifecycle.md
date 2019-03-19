---
id: state-and-lifecycle
title: Стан та життєвий цикл
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

На цій сторінці представлено поняття стану та життєвого циклу у React-компоненті. Ви можете знайти [детальньний API довідник на компонент тут](/docs/react-component.html).

Розглянемо приклад відліку годинника з [одного з попередніх розділів](/docs/rendering-elements.html#updating-the-rendered-element). У [Рендерингу елементів](/docs/rendering-elements.html#rendering-an-element-into-the-dom) ми дізналися лише один спосіб оновлення UI. Ми викликаємо його — `ReactDOM.render()`, щоб змінити відрендерний вивід інформації:

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Try it on CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

У цьому розділі ми дізнаємося, як зробити компонент 'Clock' дійсно багаторазовим та інкапсульованим. Компонент сам налаштує свій таймер та оновлюватиметься кожну секунду.

Ми можемо почати з того, як виглядає годинник:  

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Однак, це пропускає важливу вимогу: той факт, що `Clock` встановлює таймер і оновлює UI кожну секунду, має бути деталлю реалізації `Clock`.

В ідеалі ми хочемо написати це один раз аби `Clock` оновлював себе сам:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Аби це реалізувати, нам потрібно додати "state" до компонента `Clock`.

Стан - подібний до пропсів, але він приватний і повністю контролюється компонентом.

Ми [згадували раніше](/docs/components-and-props.html#functional-and-class-components), що компоненти, визначені як класи, мають деякі додаткові функції. Внутрішній стан - це і є функція яка доступна тільки для класів.

## Перетворення функції на клас {#converting-a-function-to-a-class}

Ви можете перетворити функцію компоненту `Clock` на клас у п'ять кроків:

1. Створіть клас [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) з тим же ім'ям, що продовжує `React.Component`.

2. Додайте до нього один порожній метод, який називається `render()`.

3. Перемістіть тіло функції в метод `render()`.

4. Замініть `props` на `this.props` в тілі `render()`.

5. Видаліть порожні оголошення функції які залишилися.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` тепер визначається як клас, а не як функція.

Метод `render` буде викликатися кожного разу, коли відбуватиметься оновлення, але до тих пір, поки ми рендеремо `<Clock />` в той же вузол DOM, буде використано лише один екземпляр класу `Clock`. Це дозволяє нам використовувати додаткові функції, такі як методи внутрішнього стану та життєвого циклу.
 
## Додавання внутрішнього стану до класу {#adding-local-state-to-a-class}

Ми перемістимо `date` від пропсів до стану, в три етапи:

1) Замінити `this.props.date` на `this.state.date` у методі `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) Додайте [class constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor), який призначає початковий `this.state`:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Зверніть увагу на те, як ми передаємо `props`(пропси) базовому конструктору:

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```
Компоненти класу повинні завжди викликати базовий конструктор з `props`.

3) Видалити елемент `date` з елемента `<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```
Пізніше ми додамо код таймера назад до самого компонента.

Результат виглядає так:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Далі, ми зробимо так аби `Clock` сам налаштувати свій таймер і оновлювався себе кожну секунду.

## Додавання методів життєвого циклу до класу {#adding-lifecycle-methods-to-a-class}

У додатках з багатьма компонентами, дуже важливо вивільняти ресурси які використовуються компонентами коли вони знищуються.

Ми хочемо [налаштувати таймер](https://developer.mozilla.org/uk/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) кожного разу, коли `Clock` буде передано DOM вперше. Це називається "монтування" в React.

Ми також хочемо [оновити цей таймер](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval), коли DOM видаляється. Це називається "розмотування" в React.

Ми можемо оголосити спеціальні методи на класі компонентів для запуску деякого коду, коли компонент монтується і розмотується:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Ці методи називаються "методами життєвого циклу".

Метод `componentDidMount()` виконується після того, як компонентний вивід був переданий DOM. Це гарне місце для налаштування таймера:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Зверніть увагу на те, як ми зберігаємо ідентифікатор таймера прямо на `this`.

Хоча `this.props` налаштовує сам React, а `this.state` має особливе значення, ви можете додавати додаткові поля до класу вручну, якщо потрібно зберегти те, що не бере участь у потоці даних (як ідентифікатор таймера).

У методі життєвого циклу `componentWillUnmount()`, ми розірвемо таймер:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Нарешті, ми реалізуємо метод під назвою `tick()`, що компонент `Clock` буде використовувати кожну секунду.

Він буде використовувати `this.setState()` для планування оновлення внутрішнього стану компонента:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

Тепер годинник відстукує кожну секунду.

Давайте швидко повторимо, що відбувається, і порядок, в якому ці методи викликаються:

1) Коли `<Clock />` передається до `ReactDOM.render ()`, React викликає конструктор компонента `Clock`. Оскільки `Clock` має відображати поточний час, він ініціалізує `this.state` з об'єктом, включаючи поточний час. Пізніше ми оновимо цей стан.

2) React потім викликає `Clock` компонентний метод `render()`. Ось як React дізнається, що саме має відображатися на екрані. Потім React оновлює DOM, щоб він відповідав виводу рендера `Clock`.

3) Коли виведення інформації `Clock` вставляється в DOM, React викликає метод життєвого циклу `componentDidMount()`. Всередині методу, компонент `Clock` просить у браузера налаштувати таймер для виклику методу компонента `tick()` один раз на секунду.

4) Кожну секунду браузер викликає метод `tick()`. У цьому методі, компонент `Clock` планує оновлення UI, викликаючи `setState()` з об'єктом, що містить поточний час. Завдяки виклику `setState()` React знає, що стан змінився, і знову викликає метод `render()`, щоб дізнатися, що має бути на екрані. Цього разу `this.state.date` в методі `render()` буде відрізнятися, і тому рендерний вивід інформаціі буде включати оновлений час. React оновлює DOM відповідно.

5) If the `Clock` component is ever removed from the DOM, React calls the `componentWillUnmount()` lifecycle method so the timer is stopped.

Якщо компонент `Clock` коли-небудь буде видалений з DOM, React викличе метод життєвого циклу `componentWillUnmount()`, аби таймер зупинився.

## Правильно використовувати стан {#using-state-correctly}

Є три речі, які ви повинні знати про `setState()`.

### Не змінюйте стан безпосередньо {#do-not-modify-state-directly}

Наприклад, це не буде повторно рендерити компонент:

```js
// Wrong
this.state.comment = 'Hello';
```

Instead, use `setState()`:

```js
// Correct
this.setState({comment: 'Hello'});
```

Конструктор - це єдине місце, де можна призначити `this.state`.

### State Updates May Be Asynchronous {#state-updates-may-be-asynchronous}

React може групувати кілька викликів `setState()` в одне оновлення для продуктивності.

Оскільки `this.props` і `this.state` можуть бути оновлені асинхронно, не варто покладатися на їх значення для обчислення наступного стану.

Наприклад, цей код може не оновити лічильник:

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Щоб виправити це, скористайтеся другою формою `setState()`, яка приймає функцію, а не об'єкт. Ця функція отримає попередній стан як перший аргумент, а пропси в момент, коли оновлення застосовується як другий аргумент:

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

Вище було використано функцію [стрілкова функція](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Functions/Стрілкові_функції) але вона також працює з регулярними функціями:

```js
// Correct
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Об'єднання станового оновлення {#state-updates-are-merged}

Коли ви називаєте `setState()`, React об'єднує об'єкт, який ви надаєте, до поточного стану.

Наприклад, ваш стан може містити кілька незалежних змінних:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Тоді ви можете оновлювати їх окремо за допомогою окремих викликів `setState()`:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

Злиття є дрібним, тому `this.setState({comments})` залишає `this.state.posts` незмінним, але повністю замінює `this.state.comments`.

## Потік данних вниз {#the-data-flows-down}

Ні батьківські, ні дочірні компоненти не можуть знати, чи є певний компонент становим або безстановим, і вони не повинні піклуватися, чи визначено це як функцію або клас.

Саме тому стан часто називають внутрішнім або інкапсульованим. Він не доступний для будь-якого іншого компоненту, окрім того, який їм володіє і встановлює.

Компонент може передати свій стан вниз як пропси до своїх дочірніх компонентів:

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

Це також працює для визначених користувачем компонентів:

```js
<FormattedDate date={this.state.date} />
```

Компонент `FormattedDate` отримає `date` у своїх пропсів і не буде знати, чи вийшов він зі стану `Clock`, з пропсів `Clock`, або був набраний вручну:

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

Це зазвичай називається "зверху вниз" або "односпрямованим" потоком даних. Будь-який стан завжди належить певному компоненту, і будь-які дані або UI, отримані з цього стану, можуть впливати лише на компоненти "нижче" їх у дереві.

If you imagine a component tree as a waterfall of props, each component's state is like an additional water source that joins it at an arbitrary point but also flows down.

To show that all components are truly isolated, we can create an `App` component that renders three `<Clock>`s:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Each `Clock` sets up its own timer and updates independently.

In React apps, whether a component is stateful or stateless is considered an implementation detail of the component that may change over time. You can use stateless components inside stateful components, and vice versa.
