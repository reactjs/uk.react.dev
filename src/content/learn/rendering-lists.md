---
title: Рендеринг списків
---

<Intro>

Часто потрібно показати кілька подібних компонентів із колекції даних. Ви можете використовувати [методи JavaScript для масивів](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#), щоб маніпулювати масивом даних. На цій сторінці ви використовуватиме [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) і [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) разом з React для фільтрування та перетворення вашого масиву даних у масив компонентів.

</Intro>

<YouWillLearn>

* Як рендерити компоненти з масиву, використовуючи `map()` з JavaScript
* Як рендерити лиш деякі компоненти, використовуючи `filter()` з JavaScript
* Коли і навіщо використовувати ключі React

</YouWillLearn>

## Рендеринг масивів даних {/*rendering-data-from-arrays*/}

Припустимо, у вас є список певних даних.

```js
<ul>
  <li>Кетрін Джонсон (Creola Katherine Johnson): математик</li>
  <li>Маріо Моліна (Mario José Molina-Pasquel Henríquez): хімік</li>
  <li>Абдус Салам (Moшинкаmad Abdus Salam): фізик</li>
  <li>Персі Джуліан (Percy Lavon Julian): хімік</li>
  <li>Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar): астрофізик</li>
</ul>
```

Єдина відмінність між цими елементами списку полягає у їхньому вмісті, їхніх даних. Під час побудови інтерфейсів вам часто буде потрібно відобразити кілька екземплярів одного компонента, використовуючи різні дані — від списків коментарів до галерей зображень профілів. У цьому разі ви можете зберігати ці дані в об'єктах і масивах JavaScript та використовувати методи як [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) і [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), щоб відрендерити з них списки компонентів.

Ось короткий приклад того, як згенерувати список елементів із масиву:

1. **Перенесіть** дані у масив:

```js
const people = [
  'Кетрін Джонсон (Creola Katherine Johnson): математик',
  'Маріо Моліна (Mario José Molina-Pasquel Henríquez): хімік',
  'Абдус Салам (Moшинкаmad Abdus Salam): фізик',
  'Персі Джуліан (Percy Lavon Julian): хімік',
  'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar): астрофізик'
];
```

1. **Перетворіть** члени масиву `people` у новий масив JSX-вузлів — `listItems`:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Поверніть** `listItems`, обгорнутий в `<ul>`, з вашого компонента:

```js
return <ul>{listItems}</ul>;
```

Ось результат:

<Sandpack>

```js
const people = [
  'Кетрін Джонсон (Creola Katherine Johnson): математик',
  'Маріо Моліна (Mario José Molina-Pasquel Henríquez): хімік',
  'Абдус Салам (Moшинкаmad Abdus Salam): фізик',
  'Персі Джуліан (Percy Lavon Julian): хімік',
  'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar): астрофізик'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Зверніть увагу, що пісочниця вище відображає помилку у консолі:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop. (Попередження: Кожен дочірній елемент у списку повинен мати унікальний проп "key".)

</ConsoleBlock>

Далі на цій сторінці ви дізнаєтеся, як виправити цю помилку. Перш ніж перейти до цього, давайте переструктуруємо ваші дані.

## Фільтрування елементів масиву {/*filtering-arrays-of-items*/}

Наші дані можна структурувати більш досвідчено. 

```js
const people = [{
  id: 0,
  name: 'Кетрін Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
}, {
  id: 1,
  name: 'Маріо Моліна (Mario José Molina-Pasquel Henríquez)',
  profession: 'хімік',
}, {
  id: 2,
  name: 'Абдус Салам (Moшинкаmad Abdus Salam)',
  profession: 'фізик',
}, {
  name: 'Персі Джуліан (Percy Lavon Julian)',
  profession: 'хімік',  
}, {
  name: 'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофізик',
}];
```

Скажімо, вам потрібен спосіб показати лише людей з професією `'хімік'`. Ви можете використовувати JavaScript-метод `filter()`, щоб отримати лише цих людей. Цей метод бере масив елементів, піддає їх "test"-у (функція, що повертає `true` або `false`) і повертає новий масив тільки тих елементів, які пройшли перевірку (повернули `true`).

Вам потрібні елементи, де `професія` — `'хімік'`. Тест-функція для цього виглядає так: `(person) => person.profession === 'хімік'`. Ось усе разом:

1. **Створіть** новий масив лише людей-хіміків, `chemists`, викликавши `filter()` для `people` і фільтруючи за `person.profession === 'хімік'`:

```js
const chemists = people.filter(person =>
  person.profession === 'хімік'
);
```

2. Тепер **перетворіть** `chemists`:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ', '}
       чиєю працею є {person.accomplishment}
     </p>
  </li>
);
```

3. Наостанок **поверніть** `listItems` з вашого компонента:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'хімік'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ', '}
        чиєю працею є {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Кетрін Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'розрахунки для космічних польотів',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Маріо Моліна (Mario José Molina-Pasquel Henríquez)',
  profession: 'хімік',
  accomplishment: 'відкриття озонової діри в Арктиці',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Абдус Салам (Moшинкаmad Abdus Salam)',
  profession: 'фізик',
  accomplishment: 'теорія електромагнетизму',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Персі Джуліан (Percy Lavon Julian)',
  profession: 'хімік',
  accomplishment: 'новаторські кортизоновмісні препарати, стероїди та протизаплідні таблетки',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофізик',
  accomplishment: 'розрахунок мас зір категорії "білий карлик"',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Функції зі стрілками (анонімні функції JavaScript) неявно повертають вираз одразу після `=>`, тому вам не потрібен оператор `return`:

```js
const listItems = chemists.map(person =>
  <li>...</li> // Неявне повернення!
);
```

Однак **ви повинні явно написати `return`, якщо за `=>` йде фігурна дужка `{`!**

```js
const listItems = chemists.map(person => { // Фігурна дужка
  return <li>...</li>;
});
```

Кажуть, що функції зі стрілками, які містять `=> {`, мають ["блок тіла".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) Вони дозволяють написати більше одного рядка коду, але ви *мусите* вказати оператор `return` самостійно. Якщо ви забудете, нічого не повернеться!

</Pitfall>

## Збереження порядку елементів списку за допомогою `key` {/*keeping-list-items-in-order-with-key*/}

Зверніть увагу, що всі пісочниці вище показують помилку в консолі:

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop. (Попередження: Кожен дочірній елемент у списку повинен мати унікальний проп "key".)

</ConsoleBlock>

Ви повинні надати кожному елементу масиву `key` — стрічкову або числову змінну, що унікально ідентифікує його серед інших елементів цього масиву:

```js
<li key={person.id}>...</li>
```

<Note>

Елементам JSX, що є обгорткою всередині виклику `map()`, завжди потрібні ключі!

</Note>

Ключі повідомляють React, якому елементу масиву відповідає кожен компонент, щоб він міг зіставити їх пізніше. Це важливо, якщо елементи масиву можуть змінювати позицію (наприклад, через сортування), вставлятися або видалятися. Добре підібраний `key` допомагає React визначити, що саме сталося, і правильно оновити дерево DOM.

Замість того, щоб генерувати ключі "на льоту", вам слід додати їх до своїх даних:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ', '}
          чиєю працею є {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // Used in JSX as a key
  name: 'Кетрін Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'розрахунки для космічних польотів',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key
  name: 'Маріо Моліна (Mario José Molina-Pasquel Henríquez)',
  profession: 'хімік',
  accomplishment: 'відкриття озонової діри в Арктиці',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key
  name: 'Абдус Салам (Moшинкаmad Abdus Salam)',
  profession: 'фізик',
  accomplishment: 'теорія електромагнетизму',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key
  name: 'Персі Джуліан (Percy Lavon Julian)',
  profession: 'хімік',
  accomplishment: 'новаторські кортизоновмісні препарати, стероїди та протизаплідні таблетки',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
  name: 'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофізик',
  accomplishment: 'розрахунок мас зір категорії "білий карлик"',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Відображення кількох вузлів DOM для кожного елемента списку {/*displaying-several-dom-nodes-for-each-list-item*/}

Що робити, коли для кожного елемента потрібно відрендерити не один, а кілька вузлів DOM?

Короткий синтаксис [фрагмента `<>...</>`](/reference/react/Fragment) не дозволить вам передати ключ, тож вам потрібно або згрупувати їх через `<div>`, або використати трохи довший і [більш явний синтаксис `<Fragment>`:](/reference/react/Fragment#rendering-a-list-of-fragments)

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Фрагменти зникають із DOM, тому тут буде створено однорівневий список елементів: `<h1>`, `<p>`, `<h1>`, `<p>` і так далі.

</DeepDive>

### Де взяти `key` {/*where-to-get-your-key*/}

Різні джерела даних надають різні джерела ключів:

* **Дані з бази даних:** Якщо ваші дані надходять із бази даних, ви можете використовувати ключі/ідентифікатори бази даних, які є унікальними за своєю природою.
* **Локально створені дані:** Якщо ваші дані генеруються та зберігаються локально (наприклад, нотатки в застосунку для створення нотаток), використовуйте лічильник з інкрементом під час створення елементів — [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) або пакет на зразок [`uuid.`](https://www.npmjs.com/package/uuid)

### Правила для ключів {/*rules-of-keys*/}

* **Ключі мають бути унікальними для елементів одного рівня.** Проте можна використовувати однакові ключі для вузлів JSX у _різних_ масивах.
* **Ключі не повинні змінюватися**, бо інакше це не відповідає їхньому призначенню! Не створюйте їх під час рендерингу.

### Навіщо React потрібні ключі? {/*why-does-react-need-keys*/}

Уявіть, що файли на вашому робочому столі не мають імен. Замість цього ви посилаєтеся на них по порядку — перший файл, другий файл тощо. Ви можете звикнути до цього, але як тільки ви видалите файл, все сплутається. Другий файл стане першим файлом, третій файл стане другим файлом і так далі.

Імена файлів у каталозі та JSX-ключі у масиві мають схожу мету. Вони дозволяють нам унікально ідентифікувати об'єкт на одному рівні. Добре підібраний ключ надає більше інформації, ніж позиція у масиві. Навіть якщо _позиція_ змінюється через під час зміни порядку, `key` дозволяє React ідентифікувати елемент протягом усього його життя.

<Pitfall>

У вас може виникнути спокуса використати індекс елемента в масиві як його ключ. Насправді це те, що використовуватиме React, якщо ви взагалі не вкажете `key`. Але порядок, у якому ви відтворюєте елементи, змінюватиметься з часом, якщо елемент буде вставлено, видалено, або якщо масив буде змінено. Індекс як ключ часто веде до непомітних і заплутаних помилок.

Так само не генеруйте ключі "на льоту", наприклад, з `key={Math.random()}`. Це закінчиться тим, що ключі ніколи не збігатимуться між рендерами, і всі ваші компоненти та DOM щоразу створюватимуться заново. Це не тільки повільно, але й втратить дані, введені користувачем всередині елементів списку. Натомість використовуйте постійний ідентифікатор на основі даних.

Зверніть увагу, що ваші компоненти не отримають `key` як проп. Він використовується лише як підказка самим React. Якщо вашому компоненту потрібен ідентифікатор, ви повинні передати його як окремий проп: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

На цій сторінці ви дізналися:

* Як перемістити дані з компонентів у структури даних як масиви та об'єкти.
* Як створити набори подібних компонентів за допомогою `map()` з JavaScript.
* Як створити масиви відфільтрованих елементів за допомогою `filter()` з JavaScript.
* Навіщо і як задати `key` для кожного компонента в колекції, щоб React міг відстежувати кожен із них, навіть якщо їхня позиція чи дані зміняться.

</Recap>



<Challenges>

#### Розбиття одного списку на два {/*splitting-a-list-in-two*/}

Цей приклад показує список усіх людей.

Змініть його, щоб відобразити один за одним два окремі списки: **Хіміки** та **Усі інші.** Як і раніше, ви можете визначити, чи є особа хіміком, із порівняння `person.profession === 'хімік'`.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ', '}
        чиєю працею є {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Науковці</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Кетрін Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'розрахунки для космічних польотів',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Маріо Моліна (Mario José Molina-Pasquel Henríquez)',
  profession: 'хімік',
  accomplishment: 'відкриття озонової діри в Арктиці',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Абдус Салам (Moшинкаmad Abdus Salam)',
  profession: 'фізик',
  accomplishment: 'теорія електромагнетизму',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Персі Джуліан (Percy Lavon Julian)',
  profession: 'хімік',
  accomplishment: 'новаторські кортизоновмісні препарати, стероїди та протизаплідні таблетки',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофізик',
  accomplishment: 'розрахунок мас зір категорії "білий карлик"',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

Ви можете використати `filter()` двічі, створивши два окремих масиви, а потім перетворити обидва за допомогою `map`:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'хімік'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'хімік'
  );
  return (
    <article>
      <h1>Науковці</h1>
      <h2>Хіміки</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ', '}
              чиєю працею є {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Усі інші</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ', '}
              чиєю працею є {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Кетрін Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'розрахунки для космічних польотів',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Маріо Моліна (Mario José Molina-Pasquel Henríquez)',
  profession: 'хімік',
  accomplishment: 'відкриття озонової діри в Арктиці',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Абдус Салам (Moшинкаmad Abdus Salam)',
  profession: 'фізик',
  accomplishment: 'теорія електромагнетизму',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Персі Джуліан (Percy Lavon Julian)',
  profession: 'хімік',
  accomplishment: 'новаторські кортизоновмісні препарати, стероїди та протизаплідні таблетки',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофізик',
  accomplishment: 'розрахунок мас зір категорії "білий карлик"',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

У цьому рішенні виклики `map` розміщуються безпосередньо в батьківських елементах `<ul>`, але ви можете ввести змінні для них, якщо вважаєте це більш зрозумілим.

Між відтвореними списками все ще є невелике дублювання. Ви можете піти далі та перенести повторювані частини до компонента `<ListSection>`:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ', '}
              чиєю працею є {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'хімік'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'хімік'
  );
  return (
    <article>
      <h1>Науковці</h1>
      <ListSection
        title="Хіміки"
        people={chemists}
      />
      <ListSection
        title="Усі інші"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Кетрін Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'розрахунки для космічних польотів',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Маріо Моліна (Mario José Molina-Pasquel Henríquez)',
  profession: 'хімік',
  accomplishment: 'відкриття озонової діри в Арктиці',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Абдус Салам (Moшинкаmad Abdus Salam)',
  profession: 'фізик',
  accomplishment: 'теорія електромагнетизму',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Персі Джуліан (Percy Lavon Julian)',
  profession: 'хімік',
  accomplishment: 'новаторські кортизоновмісні препарати, стероїди та протизаплідні таблетки',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофізик',
  accomplishment: 'розрахунок мас зір категорії "білий карлик"',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Дуже уважний читач може зауважити, що за допомогою двох викликів `filter` ми двічі перевіряємо професію кожної людини. Перевірка властивості дуже швидка, тому в цьому прикладі все добре. Якби логіка вашого коду була "дорожчою", ви могли б замінити виклики `filter` на цикл, який вручну створює масиви та перевіряє кожну людину один раз.

Насправді, якщо `people` ніколи не змінюється, ви можете винести цей код зі свого компонента. З точки зору React, єдине, що важливо, це те, що в кінцевому підсумку ви надаєте йому масив JSX-вузлів. І неважливо, як ви створюєте цей масив:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'хімік') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ', '}
              чиєю працею є {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Науковці</h1>
      <ListSection
        title="Хіміки"
        people={chemists}
      />
      <ListSection
        title="Усі інші"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Кетрін Джонсон (Creola Katherine Johnson)',
  profession: 'математик',
  accomplishment: 'розрахунки для космічних польотів',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Маріо Моліна (Mario José Molina-Pasquel Henríquez)',
  profession: 'хімік',
  accomplishment: 'відкриття озонової діри в Арктиці',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Абдус Салам (Moшинкаmad Abdus Salam)',
  profession: 'фізик',
  accomplishment: 'теорія електромагнетизму',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Персі Джуліан (Percy Lavon Julian)',
  profession: 'хімік',
  accomplishment: 'новаторські кортизоновмісні препарати, стероїди та протизаплідні таблетки',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Субрахманьян Чандрасекар (Subrahmanyan Chandrasekhar)',
  profession: 'астрофізик',
  accomplishment: 'розрахунок мас зір категорії "білий карлик"',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Вкладені списки в одному компоненті {/*nested-lists-in-one-component*/}

Складіть список рецептів із цього масиву! Для кожного рецепта в масиві відобразіть його назву як `<h2>` і перелічіть його інгредієнти в `<ul>`.

<Hint>

Це вимагатиме вкладення один в одне двох різних викликів `map`.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Рецепти</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Грецький салат',
  ingredients: ['помідори', 'огірки', 'цибуля', 'оливки', 'фета']
}, {
  id: 'hawaiian-pizza',
  name: 'Гавайська піца',
  ingredients: ['тісто для піци', 'соус для піци', 'моцарела', 'шинка', 'ананас']
}, {
  id: 'hummus',
  name: 'Хумус',
  ingredients: ['нут', 'оливкова олія', 'зубчики часнику', 'лимон', 'тахіні']
}];
```

</Sandpack>

<Solution>

Ось один із способів, як це зробити:

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Рецепти</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Грецький салат',
  ingredients: ['помідори', 'огірки', 'цибуля', 'оливки', 'фета']
}, {
  id: 'hawaiian-pizza',
  name: 'Гавайська піца',
  ingredients: ['тісто для піци', 'соус для піци', 'моцарела', 'шинка', 'ананас']
}, {
  id: 'hummus',
  name: 'Хумус',
  ingredients: ['нут', 'оливкова олія', 'зубчики часнику', 'лимон', 'тахіні']
}];
```

