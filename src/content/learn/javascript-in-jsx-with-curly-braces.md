---
title: JavaScript у JSX із фігурними дужками
---

<Intro>

JSX дозволяє вам писати HTML-подібну розмітку всередині файлу JavaScript, тримаючи логіку відображення та вміст в одному місці. Іноді вам потрібно додати трохи JavaScript логіки або звернутися до динамічних властивостей всередині цієї розмітки. У цій ситуації ви можете використовувати фігурні дужки у вашому JSX, щоб взаємодіяти з JavaScript.

</Intro>

<YouWillLearn>

- Як передати стрічки з лапками
- Як звернутися до змінної JavaScript всередині JSX за допомогою фігурних дужок
- Як викликати функцію JavaScript всередині JSX за допомогою фігурних дужок
- Як використовувати об'єкт JavaScript всередині JSX за допомогою фігурних дужок

</YouWillLearn>

## Передача стрічок з лапками {/*passing-strings-with-quotes*/}
Коли ви хочете передати атрибут-стрічку в JSX, ви поміщаєте його в одинарні або подвійні лапки:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Грегоріо І. Зара (Gregorio Y. Zara)"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Тут `"https://i.imgur.com/7vQD0fPs.jpg"` та `"Грегоріо І. Зара (Gregorio Y. Zara)"` передаються як рядки.

Але що, якщо ви хочете динамічно вказати `src` або текст `alt`? Ви можете **використовувати значення з JavaScript, замінивши `"` та `"` на `{` та `}`**:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Грегоріо І. Зара (Gregorio Y. Zara)';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Зверніть увагу на відмінність між `className="avatar"`, який вказує на ім'я CSS-класу `"avatar"`, що робить зображення круглим, та `src={avatar}`, який читає значення змінної JavaScript, яка називається `avatar`. Це тому, що фігурні дужки дозволяють вам використовувати JavaScript прямо у розмітці!

## Використання фігурних дужок: Вікно до світу JavaScript {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX - це особливий спосіб написання JavaScript. Це означає, що в ньому можна використовувати JavaScript за допомогою фігурних дужок `{ }`. У наведеному нижче прикладі спочатку оголошується ім'я для вченого, `name`, а потім вбудовується з фігурними дужками всередині тегу `<h1>`:

<Sandpack>

```js
export default function TodoList() {
  const name = 'Грегоріо І. Зара (Gregorio Y. Zara)';
  return (
    <h1>Список справ {name}</h1>
  );
}
```

</Sandpack>

Спробуйте змінити значення `name` з `'Грегоріо І. Зара (Gregorio Y. Zara)'` на `'Геді Ламар (Hedy Lamarr)'`. Бачите, як змінюється заголовок списку?

