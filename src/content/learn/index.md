---
title: Швидкий старт
---

<Intro>

Ласкаво просимо до документації React! Ця сторінка надасть вам уявлення про 80% концепцій React, які ви будете використовувати на щоденній основі.

</Intro>

<YouWillLearn>

- Як створювати та вкладати компоненти
- Як додати розмітку та стилі
- Як відображати дані
- Як відображати умови та списки
- Як реагувати на події та оновлювати екран
- Як обмінюватися даними між компонентами

</YouWillLearn>

## Створення та вкладення компонентів {/*components*/}

React додатки складаються з *компонентів*. Компонент це частина UI (інтерфейсу користувача), яка має власну логіку та зовнішній вигляд. Компонент може бути маленьким, як кнопка, або ж розміром з цілу сторінку.

React компоненти це JavaScript функції які повертають розмітку:

```js
function MyButton() {
  return (
    <button>Я кнопка</button>
  );
}
```

Тепер, коли ви оголосили `MyButton`, ви можете вставити його в інший компонент:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Ласкаво просимо до мого додатку</h1>
      <MyButton />
    </div>
  );
}
```

Зверніть увагу, що `<MyButton />` починається з великою літери. Таким чином ви розумієте, що це React-компонент. Назви компонентів React завжди мають починатися з великої літери, тоді як теги HTML мають бути у нижньому регістрі.

Погляньте на результат:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Я кнопка
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Ласкаво просимо до мого додатку</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

Ключові слова `export default` вказують на головний компонент у файлі. Якщо ви не знайомі з деякими частинами JavaScript синтаксису, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) та [javascript.info](https://uk.javascript.info/import-export) мають чудові матеріали.

## Написання розмітки з використанням JSX {/*writing-markup-with-jsx*/}

Синтаксис розмітки, яку ви бачили вище, має назву *JSX*. Це необов'язково, але більшість React-проектів використовують JSX для зручності. Усі  [інструменти, які ми рекомендуємо для локальної розробки](/learn/installation) підтримують JSX за замовчуванням.

JSX більш строгий, ніж HTML. Ви зобов'язані закривати такі теги як `<br />`. Також ваш компонент не може повертати декілька JSX тегів. Ви повинні огортати їх у спільний батьківський елемент, такий як `<div>...</div>` або пусту `<>...</>` обгортку:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>Про нас</h1>
      <p>Привіт<br />Як ваші справи?</p>
    </>
  );
}
```
Якщо у вас є багато HTML для портування у JSX, ви можете використовувати [онлайн конвертер.](https://transform.tools/html-to-jsx)

## Додавання стилів {/*adding-styles*/}

У React, ви вказуєте клас CSS за допомогою `className`. Він працює так само, як атрибут [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) у HTML:

```js
<img className="avatar" />
```

Потім ви записуєте для нього правила CSS в окремому файлі CSS:

```css
/* У вашому CSS */
.avatar {
  border-radius: 50%;
}
```


React не вказує, як додавати файли CSS. У найпростішому випадку ви додасте тег [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) до свого HTML. Якщо ви використовуєте інструмент збірки або фреймворк, зверніться до його документації, щоб дізнатися, як додати файл CSS до вашого проекту.

## Відображення даних {/*displaying-data*/}

JSX дозволяє розміщувати розмітку в JavaScript. Фігурні дужки дозволяють вам «втекти назад» до JavaScript, щоб ви могли вставити якусь змінну зі свого коду та показати її користувачеві. Наприклад, це відобразить `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Також ви можете "повернутись до JavaScript" з атрибутів JSX, але вам доведеться використати фігурні дужки *замість* лапок. Наприклад, `className="avatar"` передає стрічку `"avatar"` як клас CSS, але `src={user.imageUrl}` читає значення JavaScript змінної `user.imageUrl`, і тоді передає це значення як атрибут `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Ви також можете розміщувати складніші вирази у фігурних дужках JSX, наприклад, [конкатенацію стрічок](https://uk.javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Геді Ламар',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Фото ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

У наведеному вище прикладі `style={{}}` — не спеціальний синтаксис, а звичайний об’єкт `{}` у фігурних дужках JSX `style={ }`. Ви можете використовувати атрибут `style`, якщо ваші стилі залежать від змінних JavaScript.

## Умовний рендер {/*conditional-rendering*/}


У React немає спеціального синтаксису для запису умов. Замість цього ви будете використовувати ті ж прийоми, що й під час написання звичайного JavaScript коду. Наприклад, ви можете використовувати оператор [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else), щоб умовно включати JSX:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Якщо ви віддаєте перевагу більш компактному коду, ви можете використовувати [умовний оператор `?`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator). На відміну від `if`, він працює в JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Якщо вам не потрібна гілка `else`, ви також можете використовувати коротший [логічний синтаксис `&&`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```
Усі ці підходи також працюють для умовного визначення атрибутів. Якщо ви не знайомі з частиною цього синтаксису JavaScript, ви можете почати, завжди використовуючи `if...else`.

## Рендер списків {/*rendering-lists*/}

Для рендеру списків компонентів ви будете покладатися на такі особливості JavaScript, як [цикл `for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) та [метод масивів `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map).

Наприклад, припустімо, що у вас є масив продуктів:

```js
const products = [
  { title: 'Капуста', id: 1 },
  { title: 'Часник', id: 2 },
  { title: 'Яблуко', id: 3 },
];
```

У вашому компоненті використовуйте функцію map() для перетворення масиву продуктів на масив елементів `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Зверніть увагу, що `<li>` має атрибут `key`. Для кожного елемента в списку ви повинні передати стрічку або число, яке унікально ідентифікує цей елемент серед елементів його рівня. Зазвичай ключ має надходити з ваших даних, як-от ID в базі даних, наприклад. React використовує ваші ключі, щоб знати що сталося, якщо ви пізніше вставите, видалите або зміните порядок елементів.

<Sandpack>

```js
const products = [
  { title: 'Капуста', isFruit: false, id: 1 },
  { title: 'Часник', isFruit: false, id: 2 },
  { title: 'Яблуко', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'пурпуровий' : 'темно-зелений'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Реагування на події {/*responding-to-events*/}

Ви можете реагувати на події, оголошуючи функції *обробника подій* у своїх компонентах:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('Ви натиснули на мене!');
  }

  return (
    <button onClick={handleClick}>
      Натисни на мене
    </button>
  );
}
```

Зверніть увагу, що `onClick={handleClick}` не має дужок у кінці! Не _викликайте_ функцію обробника подій: вам потрібно лише *передати її*. React викличе ваш обробник подій, коли користувач натисне кнопку.

## Оновлення екрану {/*updating-the-screen*/}

Часто вам потрібно, щоб ваш компонент "запам'ятав" деяку інформацію та відобразив її. Наприклад, можливо, ви хочете підрахувати кількість натискань кнопки. Для цього додайте *стан* до свого компонента.

Спочатку, імпортуйте [`useState`](/reference/react/useState) з React:

```js
import { useState } from 'react';
```

Тепер ви можете оголосити *змінну стану* всередині вашого компонента:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Ви отримаєте дві речі від `useState`: поточний стан (`count`) і функцію, яка дозволяє його оновити (`setCount`). Ви можете дати їм будь-які назви, але прийнято писати `[something, setSomething]`.

Під час першого відображення кнопки `count` буде `0`, тому що ви передали `0` в `useState()`. Якщо ви хочете змінити стан, викличте `setCount()` і передайте йому нове значення. Натискання цієї кнопки інкрементуватиме лічильник:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Натиснуто {count} разів
    </button>
  );
}
```

React знову викличе вашу функцію компонента. Цього разу «count» буде «1». Тоді це буде "2". І так далі.

Якщо ви рендеритимете один і той самий компонент кілька разів, кожен матиме свій власний стан. Натисніть кожну кнопку окремо:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Лічильники, які оновлюються окремо</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Натиснуто {count} разів
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Зверніть увагу, як кожна кнопка "пам'ятає" свій власний стан `count` і не впливає на інші кнопки.

## Використання хуків {/*using-hooks*/}

Функції, що починаються з `use`, називаються *Хуками*. `useState` — це вбудований Хук, наданий React. Ви можете знайти інші вбудовані Хуки в [API довіднику](/reference/react). Також ви можете написати власні Хуки, комбінуючи існуючі.

Хуки є більш обмежувальними, ніж інші функції. Ви можете викликати Хуки лише *на верхньому рівні* ваших компонентів (або інших Хуків). Якщо ви хочете використовувати `useState` в умові або циклі, витягніть це в новий компонент і помістіть його туди.

## Обмін даними між компонентами {/*sharing-data-between-components*/}

У попередньому прикладі кожен `MyButton` мав власний незалежний `count`, і коли натискали кожну кнопку, змінювався лише `count` для натиснутої кнопки:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Діаграма, на якій показано дерево з трьох компонентів, один батьківський компонент із позначкою MyApp і два дочірні з позначкою MyButton. Обидва компоненти MyButton містять лічильник із нульовим значенням.">

Спочатку, кожен `MyButton` стан `count` має значення `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="Така сама діаграма, як і попередня, з виділеним `count` першого дочірнього компонента MyButton, індикуючи клік зі значенням `count` інкрементованим до одиниці. Другий компонент MyButton все ще містить нульове значення." >

Перший `MyButton` оновлює `count` до `1`

</Diagram>

</DiagramGroup>

Проте, ви часто матимете потребу щоб компоненти *розділяли між собою дані та завжди оновлювалися разом*.

Щоб змусити обидва компоненти `MyButton` відображати однаковий `count` і оновлюватися разом, вам потрібно перемістити стан від окремих кнопок "вгору" до найближчого компонента, який містить їх усіх.

У цьому прикладі це `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Діаграма, на якій показано дерево з трьох компонентів, один батьківський, названий MyApp і два дочірні - названі MyButton. MyApp містить нульове значення `count`, яке передається до обох компонентів MyButton, які також показують нульове значення." >

Спочатку, стан `count` у `MyApp` дорівнює `0` і передається обом дочірнім елементам

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="Така сама діаграма, як і попередня, з виділеним `count` батьківського компонента MyApp, індикуючи клік зі значенням інкрементованим до одиниці. Потік до обох дочірніх компонентів MyButton також виділено, а значення підрахунку в кожному дочірньому компоненті встановлено на одиницю, що вказує на те, що значення було передано." >

Після натискання `MyApp` оновлює свій стан `count` до `1` і передає його обом нащадкам

</Diagram>

</DiagramGroup>

Тепер, коли ви натискаєте будь-яку кнопку, `count` у `MyApp` зміниться, що змінить обидва лічильники в `MyButton`. Ось як ви можете виразити це в коді.

Спочатку *підніміть стан* з `MyButton` до `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Лічильники, які оновлюються окремо</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... ми переносимо код звідси ...
}

