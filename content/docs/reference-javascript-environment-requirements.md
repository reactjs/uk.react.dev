---
id: javascript-environment-requirements
title: Вимоги до JavaScript середовища
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 залежить від типів колекцій [Map](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Map) та [Set](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Set). Якщо ви підтримуєте старі браузери та пристрої, що не можуть надати їх (напр. IE < 11) або мають певні невідповідності у реалізації (напр. IE 11), подумайте про додавання глобального поліфілу (polyfill) у ваш додаток, наприклад, [core-js](https://github.com/zloirock/core-js) чи [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 8f9ef00db1b36ee3e5a0e6072eb601257a6f8ccb

JavaScript середовище з поліфілом для React 16, що використовує core-js для підтримки старих браузерів може виглядати так:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