</Sandpack>

Кожен із рецептів у `recipes` вже містить поле `id`, яке зовнішній цикл використовує як свій `key`. Але немає жодного ідентифікатора, що можна використати для перегляду інгредієнтів. Однак доречно припустити, що один і той самий інгредієнт не буде вказано двічі в одному рецепті, тому вже сама його назва може бути `key`. В якості альтернативи ви можете змінити структуру даних, щоб додати ідентифікатори, або використовувати індекс як `key` (із застереженням, що ви не можете безпечно змінити порядок інгредієнтів).

</Solution>

#### Винесення компонента елемента списку {/*extracting-a-list-item-component*/}

Цей компонент `RecipeList` містить два вкладених виклики `map`. Щоб спростити це, винесіть із нього компонент `Recipe`, який матиме пропси `id`, `name` та `ingredients`. Де і навіщо ви розмістите зовнішній `key`?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Рецепти</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Грецький салат',
  ingredients: ['помідори', 'огірки', 'цибуля', 'оливки', 'фета']
}, {
  id: 'hawaiian-pizza',
  name: 'Гавайська піца',
  ingredients: ['тісто для піци', 'соус для піци', 'моцарела', 'шинка', 'ананас']
}, {
  id: 'hummus',
  name: 'Хумус',
  ingredients: ['нут', 'оливкова олія', 'зубчики часнику', 'лимон', 'тахіні']
}];
```

</Sandpack>

<Solution>

Ви можете скопіювати та вставити JSX із зовнішньої `map` у новий компонент `Recipe` і повернути цей JSX. Потім ви можете змінити `recipe.name` на `name`, `recipe.id` на `id` і так далі, і передати їх як атрибути в `Recipe`:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Рецепти</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Грецький салат',
  ingredients: ['помідори', 'огірки', 'цибуля', 'оливки', 'фета']
}, {
  id: 'hawaiian-pizza',
  name: 'Гавайська піца',
  ingredients: ['тісто для піци', 'соус для піци', 'моцарела', 'шинка', 'ананас']
}, {
  id: 'hummus',
  name: 'Хумус',
  ingredients: ['нут', 'оливкова олія', 'зубчики часнику', 'лимон', 'тахіні']
}];
```

