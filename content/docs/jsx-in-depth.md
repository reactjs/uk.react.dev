---
id: jsx-in-depth
title: JSX в деталях
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

JSX - синтаксичний цукор над функцією `React.createElement(component, props, ...children)`. Наступний JSX-вираз:

```js
<MyButton color="blue" shadowSize={2}>
  Натисти мене
</MyButton>
```

скомпілюється у:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Натисни мене'
)
```

Також ви можете використати самозакриваючийся тег, якщо відсутні дочірні елементи. Таким чином вираз:

```js
<div className="sidebar" />
```

скомпілюється у:

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

Якщо ви бажаєте перевірити, як JSX-вираз компілюється у JavaScript, спробуйте [онлайн-компілятор Babel](babel://jsx-simple-example).

## Визначення типу React-елемента {#specifying-the-react-element-type}

Перша частина JSX тегу вказує на тип React-елемента.

Типи, що починаються з великої літери, вказують, що JSX-тег посилається на React-компонент. Ці теги компілюються в пряме посилання на іменовану змінну, тому, якщо ви використовуєте JSX-вираз `<Foo />`, `Foo` має бути в області застосування.

### React має бути в області застосування {#react-must-be-in-scope}

Оскільки JSX компілюється у виклики функції `React.createElement`, бібліотека `React` також має бути в області застосування вашого JSX-виразу.

Наприклад, обидва імпорти необхідні в цьому випадку, навіть враховуючи, що `React` та `CustomButton` не викликаються на пряму в JavaScript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // повертає React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Якщо ви не користуєтеся JavaScript бандлерами та підключаєте React через тег `<script>`, то він вже доступний через глобальну змінну `React`.

### Використання запису через крапку {#using-dot-notation-for-jsx-type}

Ви також можете посилатися на React-компонент, використовуючи запис через крапку. Це зручно, коли у вас наявний модуль, що експортує багато React-компонентів. Наприклад, якщо `MyComponents.DatePicker` - компонент, то ви можете посилатися на нього напряму:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Уявіть тут {props.color} віджет вибору дати.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="блакитний" />;
}
```

### Назви типів компонентів користувача повинні починатися з великої літери {#user-defined-components-must-be-capitalized}

Коли тип елемента починається з маленької літери, то він посилається на вбудовані компоненти такі, як `<div>` чи `<span>`, та передається до `React.createElement` у вигляді рядка `'div'` чи `'span'`. Типи, що починаються з великої літери, наприклад, `<Foo />`, компілюються у `React.createElement(Foo)` та відповідають компоненту, що був визначений або імпортований у вашому JavaScript файлі.

Ми рекомендуємо використовувати назви компонентів, що починаються з великих літер. Якщо назва вашого компоненту починається з малої літери, визначте зміну, що починається з великої літери та посилається на ваш компонент, та використовуйте її в JSX.

Наприклад, наступний вираз не буде працювати, як очікується:

```js{3,4,10,11}
import React from 'react';

// Невірно! Цей компонент має починатися з великої літери:
function hello(props) {
  // Вірно! Використання <div> тут правомірне тому, що div - валідний HTML тег:
  return <div>Привіт {props.toWhat}</div>;
}

function HelloWorld() {
  // Невірно! React сприймає <hello /> як HTML тег тому, що він починається з маленької літери:
  return <hello toWhat="світ" />;
}
```

Щоб виправити, ми перейменуємо `hello` у `Hello` та використаємо `<Hello />`, коли будемо посилатися на нього:

```js{3,4,10,11}
import React from 'react';

// Вірно! Цей компонент має починатися з великої літери:
function Hello(props) {
  // Вірно! Використання <div> тут правомірне тому, що div - валідний HTML тег:
  return <div>Привіт {props.toWhat}</div>;
}

function HelloWorld() {
  // Вірно! React знає, що <Hello /> є компонентом, бо він починається з великої літери.
  return <Hello toWhat="світ" />;
}
```

### Вибір типу під час виконання {#choosing-the-type-at-runtime}

