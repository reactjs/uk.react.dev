---
title: Don't Call PropTypes Warning
layout: single
permalink: warnings/dont-call-proptypes.html
---

> Примітка:
>
> `React.PropTypes` був переміщений в окремий пакет, починаючи з React v15.5. Будь ласка, використовуйте натомість [`prop-types` бібліотеку](https://www.npmjs.com/package/prop-types).
>
>Ви можете використовувати [codemod-скрипт](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) для автоматизації переходу.

У майбутньому мажорному релізі React, код, який використовує функції перевірки PropType, буде видалений в продакшині. Як тільки це станеться, будь-який код, що викликає ці функції напряму (він не видаляється у продакшині), видасть помилку.

### Оголошення PropTypes все ще підтримуються {#declaring-proptypes-is-still-fine}

Нормальне використання PropTypes все ще підтримується:

```javascript
Button.propTypes = {
  highlighted: PropTypes.bool
};
```

Нічого не змінилося тут.

### Не викликайте PropTypes напряму {#dont-call-proptypes-directly}

Використання PropTypes у будь-який інший спосіб, ніж анотація компонентів React з ними, більше не підтримується:

```javascript
var apiShape = PropTypes.shape({
  body: PropTypes.object,
  statusCode: PropTypes.number.isRequired
}).isRequired;

// Не підтримується!
var error = apiShape(json, 'response');
```

Якщо ви звикли використовувати PropTypes, як показано вище, ми рекомендуємо вам використовувати або створити форк PropTypes (по прикладу [цих](https://github.com/aackerman/PropTypes) [двох](https://github.com/developit/proptypes) пакетів).

Якщо ви не виправите це попередження, ваш код не буде працювати в продакшині при використанні React 16.

### Якщо ви не викликаєте PropTypes напряму, але все одно отримуєте попередження {#if-you-dont-call-proptypes-directly-but-still-get-the-warning}

Перевірте стек викликів, що створений за допомогою цього попередження. Ви знайдете визначення компонента, відповідального за прямий виклик PropTypes. Швидше за все, проблема пов'язана із сторонніми PropTypes, які розширюють PropTypes у React, наприклад:

```js
Button.propTypes = {
  highlighted: ThirdPartyPropTypes.deprecated(
    PropTypes.bool,
    'Use `active` prop instead'
  )
}
```

У цьому випадку `ThirdPartyPropTypes.deprecated` огортає виклик `PropTypes.bool`. Сам по собі цей шаблон непоганий, але викликає помилкове попередження, оскільки React вважає, що ви викликаєте PropTypes напряму. У наступному розділі пояснюється, як виправити цю проблему для бібліотеки, що реалізує щось на зразок `ThirdPartyPropTypes`. Якщо цю бібліотеку писали не ви — можете створити звіт про неї в репозиторії автора.

### Виправлення помилкових попереджень у сторонніх PropTypes {#fixing-the-false-positive-in-third-party-proptypes}

Якщо ви є автором сторонньої бібліотеки PropTypes, і ви дозволяєте користувачам огортати існуючі React PropTypes, вони можуть побачити це попередження. Це відбувається тому, що React не бачить "секретного" останнього аргументу, який [передається](https://github.com/facebook/react/pull/7132) для виявлення прямих викликів PropTypes.

Це можна виправити наступним чином — будемо використовувати `deprecated` з [react-bootstrap/react-prop-types](https://github.com/react-bootstrap/react-prop-types/blob/0d1cd3a49a93e513325e3258b28a82ce7d38e690/src/deprecated.js). Поточна реалізація передає лише аргументи `props`, `propName` та `componentName`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName) {
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName);
  };
}
```

Для того, щоб виправити помилкове попередження, переконайтеся, що ви передали **всі** аргументи до огорнутого PropType. Це легко зробити з використанням синтаксиса ES6 `...rest`:

```javascript
export default function deprecated(propType, explanation) {
  return function validate(props, propName, componentName, ...rest) { // Зверніть увагу на  ...rest
    if (props[propName] != null) {
      const message = `"${propName}" property of "${componentName}" has been deprecated.\n${explanation}`;
      if (!warned[message]) {
        warning(false, message);
        warned[message] = true;
      }
    }

    return propType(props, propName, componentName, ...rest); // і тут
  };
}
```

Це зупинить вивід попередження.
