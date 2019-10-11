---
title: Фабрики React-елементів та JSX-попередження
layout: single
permalink: warnings/legacy-factories.html
---

Напевно, ви попали сюди, тому що ваш код викликає компонент, як функцію. Наступний код тепер є застарілим:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // ПОПЕРЕДЖЕННЯ
}
```

## JSX {#jsx}

React-компоненти більше не можуть викликатися таким чином. Замість цього [ви можете використовувати JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Без JSX {#without-jsx}

Якщо ви не хочете або не можете використовувати JSX, тоді перед викликом компонента вам необхідно перевести його у фабрику:

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

Це простий шлях оновлення, якщо у вас багато викликів функцій.

## Динамічні компоненти без JSX {#dynamic-components-without-jsx}

Якщо ви отримуєте клас компонента з динамічного джерела, то необов'язково створювати фабрику, на яку ви негайно посилаєтеся. Замість цього ви можете безпосередньо створити елемент:

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## Докладніше {#in-depth}

[Дізнайтеся докладніше, ЧОМУ ми робимо цю зміну.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