</Sandpack>

Тут `<Recipe {...recipe} key={recipe.id} />` — це синтаксичне скорочення, яке означає "передати всі властивості об'єкта `recipe` як пропси до компонента `Recipe`". Ви також можете задати кожен проп явно: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Зверніть увагу, що `ключ` вказано в самому `<Recipe>`, а не в кореневому `<div>`, який повертається з `Recipe`.** Це тому, що цей `key` потрібен безпосередньо в контексті навколишнього масиву. Раніше у вас був масив елементів `<div>`, тому для кожного з них потрібен був ключ, але тепер у вас є масив елементів `<Recipe>`. Іншими словами, коли ви виносите компонент, не забудьте залишити `key` за межами JSX, який ви копіюєте та вставляєте.

</Solution>

#### Список із роздільником {/*list-with-a-separator*/}

У цьому прикладі відображається відоме хайку _(ред. — у вільному перекладі)_ автора Тачібана Хокуші (Tachibana Hokushi), кожен рядок якого обгорнуто тегом `<p>`. Ваше завдання полягає в тому, щоб вставити роздільник `<hr />` між кожним абзацом. Ваша кінцева структура має виглядати так:

```js
<article>
  <p>Пишу, стираю,</p>
  <hr />
  <p>Переписую знову —</p>
  <hr />
  <p>І ось мак зацвів.</p>
</article>
```

