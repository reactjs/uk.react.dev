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

### Вимога єдиного дочірнього елемента {#requiring-single-child}

З `PropTypes.element` ви можете вказати, що лише один елементможе бути переданий компоненту в якості дочірнього.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // Це повинен бути саме один елемент бо інакше з'явиться попередження.
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

### Значення пропсів за замовчуванням {#default-prop-values}

Ви можете задати значення за замовчуванням для ваших пропсів присвоївши спеціальну властивість `defaultProps`:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Привіт, {this.props.name}</h1>
    );
  }
}

// Задає значення пропсів за замовчуванням:
Greeting.defaultProps = {
  name: 'Незнайомець'
};

// Реднерить "Привіт, Незнайомець":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

Якщо ви використовуєте Babel-плагін по трансформації коду [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/), то ви можете задати `defaultProps` як статичну властивість класу React-компонента. Цей синтаксис ще поки не затверджено, і він потребує компіцяцію для того, щоб ваш компонент працював у браузері. Щоб дізнатись більше, дивіться  [пропозицію про поля класу](https://github.com/tc39/proposal-class-fields).

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'Незнайомець'
  }

  render() {
    return (
      <div>Привіт, {this.props.name}</div>
    )
  }
}
```

Властивість `defaultProps` гарантує, що `this.props.name` матиме значення навіть якщо воно не було задане батьківським компонентом. Перевірка типів `propTypes` відбувається після застосування `defaultProps`, тобто вона також приміненяється для `defaultProps`.