```

Потім *передайте стан* від `MyApp` до кожного `MyButton` разом зі спільним обробником кліків. Ви можете передавати інформацію в `MyButton` за допомогою фігурних дужок JSX, так само, як ви робили раніше з вбудованими тегами, як-от `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Лічильники, які оновлюються окремо</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Інформація, яку ви передаєте таким чином, називається _пропси_. Тепер компонент `MyApp` містить стан `count` і обробник події `handleClick` і *передає їх обидва як пропси* кожній з кнопок.

Нарешті, змініть `MyButton` на *читання* пропсів, які ви передали від його батьківського компонента:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Натиснуто {count} разів
    </button>
  );
}
```

Коли ви натискаєте кнопку, запускається обробник `onClick`. Пропс `onClick` кожної кнопки було налаштовано на функцію `handleClick` всередині `MyApp`, тому код у ньому виконується. Цей код викликає `setCount(count + 1)`, інкрементуючи змінну стану `count`. Нове значення `count` передається як атрибут для кожної кнопки, тому всі вони показують нове значення. Це називається «підйом стану». Піднявши стан вгору, ви поділилися ним між компонентами.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Лічильники, які оновлюються окремо</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Натиснуто {count} разів
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Подальші кроки {/*next-steps*/}

Тепер ви знаєте основи написання React коду!

Перегляньте [Туторіал](/learn/tutorial-tic-tac-toe) щоб застосувати їх на практиці та створити свій перший міні-додаток із React.