Хайку містить лише три рядки, але ваше рішення має працювати з будь-якою кількістю рядків. Зауважте, що елементи `<hr />` з'являються лише *між* елементами `<p>`, а не на початку або в кінці!

<Sandpack>

```js
const poem = {
  lines: [
    'Пишу, стираю,',
    'Переписую знову —',
    'І ось мак зацвів.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Це рідкісний випадок, коли індекс як ключ є прийнятним, оскільки рядки вірша ніколи не змінюватимуться.)

<Hint>

Вам потрібно буде або перетворити `map` на цикл, або використовувати фрагмент.

</Hint>

<Solution>

Ви можете написати цикл, вставляючи `<hr />` і `<p>...</p>` у вихідний масив "на ходу":

<Sandpack>

```js
const poem = {
  lines: [
    'Пишу, стираю,',
    'Переписую знову —',
    'І ось мак зацвів.'
  ]
};

export default function Poem() {
  let output = [];

  // Заповнити вихідний масив
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Видалити перший <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Використання початкового індексу рядка як `key` більше не працює, оскільки кожен роздільник і абзац тепер знаходяться в одному масиві. Однак ви можете надати кожному з них окремий ключ за допомогою суфікса, наприклад, `key={i + '-text'}`.

З іншого боку, ви можете відобразити колекцію фрагментів, які містять `<hr />` і `<p>...</p>`. Однак скорочений синтаксис `<>...</>` не підтримує передачу ключів, тому вам доведеться писати `<Fragment>` явно:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'Пишу, стираю,',
    'Переписую знову —',
    'І ось мак зацвів.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Пам'ятайте, що фрагменти (часто написані як `<> </>`) дозволяють згрупувати JSX-вузли без додавання елементів `<div>`!

</Solution>

</Challenges>