В якості типу React-елементу не можна використовувати вирази. Якщо ви все ж захочете скористатися виразом для визначення типу елемента, призначте його в змінну, що починається з великої літери. Зазвичай це потрібно, якщо ви хочете застосувати різні компоненти в залежності від пропсів:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Невірно! JSX-тип не може бути виразом.
  return <components[props.storyType] story={props.story} />;
}
```

Щоб це виправити, ми маємо спершу визначемо змінну, що починається з великої літери, зі значенням цільвого компоненту:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Вірно! JSX-тип може бути змінною, що починається з великої літери.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## Пропси в JSX {#props-in-jsx}

Існує декілька шляхів для передачі пропсів в JSX.

### JavaScript вирази як пропси {#javascript-expressions-as-props}

Ви можете передавати будь-які Javascript вирази як пропси, обгорнувши їх у фігурні дужки `{}`. Наприклад, як в цьому JSX:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

Для `MyComponent` значення `props.foo` буде рівне `10` тому, що вираз `1 + 2 + 3 + 4` буде обчислений.

Оператор `if` та цикл `for` не є виразами в JavaScript, тому їх не можна використати безпосередньо в JSX. Натомість ви можете застосувати їх в коді, що передує використання їх результату. Наприклад:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>парне</strong>;
  } else {
    description = <i>непарне</i>;
  }
  return <div>{props.number} - {description} число</div>;
}
```

Ви можете дізнатися більше про [умовний рендеринг](/docs/conditional-rendering.html) та [цикли](/docs/lists-and-keys.html) у відповідниx розділах.

### Рядкові літерали {#string-literals}

Ви можете передати рядковий літерал як проп. Ці два вирази еквівалентні:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Коли ви передаєте рядковий літерал, всі його символи будуть екрановані у відповідності до HTML-сутностей. Тому наступні два записи еквівалентні:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Зазвичай така поведінка немає вас турбувати. Вона описана для повноти інформації.

### Пропси за замовчуванням встановлені в "true" {#props-default-to-true}

Якщо ви не передасте жодного значення пропу, то за замовчуванням його значення дорівнюватиме `true`. Ці два записи еквівалентні:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

Здебільшого, ми не рекомендуємо робити так, тому що цей запис може бути сплутаний зі [скороченням імен властивостей з ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) Наприклад, `{foo}` — короткий запис `{foo: foo}`, а не `{foo: true}`. Ця поведінка існує, тому що відповідає поведінці HTML.

### Атрибути розпакування {#spread-attributes}

Якщо ви вже маєте визначені пропси в об'єкті `props` та хочете передати їх в JSX, то ви можете скористатися оператором розпакування `...`, щоб це зробити. Ці два компоненти еквівалентні:

```js{7}
function App1() {
  return <Greeting firstName="Бен" lastName="Гектор" />;
}

function App2() {
  const props = {firstName: 'Бен', lastName: 'Гектор'};
  return <Greeting {...props} />;
}
```

