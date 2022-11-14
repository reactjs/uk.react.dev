---
id: javascript-environment-requirements
title: Вимоги до JavaScript середовища
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 залежить від типів колекцій [Map](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Map) та [Set](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Set). Якщо ви підтримуєте старі браузери та пристрої, що не можуть надати їх (напр. IE < 11) або мають певні невідповідності у реалізації (напр. IE 11), подумайте про додавання глобального поліфілу (polyfill) у ваш додаток, наприклад, [core-js](https://github.com/zloirock/core-js) чи [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).

JavaScript середовище з поліфілом для React 16, що використовує core-js для підтримки старих браузерів може виглядати так:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> 3bba430b5959c2263c73f0d05d46e2c99c972b1c

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Привіт, світ!</h1>,
  document.getElementById('root')
);
```

React також залежить від `requestAnimationFrame` (навіть у тестових середовищах).  
Ви можете використовувати пакунок [raf](https://www.npmjs.com/package/raf) для підключення `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> 3bba430b5959c2263c73f0d05d46e2c99c972b1c
