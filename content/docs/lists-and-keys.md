---
id: lists-and-keys
title: Списки та ключі
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Спочатку давайте згадаємо, як перетворити списки у JavaScript.

У коді, наведеному нижче, ми використовуємо функцію [`map()`](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Array/map), щоб подвоїти значення в масиві `numbers`. Ми призначаємо новий масив, що повертається з `map()` до змінної `doubled` і виводимо її в консоль:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Цей код виведе `[2, 4, 6, 8, 10]` у консоль.

У React, перетворення масивів у список [елементів](/docs/rendering-elements.html) майже ідентичне.

### Рендеринг декількох компонентів {#rendering-multiple-components}

Ви можете створити колекції елементів і [вбудувати їх у JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) за допомогою фігурних дужок `{}`.

Нижче, пройдемо по масиву `numbers` використовуючи функцію JavaScript [`map()`](https://developer.mozilla.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Array/map), і повернемо елемент `<li>` у кожній ітерації. Нарешті, одержаний масив елементів збережемо у `listItems`:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

Тепер ми включимо масив `listItems` цілком всередину елемента `<ul>`, і [будемо рендерити його у DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Цей код виведе маркований список чисел від 1 до 5.

### Простий компонент-список {#basic-list-component}

Зазвичай, ви будете рендерити списки всередині якогось [компонента](/docs/components-and-props.html).

<<<<<<< HEAD
<<<<<<< HEAD
We can refactor the previous example into a component that accepts an array of `numbers` and outputs a list of elements.
=======
Ми можемо отрефакторити попередній приклад з використанням компонента, котрий приймає масив `numbers` та виводить невпорядкований список елементів.
>>>>>>> Translated into Ukrainian lists-and-keys.md file
=======
Ми можемо відрефакторити попередній приклад з використанням компонента, котрий приймає масив `numbers` та виводить невпорядкований список елементів.
>>>>>>> Fixed translation in list-and-keys.md file

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

Коли ви запустите цей код, ви отримаєте попередження, що для елементів списку має бути вказано ключ. "Ключ" - це спеціальний рядковий атрибут, який потрібно вказувати при створенні списку елементів. Ми обговоримо, чому це важливо, у наступній секції.

Щоб виправити проблему з невказаними ключами, додамо нашим елементам `key` атрибут списку всередині `numbers.map()`.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Ключі {#keys}

Ключі допомагають React визначити, які елементи були змінені, додані або видалені. Ключі повинні бути надані елементам всередині масиву, щоб надати елементам стабільну ідентичність:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Найкращий спосіб вибрати ключ - це використати рядок, котрий буде вочевидь відрізняти елемент списку від його сусідів. Найчастіше ви будете використовувати ID з ваших даних як ключі:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Якщо у вас немає стабільних ID для відрендерених елементів, то в крайньому випадку можна використовувати індекс елемента як ключ:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Робіть так, тільки якщо у елементів масиву немає заданого ID
  <li key={index}>
    {todo.text}
  </li>
);
```

Ми не рекомендуємо використовувати індекси для ключів, якщо порядок елементів може змінюватися. Це може негативно вплинути на продуктивність та може викликати проблеми зі станом компонента. Почитайте статтю Робіна Покорни (Robin Pokorny), [яка досконало пояснює, чому індекси-ключі призводять до проблем](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). Якщо ви вирішите не призначити ключ для елемента в списку, то React за замовчуванням буде використовувати індекси як ключі.

Якщо ви зацікавлені в отриманні додаткової інформації - ось [детальне пояснення того, чому ключі необхідні](/docs/reconciliation.html#recursing-on-children).

### Вилучення компонентів з ключами {#extracting-components-with-keys}

Ключі необхідно визначати безпосередньо всередині масивів.

Наприклад, якщо ви [витягаєте](/docs/components-and-props.html#extracting-components) компонент `ListItem`, то потрібно вказувати ключ для `<ListItem />` елементів в масиві замість елемента `<li>` всередині самого `ListItem`.

**Приклад невірного використання ключів**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Невірно! Немає необхідності визначати тут ключ:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Невірно! Ключ необхідно визначити тут:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Приклад вірного використання ключів**

```javascript{2,3,9,10}
function ListItem(props) {
  // Вірно! Тут не потрібно визначати ключ:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Вірно! Ключ потрібно визначати всередині масиву:
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

Елементам усередині `map()` зазвичай потрібні ключі.

### Ключі повинні бути унікальними лише між сусідніх елементів {#keys-must-only-be-unique-among-siblings}

Ключі, що використовуються в масивах, повинні бути унікальними тільки серед своїх сусідніх елементів. Однак їм не потрібно бути унікальними глобально. Можна використовувати той самий ключ в двох різних масивах:

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Привіт, світ', content: 'Ласкаво просимо до вивчення React!'},
  {id: 2, title: 'Установка', content: 'React можна встановити через npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Ключі слугують підказками для React, але вони ніколи не передаються до ваших компонентів. Якщо в компоненті потрібно те ж саме значення, то передайте його явно через проп з іншим ім'ям:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

У наведеному вище прикладі компонент `Post` може прочитати значення `props.id`, але не `props.key`.

### Вбудовування map() у JSX {#embedding-map-in-jsx}

У прикладах вище ми оголосили окрему змінну `listItems` та вставили її у JSX:

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX дозволяє [вбудувати будь-який вираз](/docs/introducing-jsx.html#embedding-expressions-in-jsx) у фігурні дужки, щоб ми зуміли включити результат виконання `map()`:


```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**Спробуйте на CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Іноді це призводить до більш чистого коду, але буває і навпаки. Як і в будь-якому JavaScript-коді, вам доведеться самостійно вирішувати, чи варто витягати код в змінну заради читабельності. Майте на увазі, що якщо код всередині `map()` занадто громіздкий, має сенс [витягти його в окремий компонент](/docs/components-and-props.html#extracting-components).
