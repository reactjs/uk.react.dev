---
id: typechecking-with-proptypes
title: Перевірка типів за допомогою PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Примітка:
>
> `React.PropTypes` переміщено в інший пакет починаючи з React версії 15.5. Будь-ласка надалі замість нього використовуйте [бібліотеку `prop-types`](https://www.npmjs.com/package/prop-types).
>
>Ми надаємо [codemod-скрипт](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) для автоматизації міграції коду.

По мірі зростання вашого застосунка ви зможете піймати багато помилок з використанням перевірки типів. Для деяких застосунків ви можете використовувати розширення JavaScript, такі як [Flow](https://flow.org/) чи [TypeScript](https://www.typescriptlang.org/), щоб перевірити типи у всьому застосунку. Але, навіть якщо ви ними не користуєтесь, React надає вбудовані можливості перевірки типів. Для виконання перевірки типів пропсів ви можете присвоїти спеціальну властивість `propTypes` компоненту:

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

`PropTypes` експортує ряд валідаторів, які можуть бути використані щоб впевнетись, що ви отримали вірні дані. В наведеному вище прикладі ми викостивуємо `PropTypes.string`. Якщо якийсь проп отримає невірне значення, в консолі  JavaScript буде показано попередження. З міркувань продуктивності `propTypes` перевіряються лише в режимі розробки.

### PropTypes {#proptypes}

Приклад використання наявних валідаторів:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // Ви можете декларувати, що проп має вказаний JS тип.
  // Ці типи за замовченням дозволяють відсутність значення.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func, // наприклад, приймає функцію або відсутнє значення
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Все, що може бути відрендерено:
  // числа, рядки, елементи чи
  // масив (або фрагмент), що містить вищезгадані типи.
  optionalNode: PropTypes.node,

  // React-елемент.
  optionalElement: PropTypes.element,

  // Ви можете вказати, що проп має бути екземпляром вказаного класу.
  // Для перевірки буде використано оператор instanceof.
  optionalMessage: PropTypes.instanceOf(Message),

  // Ви можете впевнитись, що проп може мати тільки певні значення
  // за допомогою перерахування.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // Об'єкт, одного з перерахованих типів
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // Масив елементів певного типу
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // Об'єкт з властивостями вказаного типу
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // Об'єкт вказаної форми
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // Ви можете додати `isRequired` після будь-якого з наведених вище типів.
  // В цьому випадку буде показано попередження, якщо проп не надано.
  requiredFunc: PropTypes.func.isRequired,

  // Значення будь-якого типу
  requiredAny: PropTypes.any.isRequired,

  // Ви також можете вказати власну функцію-валідатор.
  // Вона повинна повернути об'єкт Error, якщо валідація не пройшла.
  // Не викликайте `console.warn` і не кидайте виключення,
  // так як це не працюватиме в середині конструкції `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Проп `' + propName + '` переданий компоненту ' +
        ' `' + componentName + '` має не вірне значення.'
      );
    }
  },

  // Ви також можете вказати власну функцію-валідатор для `arrayOf` та `objectOf`.
  // Вона повинна повернути об'єкт Error, якщо валідація не пройшла.
  // Вказана функція буде викликана для кожного ключа об'єкта або індексу масиву.
  // Першим аргументом в функцію-валідатор буде передано сам об'єкт або масив,
  // а другим — ключ/індекс поточного елементу.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Проп `' + propFullName + '` переданий компоненту ' +
        ' `' + componentName + '` має не вірне значення.'
      );
    }
  })
};
```

### Requiring Single Child {#requiring-single-child}

With `PropTypes.element` you can specify that only a single child can be passed to a component as children.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Default Prop Values {#default-prop-values}

You can define default values for your `props` by assigning to the special `defaultProps` property:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

If you are using a Babel transform like [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) , you can also declare `defaultProps` as static property within a React component class. This syntax has not yet been finalized though and will require a compilation step to work within a browser. For more information, see the [class fields proposal](https://github.com/tc39/proposal-class-fields).

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

The `defaultProps` will be used to ensure that `this.props.name` will have a value if it was not specified by the parent component. The `propTypes` typechecking happens after `defaultProps` are resolved, so typechecking will also apply to the `defaultProps`.
