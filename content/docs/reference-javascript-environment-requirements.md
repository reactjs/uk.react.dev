---
id: javascript-environment-requirements
title: Вимоги до JavaScript оточення
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 залежить від типів колекцій [Map](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Map) та [Set](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Set). Якщо ви підтримуєте старі браузери та пристрої, що не можуть надати їх нативно (наприклад, IE < 11) або мають певні невідповідності у реалізації (наприклад, IE 11), подумайте про додавання глобального поліфілу (polyfill) у ваш застосунок, наприклад, [core-js](https://github.com/zloirock/core-js) чи [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).

JavaScript оточення з поліфілом для React 16, що використовує core-js для підтримки старих браузерів може виглядати так:

```js
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Привіт, світ!</h1>,
  document.getElementById('root')
);
```

React також залежить від `requestAnimationFrame` (навіть у тестових оточеннях).  
Ви можете використовувати пакунок [raf](https://www.npmjs.com/package/raf) для підключення `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
