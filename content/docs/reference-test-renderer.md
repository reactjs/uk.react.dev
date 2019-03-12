---
id: test-renderer
title: Тестовий рендерер
permalink: docs/test-renderer.html
layout: docs
category: Reference
---

**Імпорт**

```javascript
import TestRenderer from 'react-test-renderer'; // ES6
const TestRenderer = require('react-test-renderer'); // ES5 з npm
```

## Огляд {#overview}

Цей пакет надає засіб рендерингу React, який можна використовувати для перетворення компонентів React на чисті JavaScript-об'єкти, без залежності від DOM або власного мобільного середовища.

По суті, цей пакет дозволяє легко зробити знімок ієрархії вигляду платформи (подібно до дерева DOM), що рендериться компонентом React DOM або React Native без використання браузера або [jsdom](https://github.com/tmpvar/jsdom).

Приклад:

```javascript
import TestRenderer from 'react-test-renderer';

function Link(props) {
  return <a href={props.page}>{props.children}</a>;
}

const testRenderer = TestRenderer.create(
  <Link page="https://www.facebook.com/">Facebook</Link>
);

console.log(testRenderer.toJSON());
// { type: 'a',
//   props: { href: 'https://www.facebook.com/' },
//   children: [ 'Facebook' ] }
```

Ви можете використовувати функцію тестування знімків у Jest, щоб автоматично зберегти копію JSON-дерева в файл і перевірити в тестах, що вона не змінилася: [детальніше про це](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html).

Ви також можете обійти вихідні дані, щоб переконатися у наявності конкретних вузлів.

```javascript
import TestRenderer from 'react-test-renderer';

function MyComponent() {
  return (
    <div>
      <SubComponent foo="bar" />
      <p className="my">Привіт</p>
    </div>
  )
}

function SubComponent() {
  return (
    <p className="sub">Під</p>
  );
}

const testRenderer = TestRenderer.create(<MyComponent />);
const testInstance = testRenderer.root;

expect(testInstance.findByType(SubComponent).props.foo).toBe('bar');
expect(testInstance.findByProps({className: "sub"}).children).toEqual(['Під']);
```

### TestRenderer {#testrenderer}

* [`TestRenderer.create()`](#testrenderercreate)

### Екземпляр TestRenderer {#testrenderer-instance}

* [`testRenderer.toJSON()`](#testrenderertojson)
* [`testRenderer.toTree()`](#testrenderertotree)
* [`testRenderer.update()`](#testrendererupdate)
* [`testRenderer.unmount()`](#testrendererunmount)
* [`testRenderer.getInstance()`](#testrenderergetinstance)
* [`testRenderer.root`](#testrendererroot)

### TestInstance {#testinstance}

* [`testInstance.find()`](#testinstancefind)
* [`testInstance.findByType()`](#testinstancefindbytype)
* [`testInstance.findByProps()`](#testinstancefindbyprops)
* [`testInstance.findAll()`](#testinstancefindall)
* [`testInstance.findAllByType()`](#testinstancefindallbytype)
* [`testInstance.findAllByProps()`](#testinstancefindallbyprops)
* [`testInstance.instance`](#testinstanceinstance)
* [`testInstance.type`](#testinstancetype)
* [`testInstance.props`](#testinstanceprops)
* [`testInstance.parent`](#testinstanceparent)
* [`testInstance.children`](#testinstancechildren)

## Довідник {#reference}

### `TestRenderer.create()` {#testrenderercreate}

```javascript
TestRenderer.create(element, options);
```

Створює екземпляр `TestRenderer` з переданим елементом React. Він не використовує реальний DOM, але він все ще повністю рендерить дерево компоненту в пам'яті, щоб ви могли переконатися в його наявності. Повернутий екземпляр має наступні методи і властивості.

### `testRenderer.toJSON()` {#testrenderertojson}

```javascript
testRenderer.toJSON()
```

Повертає об'єкт, що представляє відрендерене дерево. Це дерево містить лише специфічні для платформи вузли типу `<div>` або `<View>` та їх реквізит, але не містить компонентів написаних користувачем. Це зручно для [тестування з використанням знімків](https://jestjs.io/docs/uk/snapshot-testing).

### `testRenderer.toTree()` {#testrenderertotree}

```javascript
testRenderer.toTree()
```

Повертає об'єкт, що представляє відрендерене дерево. На відміну від `toJSON ()`, представлення більш деталізовано, ніж те, що надає `toJSON ()`, та включає в себе написані користувачем компоненти. Ймовірно, вам не потрібен цей метод, якщо ви не пишете власну бібліотеку тверджень поверх тестового рендерера.

### `testRenderer.update()` {#testrendererupdate}

```javascript
testRenderer.update(element)
```

Повторний рендер дерева в пам'яті з новим кореневим елементом. Це імітує оновлення React від кореня. Якщо новий елемент має той же тип і ключ, що і попередній елемент, дерево буде оновлено; в іншому випадку буде змонтоване нове дерево.

### `testRenderer.unmount()` {#testrendererunmount}

```javascript
testRenderer.unmount()
```

Розмонтує дерево в пам'яті, ініціюючи відповідні події життєвого циклу.

### `testRenderer.getInstance()` {#testrenderergetinstance}

```javascript
testRenderer.getInstance()
```

Повертає екземпляр відповідно до кореневого елементу, якщо він є. Це не працюватиме, якщо кореневий елемент є функціональним компонентом, оскільки вони не мають екземплярів.

### `testRenderer.root` {#testrendererroot}

```javascript
testRenderer.root
```

Повертає кореневий об'єкт "тестового екземпляру", який є корисним для створення тверджень про певні вузли дерева. Ви можете використовувати його, щоб знайти інші "тестові екземпляри" нижче.

### `testInstance.find()` {#testinstancefind}

```javascript
testInstance.find(test)
```

Знаходить єдиний тестовий екземпляр, для якого `test (testInstance)` повертає `true`. Якщо `test (testInstance)` не повертає `true` для єдиного тестового екземпляра, він видасть помилку.

### `testInstance.findByType()` {#testinstancefindbytype}

```javascript
testInstance.findByType(type)
```

Знаходить єдиний тестовий екземпляр відповідно до значення `type`. Якщо єдиного тестового екземпляру з наведеним `type` не існує, він видасть помилку.

### `testInstance.findByProps()` {#testinstancefindbyprops}

```javascript
testInstance.findByProps(props)
```

Знаходить єдиний тестовий екземпляр відповідно до значення `props`. Якщо єдиного тестового екземпляру з наведеним `props` не існує, він видасть помилку.

### `testInstance.findAll()` {#testinstancefindall}

```javascript
testInstance.findAll(test)
```

Знаходить всі тестові екземпляри для яких `test(testInstance)` повертає `true`.

### `testInstance.findAllByType()` {#testinstancefindallbytype}

```javascript
testInstance.findAllByType(type)
```

Знаходить всі тестові екземпляри відповідно до значення `type`.

### `testInstance.findAllByProps()` {#testinstancefindallbyprops}

```javascript
testInstance.findAllByProps(props)
```

Знаходить всі тестові екземпляри відповідно до значення `props`.

### `testInstance.instance` {#testinstanceinstance}

```javascript
testInstance.instance
```

Екземпляр компонента, що відповідає цьому тестовому екземпляру. Він доступний лише для класових компонентів, оскільки функціональні компоненти не мають екземплярів. Він відповідає значенню `this` всередині даного компонента.

### `testInstance.type` {#testinstancetype}

```javascript
testInstance.type
```

Тип компонента, що відповідає цьому тестовому екземпляру. Наприклад, компонент `<Button />` має тип `Button`.

### `testInstance.props` {#testinstanceprops}

```javascript
testInstance.props
```

Пропси, що відповідають цьому тестовому екземпляру. Наприклад, компонент `<Button size="small"/>` має `{size: 'small'}` як пропс.

### `testInstance.parent` {#testinstanceparent}

```javascript
testInstance.parent
```

Батьківський тестовий екземпляр цього тестового екземпляру.

### `testInstance.children` {#testinstancechildren}

```javascript
testInstance.children
```

Дочірні тестові екземпляри цього тестового екземпляру.

## Ідеї {#ideas}

Функцію `createNodeMock` можна передати `TestRenderer.create` як опцію, яка дозволяє рефи макетів користувача.
`createNodeMock` приймає поточний елемент і повинна повернути об'єкт рефу макета.
Це корисно, коли ви тестуєте компонент, який спирається на рефи.

```javascript
import TestRenderer from 'react-test-renderer';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.input = null;
  }
  componentDidMount() {
    this.input.focus();
  }
  render() {
    return <input type="text" ref={el => this.input = el} />
  }
}

let focused = false;
TestRenderer.create(
  <MyComponent />,
  {
    createNodeMock: (element) => {
      if (element.type === 'input') {
        // макет як функція focus
        return {
          focus: () => {
            focused = true;
          }
        };
      }
      return null;
    }
  }
);
expect(focused).toBe(true);
```
