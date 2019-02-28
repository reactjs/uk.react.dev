---
id: shallow-renderer
title: Поверховий рендер
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**Імпорт**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // ES5 з використанням npm
```

## Огляд {#overview}

Поверховий рендер може бути корисним під час модульного тестування React. Він дозволяє відрендерити лише "один рівень глибини" компоненту і підтвердити факт того, що повертає метод рендерингу, не турбуючись про поведінку дочірніх компонентів, які не будуть створені або відрендерені. Даний процес не вимагає використання DOM.

Наприклад, якщо ви маєте наступний компонент:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Заголовок</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

Тоді ви можете стверджувати:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// У вашому тесті:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

Поверхове тестування наразі має деякі обмеження, а саме — немає підтримки рефів.

> Примітка:
>
> Ми також рекомендуємо використання Enzyme's [API для поверхового рендеру](https://airbnb.io/enzyme/docs/api/shallow.html) — це зручніший  високорівневий API зі схожою функціональністю.

## Довідка {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

Ви можете сприймати shallowRenderer як "місце" для відображення компоненту, який ви тестуєте і з якого ви можете отримати вивід компоненту.

`shallowRenderer.render()` дуже схожий на [`ReactDOM.render()`](/docs/react-dom.html#render), але не використовує DOM і рендерить лише на один рівень глибини. Це означає, що ви можете проводити тестування компонентів, незалежно від реалізації дочірних компонентів.

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

Ви можете побачити, що виклик `shallowRenderer.render()` повертає поверхово відрендерений вивід у `shallowRenderer.getRenderOutput()`.

Потім ви можете припускати факти про формат виводу.
