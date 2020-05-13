---
id: codebase-overview
title: Оляд бази коду
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---
У цьому розділі ви отримаєте огляд організації бази коду React, її конвенцій та здійснення.

Якщо ви бажаєте [зробити внесок в React](/docs/how-to-contribute.html) ми сподіваємось, що цей посібник допоможе вам відчувати себе комфортніше вносячи зміни.

Ми не обов'язково рекомендуємо будь-яку з цих конвенцій у аплікаціях React. Багато з них існують лише з історичних причин і можуть змінюватися з часом.

### Директорії вищого рівня {#top-level-folders}

Після клонування [React репозиторію](https://github.com/facebook/react), в ньому ви побачите декілька директорій вищого рівня:

* [`packets`](https://github.com/facebook/react/tree/master/packages) містить метадату (таку як `package.json`) і вихідний код (`src` під-директорії) для всіх
packets в React репозиторію. **Якщо ваша зміна пов'язана з кодом, `src` під-директорія кожного пакету - це те, де ви будете проводити більшу частину свого часу.**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) містить кілька невеликих тестових програм React, для тих хто вносить зміни.
* `build` результат побудованого React. Він не знаходиться в репозиторію, але він з'явиться у вашому клонованому React репозиторію, після того [як ви збудуєте його](/docs/how-to-contribute.html#development-workflow) вперше.

Документація розміщена [у окремому від React репозиторію](https://github.com/reactjs/reactjs.org).

Є декілька інших директорій вищого рівня, але вони в основному використовуються для інструментів, і ви ймовірно, ніколи не зіткнетеся з ними під час внесення змін.

### Colocated тести {#colocated-tests}

Ми не маємо директорій вищого рівня для тестів. Замість цього, ми записуємо їх у директорію під назвою `__tests__` відносно до файлів які вони тестують.
Для прикладу, тест для [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) буде розміщено в [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js) одразу поруч.

### Попередження та Invariants {#warnings-and-invariants}

База коду React використовує `warning` модуль для відображення попереджень:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Math is not working today.'
);
```

**Попередження показано коли `warning` умовою є `false`.**

Один із способів подумати над цим, є те що умова повинна відображати швидше за все нормальну ситуацію, а не виняткову.

Хорошою ідеєю є, уникати спаму в консолі з повторюваними попередженнями:

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Math is not working today.'
  );
  didWarnAboutMath = true;
}
```

Попередження лише включені в девелопменті. В продакшині, вони повністю відсутні. Якщо вам потрібно заборонити виконувати якийсь шлях до коду, використовуйте замість цього `invariant` модуль:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'You shall not pass!'
);
```

**invariant викидається коли `invariant` умовою є `false`.**

"Invariant" це лише спосіб сказати, що "ця умова завжди виконується". Ви можете думати про це як про ствердження.

Важливо підтримувати поведінку девелопмента і продакшина схожою, тож `invariant` викидатиме помилки і в девелопменті, і в продакшині. Повідомлення про помилки автоматично замінюються кодами помилок у продакшині, щоб уникнути негативного впливу на розмір байта.

### Девелопмент і Продакшин {#development-and-production}

Ви можете використовувати `__DEV__` псевдо-глобальну зміну в базі коду, щоб захистити блок коду, який є призначений лише для девелопменту.

Він inlined під час етапу компіляції, та перетворюється на `process.env.NODE_ENV !== 'production'` перевіряє в CommonJS builds.

Для одиночних builds, воно стає `true` в unminified build, і повністю забирається з блоками `if`, які він охороняє у мінімізованій build.

```js
if (__DEV__) {
  // Цей код буде виконуватися лише в девелопменті.
}
```

### Потік {#flow}

Ми нещодавно почали представляти [Потік](https://flow.org/) перевірки на кодову базу. Файли помічені з `@flow` анотацією перевіряються в коментарях заголовка ліцензії.

Ми приймаємо запити на внесок [додаючи примітки Потоку до існуючого коду](https://github.com/facebook/react/pull/7600/files). Примітки Потоку виглядають ось так:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```
Коли це можливо, новий код повинен використовувати примітки Потоку.
Ви можете виконати `yarn flow` локально для переверки вашого коду з Потоком.

### Динамічне впорскування {#dynamic-injection}

В деяких модулях React використовує динамічне впорскування. Хоча це завжди зрозуміло, але досі прикро, оскільки перешкоджає розумінню коду. Основна причина, що це досі існує, полягає в тому, що з самого початку React підтримував DOM як ціль. А React Native починався як форк з React. Нам довелося додати динамічне впорскування, щоб React Native перекрив деякі види поведінки React.

Можливо, ви побачите модулі, що декларують свої динамічні залежності ось так:

```js
// Динамічно впорскнуто
var textComponentClass = null;

// Залежить від значення динамічного впорскування
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Забезпечує можливіть для динамічного впорскування
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

`injection` це поле жодним чином не обробляється. Але за умовою це означає, що цей модуль хоче мати деякі (імовірно, залежні від платформи) залежності, що вводяться в нього під час виконання.

У базі коду є декілька точок впорскування. В майбутньому ми маємо намір позбутися динамічного механізму впорскування та статично з'єднати всі шматки під час будування.

### Кілька пакетів {#multiple-packages}

React є [monorepo](https://danluu.com/monorepo/). Його репозиторій містить декілька окремих пакетів, щоб їх зміни могли бути узгоджені разом, а проблемні розташовані в одному місці.

### React ядро {#react-core}

"Ядро" React включає всі [вищого рівня `React` APIs](/docs/top-level-api.html#react), для прикладу:

* `React.createElement()`
* `React.Component`
* `React.Children`

**React ядро включає лише API, необхідні для визначення компонентів.** Воно не включає [reconciliation](/docs/reconciliation.html) алгоритми, або ж будь який специфічний для платформи код. Воно використовується двома компонентами React DOM і React Native.

Код для ярда React розміщений в [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) в дереві джерела. Воно також доступно в npm як [`react`](https://www.npmjs.com/package/react) package. Відповідна окрема збірка браузера називається `react.js`, і вона експортується глобально під назвою` React`.

### Рендери {#renderers}

Спочатку React був створений для DOM, але пізніше він був адаптований також для підтримки нативної платформи [React Native](https://reactnative.dev/). Це ввело поняття "рендерів" в React 
internals.

**Рендери керують як дерево React дерево перетворюється на основні виклики платформи.**

Рендери також розміщені в [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [React DOM Renderer](https://github.com/facebook/react/tree/master/packages/react-dom) рендерить React компоненти в DOM. Це реалізує [вищого-рівня `ReactDOM` APIs](/docs/react-dom.html) і є доступним як в[`react-dom`](https://www.npmjs.com/package/react-dom) npm пакеті. Його також можна використовувати як окремий набір в браузері під назвою `react-dom.js` що експортує `ReactDOM` глобально.
* [React Native Renderer](https://github.com/facebook/react/tree/master/packages/react-native-renderer) рендерить React компоненти до нативного виду. Він використовується внутрішньо в React Native.
* [React Test Renderer](https://github.com/facebook/react/tree/master/packages/react-test-renderer) рендерить React компоненти до JSON дерев. Він використовується для [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) особливість в [Jest](https://facebook.github.io/jest) і є доступним в [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) npm пакеті.

Єдиний інший офіційно підтримуваний рендер є [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). Раніше був у окремому [GitHub репозиторії](https://github.com/reactjs/react-art) але ми зараз ми перенесли його до головного дерева коду.

>**Примітка:**
>
>Технічно [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) це дуже тонкий шар, який вчить React взаємодіяти з реалізацією React Native. Справжній специфічний для платформи код, що керує нативними уявленнями, знайти можна в [React Native репозиторії](https://github.com/facebook/react-native) разом із всіма компонентами.

### Примирення {#reconcilers}

Навіть дуже різні рендери, такі як React DOM та React Native, повинні ділити багато спільної логіки. Зокрема, алгоритм [примирення](/docs/reconciliation.html) повинен бути максимально схожим, щоб декларативні рендери, впорядковані користувацькі компоненти, стан, методи життєвого циклу та референтні роботи послідовно працювали на всіх платформах.

Щоб вирішити це, різні рендери ділять між собою певний код. Ми називаємо цю частину React "примиренням". Коли оновлення, таке як `setState()` заплановано, примирення викликає `render()` на компоненти в дереві і монтує, оновлює або відключає їх.

Примирювачі не запаковані окремо, оскільки в них зараз немає публічного API. Натомість вони використовуються виключно рендерами, такими як React DOM та React Native.

### Stack Примирювач  {#stack-reconciler}

"Stack" примирювач це реалізація приведена в дію з React 15 і раніших версія. Ми з цього часу перестали його використовувати, але це детально задокументовано у [наступному розділі](/docs/implementation-notes.html).

### Fiber Примирювач {#fiber-reconciler}

"Fiber" примирювач це нове зусилля, спрямоване на вирішення проблем, притаманних для "stack", та усуненню кількох давніх проблем. Це примирення за замовчуванням з часів React 16 версії.

Його основними цілями є:

* Можливість розділяти роботу що переривається на шматки.
* Можливість розставляти пріоритети, перезавантажити та повторно використовувати робочий процес.
* Можливість поступатися між батьками та дітьми, щоб підтримувати компонування в React.
* Можливіть повертати декілька компонентів з `render()`. 
* Краща підтримка меж помилок.

Ви можете прочитати більше про React Fiber Архітектуру [ось тут](https://github.com/acdlite/react-fiber-architecture) і [тут](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). Незважаючи на те, що він поставляється з React 16, функції асинхронізації за замовчуванням ще не включені.

Його вихідний код знаходиться в [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Система подій {#event-system}

React реалізує синтетичну систему подій, яка є агностичною для рендерів і працює як з React DOM, так і з React Native. ЇЇ код розміщений у [`packages/legacy-events`](https://github.com/facebook/react/tree/master/packages/legacy-events).

Існує [відео для поглибленого вивчення коду](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 хв).

### Що далі? {#what-next}

Прочитайте [наступний розділ](/docs/implementation-notes.html) для делального вивчення про реалізацію примирення в React до 16 версії. 
Поки що, ми не задокументували внутрішні правила нового примирення.