Будь-який вираз JavaScript працюватиме всередині фігурних дужок, включаючи виклики функцій, наприклад `formatDate()`:

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'uk-UA',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>Список справ на {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Де використовувати фігурні дужки {/*where-to-use-curly-braces*/}

Фігурні дужки можна використовувати в JSX двома способами:

1. **Як текст** безпосередньо всередині тегу JSX: `<h1>Список справ {name}</h1>` працює, але `<{tag}>Список справ Грегоріо І. Зара (Gregorio Y. Zara)</{tag}>` - ні.
2. **Як атрибути** безпосередньо після знаку `=`: `src={avatar}` прочитає змінну `avatar`, але `src="{avatar}"` передасть рядок `"{avatar}"`.

## Використання "подвійних фігурних дужок": CSS та інші об'єкти в JSX {/*using-double-curlies-css-and-other-objects-in-jsx*/}

Крім рядків, чисел та інших виразів JavaScript, ви навіть можете передавати об'єкти в JSX. Об'єкти також позначаються фігурними дужками, наприклад `{ name: "Геді Ламар (Hedy Lamarr)", inventions: 5 }`. Отже, щоб передати JS об'єкт в JSX, ви повинні обгорнути його в іншу пару фігурних дужок: `person={{ name: "Геді Ламар (Hedy Lamarr)", inventions: 5 }}`.

Ви можете побачити це з вбудованими стилями CSS в JSX. React не вимагає вас використовувати вбудовані стилі (CSS-класи працюють добре для більшості випадків). Але коли вам потрібні вбудовані стилі, ви передаєте об'єкт атрибута `style`:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Покращити відеотелефон</li>
      <li>Підготувати лекції з авіаційних технологій</li>
      <li>Працювати над двигуном на спиртовому паливі</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Спробуйте змінити значення `backgroundColor` та `color`.

Ви справді можете побачити об'єкт JavaScript всередині фігурних дужок, коли ви пишете його таким чином:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

Наступного разу, коли ви побачите `{{` та `}}` в JSX, знайте, що це не більше, ніж об'єкт всередині фігурних дужок JSX!

<Pitfall>

Вбудовані властивості `style` записуються в camelCase. Наприклад, HTML `<ul style="background-color: black">` буде записано як `<ul style={{ backgroundColor: 'black' }}>` в вашому компоненті.

</Pitfall>

## Більше розваг з об'єктами JavaScript та фігурними дужками {/*more-fun-with-javascript-objects-and-curly-braces*/}

Ви можете об'єднати кілька виразів у один об'єкт і посилатися на них у вашому JSX всередині фігурних дужок:

<Sandpack>

```js
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Задачі {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Грегоріо І. Зара (Gregorio Y. Zara)"
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

У цьому прикладі JavaScript об'єкт `person` містить рядок `name` та об'єкт `theme`:

```js
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Компонент може використовувати ці значення з `person` так:

```js
<div style={person.theme}>
  <h1>{person.name}'s Справи</h1>
```

JSX є дуже мінімальною, як мова шаблонізації, оскільки вона дозволяє вам організовувати дані та логіку за допомогою JavaScript.

<Recap>

Тепер ви майже все знаєте про JSX:

* Атрибути JSX всередині лапок передаються як рядки.
* Фігурні дужки дозволяють вам використовувати логіку та змінні JavaScript у вашій розмітці.
* Вони працюють всередині вмісту тегу JSX або безпосередньо після `=` в атрибутах.
* `{{` та `}}` - це не спеціальний синтаксис: це об'єкт JavaScript, який знаходиться всередині фігурних дужок JSX.

</Recap>

<Challenges>

#### Виправте помилку {/*fix-the-mistake*/}

Цей код видає помилку `Objects are not valid as a React child`:

<Sandpack>

```js
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Задачі {person}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Грегоріо І. Зара (Gregorio Y. Zara)"
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Ви можете знайти проблему?

<Hint>Подивіться, що знаходиться всередині фігурних дужок. Чи кладемо ми правильні дані туди?</Hint>

<Solution>

Це трапляється тому, що в цьому прикладі виводиться *сам об'єкт* у розмітку, а не рядок: `<h1>{person}'s Справи</h1>` намагається відобразити весь об'єкт `person`! Включення цілого об'єкта як вмісту тексту викликає помилку, оскільки React не знає, як ви хочете його відобразити.

Щоб виправити це, замініть `<h1>{person}'s Справи</h1>` на `<h1>{person.name}'s Справи</h1>`:

<Sandpack>

```js
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Задачі {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Грегоріо І. Зара (Gregorio Y. Zara)"
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Виділіть інформацію в об'єкт {/*extract-information-into-an-object*/}

Виділіть URL зображення в об'єкт `person`.

<Sandpack>

```js
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Задачі {person.name}</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Грегоріо І. Зара (Gregorio Y. Zara)"
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Перемістіть URL зображення у властивість під назвою `person.imageUrl` та прочитайте його з тегу `<img>` за допомогою фігурних дужок:

<Sandpack>

```js
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Задачі {person.name}</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Грегоріо І. Зара (Gregorio Y. Zara)"
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Напишіть вираз всередині фігурних дужок JSX {/*write-an-expression-inside-jsx-curly-braces*/}

У наведеному нижче об'єкті повний URL зображення розбитий на чотири частини: базовий URL, `imageId`, `imageSize`, та розширення файлу.

Ми хочемо, щоб URL зображення комбінував ці атрибути разом: базовий URL (завжди `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), та розширення файлу (завжди `'.jpg'`). Однак щось неправильно з вказанням `src` у теґу `<img>`.

Чи можете ви це виправити?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Задачі {person.name}</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Щоб перевірити, чи працює ваше виправлення, спробуйте змінити значення `imageSize` на `'b'`. Зображення повинно змінити розмір після вашого редагування.

<Solution>

Ви можете записати це як `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.

1. `{` відкриває вираз JavaScript
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` генерує правильний рядок URL
3. `}` закриває вираз JavaScript

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Задачі {person.name}</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Ви також можете перемістити цей вираз в окрему функцію, наприклад, `getImageUrl` нижче:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Грегоріо І. Зара (Gregorio Y. Zara)',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>Задачі {person.name}</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Покращити відеотелефон</li>
        <li>Підготувати лекції з авіаційних технологій</li>
        <li>Працювати над двигуном на спиртовому паливі</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Змінні та функції можуть допомогти вам зберегти розмітку простою!

</Solution>

</Challenges>