Ви також можете вибрати визначені пропси, що будуть використовуватися вашим компонентом, в той час як інші пропси можна передати за допомогою оператора розпакування.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("натиснуто!")}>
        Привіт світ!
      </Button>
    </div>
  );
};
```

В попередньому прикладі, проп `kind` використовується безпечно та *не* передається в елемент `<button>`, що знаходиться в DOM.
Всі інші пропси передаються за допомогою об'єкту `...other`, що робить компонент справді гнучким. Це можна помітити на прикладі пропсів `onClick` та `children`, що передаються в `<button>`.

Оператори розпакування можуть бути корисним, проте вони дозволяють передавати непотрібні пропси в комопненти або невалідні HTML атрибути в DOM. Ми рекомендуємо використовувати цей синтаксис з обережністю.

## Дочірні компоненти в JSX {#children-in-jsx}

У JSX-виразах контент, що міститься між відкриваючим та закриваючим тегами, передається через спеціальний проп `props.children`. Існує декілька варіантів передачі дочірніх елементів:

### Рядкові літерали {#string-literals-1}

Ви можете розмістити рядок між відкриваючим та закриваючими тегами, тоді `props.children` дорівнюватиме цьому рядку. Це корисно при створенні вбудованих HTML-елементів. Наприклад:

```js
<MyComponent>Привіт світ!</MyComponent>
```

Це приклад валідного JSX, де значення `props.children` у `MyComponent` дорівнюватиме рядку `"Hello world!"`. HTML не екранується, тому ви можете писати JSX так наче ви пишете HTML:

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX прибирає пусті рядки та пробіли на початку та в кінці рядка. Переходи на нові рядки, що прилягають до тегів, видаляються; переходи на нові рядки, що знаходяться між рядковими літералими стискаються до одного пробілу. Таким чином наступні вирази дадуть однаковий результат:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### Дочірні JSX-елементи {#jsx-children}

Для відображення вкладених компонентів, можна передавати декілька JSX-елементів:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Ви можете міксувати різні типи нащадків разом, отже у такий спосіб можна використовувати рядкові літерали разом з JSX-елементами. Це ще один приклад того, як JSX схожий на HTML, до того ж наступний код валідний як для JSX, так і для HTML:

```html
<div>
  Наступним йде список:
  <ul>
    <li>Елемент 1</li>
    <li>Елемент 2</li>
  </ul>
</div>
```

Також React-компонент може повертати масив елементів:

```js
render() {
  // Немає необхідності обгортати список елементів в додатковий елемент!
  return [
    // Не забудьте про ключі :)
    <li key="A">Перший елемент</li>,
    <li key="B">Другий елемент</li>,
    <li key="C">Третій елемент</li>,
  ];
}
```

### JavaScript вирази як дочірні елементи {#javascript-expressions-as-children}

Ви можете передати будь-який JavaScript вираз як дочірній елемент, записавши його у фігурних дужках `{}`. Наприклад, ці вирази еквівалентні:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

Часто це буває корисним для рендерингу списку JSX-виразів довільної довжини. Наприклад, цей код рендерить HTML-список:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['закінчити документацію', 'надіслати пулреквест', 'нагадати Дену за рев`ю'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

JavaScript вирази можуть використовуватися разом з іншими типами дочірніх елементів. Їх також буває корисно використовувати замість шаблонних рядків:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Функції як дочірні елементи {#functions-as-children}

Зазвичай JavaScript вирази, що прописані в JSX, перетворюються в рядок, React-елемент, або список з попередніх. Проте `props.children` працює так само, як і будь-який інший проп, тому він може передавати будь-який тип даних, а не тільки ті, що React знає як рендерити. Наприклад, якщо ви маєте компонент користувача, ви можете передати функцію зворотнього вигляду у `props.children`:

```js{4,13}
// Викликати numTimes разів дочірню функцію зворотнього виклику для створення повторюваних компонентів
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>Це елемент {index} у списку</div>}
    </Repeat>
  );
}
```

Дочірні елементи, що передаються в компонент користувача, можуть бути будь-чим за умови, що компонент перетворить їх у щось, що React зможе зрозуміти та відрендерити. Дана техніка непоширена, але нею можна скористатися, якщо захочете розширити можливості JSX.

### Логічні значення, null та undefined ігноруються {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, та `true` — валідні дочірні елементи. Вони просто не рендеряться. Ці JSX-вирази дадуть однаковий результат:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Це може бути корисним при умовному рендерингу React-елементів. Наступний JSX-вираз відрендерить `<Header />` за умови, що `showHeader` дорівнює `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Існує одне зауваження, що React все одно рендерить ["неправдиві"(falsy) значення](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), такі як число `0`. Наприклад, наступний код відпрацює не так, як очікується, тому що `0` буде виведено, коли `props.messages` буде пустим масивом:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

Щоб це виправити, будьте певні, що вираз перед оператором `&&` — boolean:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

 Якщо ви хочете, щоб значення `false`, `true`, `null`, чи `undefined` навпаки потрапили до результату, вам необхідно попередньо [перетворити їх у рядок](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion):

```js{2}
<div>
  Моя Javascript змінна - {String(myVariable)}.
</div>
```
