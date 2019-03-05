---
id: test-utils
title: Тестові утиліти
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Імпорт**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 з npm
```

## Огляд {#overview}

`ReactTestUtils` спрощують тестування React-компонентів в обраному вами фреймворку для тестування. У Facebook ми використовуємо [Jest](https://facebook.github.io/jest/) для безболісного JavaScript-тестування. Дізнайтеся, як розпочати роботу із Jest на сайті [Jest React Tutorial](http://facebook.github.io/jest/docs/en/tutorial-react.html#content).

> Примітка:
>
> Ми рекомендуємо використовувати [`react-testing-library`](https://git.io/react-testing-library), котра спроектована для заохочення написання тестів та використовує ваші компоненти так, як це роблять кінцеві користувачі.
>
> Альтернативно, Airbnb випустила тестову утиліту, що називається [Enzyme](http://airbnb.io/enzyme/), котра легко дозволяє затверджувати, маніпулювати і переміщувати вихідні дані ваших React-компонентів.

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Довідка {#reference}

### `act()` {#act}

Для того, щоб підготувати компонент до затвердження, обгорніть код, що його відображає та виконайте оновлення всередині виклику `act()`. Це робить ваш тест подібним до того, як React працює у браузері.

>Примітка
>
>Якщо ви використовуєте `react-test-renderer`, він також експортує `act`, що працює аналогічно.

Для прикладу, у нас є компонент `Counter`:

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `Ви клікнули ${this.state.count} разів`;
  }
  componentDidUpdate() {
    document.title = `Ви клікнули ${this.state.count} разів`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>Ви клікнули {this.state.count} разів</p>
        <button onClick={this.handleClick}>
          Натисніть на мене
        </button>
      </div>
    );
  }
}
```

Ось як ми можемо його перевірити:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('може відображатися та оновлювати лічильник', () => {
  // Тестуємо перший render та componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Ви клікнули 0 разів');
  expect(document.title).toBe('Ви клікнули 0 разів');

  // Тестуємо другий render та componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Ви клікнули 1 разів');
  expect(document.title).toBe('Ви клікнули 1 разів');
});
```

Не забувайте, що диспетчеризація подій DOM працює тільки тоді, коли до `document` додано контейнер DOM. Ви можете використовувати допоміжний пакунок на кшталт [`react-testing-library`](https://github.com/kentcdodds/react-testing-library), щоб скоротити шаблонний код.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Передайте mock-компонент в цей метод, щоб розширити його корисними методами, які дозволяють використовувати його в якості фіктивного React-компонента. Замість звичного рендеру компонент стане простим `<div>` (або іншим тегом, якщо надано `mockTagName`), що містить всіх наданих потомків.

> Примітка:
>
> `mockComponent()` — застарілий API. Ми рекомендуємо використовувати [поверховий рендер](/docs/shallow-renderer.html) або замість нього — [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Повертає `true`, якщо `element` є будь-яким React-елементом.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Повертає `true`, якщо `element` є React-елементом, типом якого є React `componentClass`.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Повертає `true`, якщо `instance` є DOM-компонентом (таким як `<div>`, або `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Повертає `true`, якщо `instance` є визначеним користувачем компонентом, таким як клас, або функція.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Повертає `true`, якщо `instance` є компонентом, типом якого є React `componentClass`.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Проходить всі компоненти в `tree` і накопичує їх, де `test(component)` дорівнює `true`. Це не так корисно само собою, але використовується як примітив для інших тестових утиліт.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Знаходить усі елементи DOM-компонентів у відрендереному дереві, що є DOM-компонентами з іменем класу, відповідним `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Подібний [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass), але очікує, що буде один результат і поверне його або згенерує виняткову ситуацію, якщо кількість співпадінь більше одиниці.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Знаходить усі елементи DOM-компонентів у рендер-дереві, що є DOM-компонентами з іменем тегу, відповідним `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Подібний [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag), але очікує, що буде один результат, і поверне його або викине виключення, якщо кількість співпадінь більше одиниці.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Знаходить усі екземпляри компонентів з типом, рівним `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Подібний [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype), але очікує, що буде один результат, і поверне його або викине виключення, якщо кількість співпадінь більше одиниці.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Рендерить React-елемент в окремий вузол DOM у документі. **Ця функція вимагає DOM.** Це фактично еквівалентно:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Примітка:
>
> Вам потрібно, щоб `window`, `window.document` і `window.document.createElement` були глобально доступними **до того**, як ви імпортуєте `React`. Інакше React вважатиме, що не може отримати доступ до DOM, і такі методи, як `setState` не будуть працювати.

* * *

## Інші утиліти {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Симулює розсилку подій у вузлі DOM з необов'язковими даними про подію `eventData`.

`Simulate` має метод для [кожної події, що розуміє React](/docs/events.html#supported-events).

**Натискання елемента**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Зміна значення поля вводу, а потім натискання ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'giraffe';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Примітка
>
> Ви повинні надати будь-яку властивість події, що використовуєте у вашому компоненті (напр. keyCode, which, і т.д.), оскільки React не створює жодної з них для вас.

* * *
