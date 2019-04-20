---
id: render-props
title: Рендер-пропси
permalink: docs/render-props.html
---

Термін ["рендер-проп"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) відноситься до техніки, в якій React-компоненти розділяють між собою один код (функцію) передаючи її через проп.

Компонент з рендер-пропом приймає функцію, яка повертає React-елемент, і викликає її замість реалізації власної рендер-логіки.

```jsx
<DataProvider render={data => (
  <h1>Привіт {data.target}</h1>
)}/>
```

Такі бібліотеки, як [React Router](https://reacttraining.com/react-router/web/api/Route/render-func) та [Downshift](https://github.com/paypal/downshift) використовують рендер-пропси.

На цій сторінці, ми розглянемо чим рендер-пропси корисні та як їх писати.

## Використання рендер-пропсів для наскрізних завдань (Cross-Cutting Concerns) {#use-render-props-for-cross-cutting-concerns}

Компоненти — основа повторного використання коду в React. Але не завжди буває очевидно як інкапсульовані в одному компоненті стан чи поведінку розділити з іншими компонентами, що їх потребують.

Наприклад, наступний компонент відслідковує позицію курсора миші у веб-додатку:

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>Переміщуйте курсор миші!</h1>
        <p>Поточна позиція курсора миші: ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

По мірі переміщення курсора, компонент виводить його координати (x, y) всередині блоку `<p>`.

Постає питання: як ми можемо повторно використати цю ж поведінку в іншому компоненті? Іншими словами, якщо інший компонент потребує знати позицію курсора, чи можемо ми якимось чином інкапсулювати цю поведінку, щоб потім легко використати її в цьому компоненті?

Оскільки компоненти являються базовою одиницею повторного використання коду в React, давайте спробуємо невеликий рефакторинг. Виділимо компонент `<Mouse>` який інкапсулюватиме поведінку, яку б ми хотіли повторно використовувати в нашому коді.

```js
// Компонент <Mouse> інкапсулює потрібну нам поведінку...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/* ...але як вивести щось, окрім тегу <p>? */}
        <p>Поточна позиція курсора миші: ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Переміщуйте курсор миші!</h1>
        <Mouse />
      </div>
    );
  }
}
```

Тепер компонент `<Mouse>` інкапсулює в собі всю поведінку, пов'язану з реагуванням на події `mousemove` та зберіганням позиції (x, y) курсора, але він поки ще не достатньо гнучкий для повторного використання.

Наприклад, скажімо в нас є компонент `<Cat>`, який рендерить зображення кота, що ганяється за мишкою по екрану. Ми можемо використати проп `<Cat mouse={{ x, y }}>` для передачі компоненту координати миші щоб він знав де розмістити зображення на екрані.

Спочатку, ви можете спробувати рендерити `<Cat>` *всередині методу `render` компонента `<Mouse>`*, наприклад так:

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Ми могли б тут просто замінити тег <p> на компонент <Cat>... але тоді
          нам потрібно було б створювати окремий компонент <MouseWithSomethingElse>
          кожного разу, коли він нам потрібен, тому <MouseWithCat>
          поки що не достатньо гнучкий для повторного використання.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Переміщуйте курсор миші!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Цей підхід працюватиме в нашому конкретному випадку, але ми й досі не досягли цілі — інкапсуляції поведінки з можливістю повторного використання. Тепер, кожен раз коли нам потрібно отримати позицію курсора миші для різних варіантів, нам прийдеться створювати новий компонент (тобто по суті ще один `<MouseWithCat>`), який рендерить щось спеціально для цього випадку.

Ось тут нам і знадобиться рендер-проп: замість явного задавання `<Cat>` всередині компонента `<Mouse>` і зміни результату рендеру таким чином, ми можемо передавати компоненту `<Mouse>` функцію через проп (рендер-проп), яку він використає для динамічного визначення того, що потрібно рендерити.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Замість статичного декларування того, що рендерить <Mouse>, використовуємо
          проп `render` для динамічного визначення того, що потрібно відрендерити.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Переміщуйте курсор миші!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Тепер, замість того, щоб фактично клонувати компонент `<Mouse>` та жорстко задавати щось інше в його методі `render` для рішення конкретного варіанту, ми надаємо проп `render`, який `<Mouse>` може використати для динамічного визначення що він рендерить.

Більш конкретно, **рендер-проп — це фунцкія, передана через проп, яку компонент використовує, щоб визначити що рендерити.**

Ця техніка робить надзвичайно портативною поведінку, яку ми хотіли б використовувати повторно. Для отримання потрібної поведінки, ми тепер рендеримо компонент `<Mouse>` з пропом `render`, який вказує що відрендерити для поточних координат (x, y) курсора.

Одна цікава річ, яку варто відзначити про рендер-пропси, полягає в тому, що ви можете реалізувати більшість [компонентів вищого порядку](/docs/higher-order-components.html) (HOC) з використанням звичайного компоненту з рендер-пропом. Наприклад, якщо ви надаєте перевагу HOC `withMouse` замість компонента `<Mouse>`, ви могли б легко його створити з використанням звичайного компоненту `<Mouse>` та рендер-пропу:

```js
// Якщо вам дійсно потрібен HOC по якійсь причині, ви можете легко
// його створити з використанням звичайного компонента і рендер-пропа!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

Таким чином, використання рендер-проп дозволяє реалізувати будь-який з наведених вище патернів.

## Використання пропсів, відмінних від `render` {#using-props-other-than-render}

Важливо пам'ятати, що із назви патерну "рендер-пропси" зовсім не слідує, що для його використання ви *повинні використовувати проп з ім'ям `render`*. Насправді, [*будь-який* проп, який є функцією і використовується компонентом для визначення, що рендерити технічно являється "рендер-пропом"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Незважаючи на те, що наведені приклади використовують проп `render`, ми могли б так само легко використати проп `children`!

```js
<Mouse children={mouse => (
  <p>Поточна позиція курсора миші: {mouse.x}, {mouse.y}</p>
)}/>
```

Також запам'ятайте, що проп `children` не обов'язково повинен бути зазначений у списку «атрибутів» у вашому JSX-елементі. Замість цього, ви можете помістити його прямо *всередину* елемента!

```js
<Mouse>
  {mouse => (
    <p>Поточна позиція курсора миші: {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Ви побачите, що ця техніка використовується в API бібліотеки [react-motion](https://github.com/chenglou/react-motion).

Оскільки ця техніка дещо незвична, то при розробці такого API було б доречно явно вказати в `propTypes`, що проп `children` повинен бути функцією.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Застереження {#caveats}

### Будьте обережні при використанні рендер-пропсів разом з React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Використання рендер-проп може звести нанівець переваги, що надає [`React.PureComponent`](/docs/react-api.html#reactpurecomponent), якщо ви створюєте функцію всередині методу `render`. Це спричинене тим, що поверхове порівняння пропсів завжди повертатиме `false` для нових пропсів, а в даному випадку кожен виклик `render` генеруватиме нове значення для рендер-пропа.

Наприклад, продовжуючи з нашим вищезгаданим компонентом `<Mouse>`, якби `Mouse` наслідував `React.PureComponent` замість `React.Component`, наш приклад виглядав би наступним чином:

```js
class Mouse extends React.PureComponent {
  // Така ж сама реалізація, як і раніше...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Переміщуйте курсор миші!</h1>

        {/*
          Погано! Значення пропа `render` буде
          різним при кожному рендері.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

У цьому прикладі, при кожному рендері `<MouseTracker>`, генерується нова функція в якості значення пропу `<Mouse render>`, таким чином зводячи нанівець ефект `React.PureComponent` який `<Mouse>` наслідує!

Щоб вирішити цю проблему, ви можете визначити проп як метод екземпляру, наприклад так:

```js
class MouseTracker extends React.Component {
  // Визначаєм метод екземпляру, тепер `this.renderTheCat` завжди
  // ссилається на *ту саму* функцію коли ми використовуємо її в рендері
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Переміщуйте курсор миші!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

В тих випадках, коли ви не можете статично задати проп (наприклад тому, що вам потрібно замкнути пропси та/або стан компоненту), `<Mouse>` повинно наслідувати `React.Component`.
