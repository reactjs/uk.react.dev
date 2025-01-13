---
title: Оновлення масивів у стані
---

<Intro>

У JavaScript масиви є змінними, але потрібно розглядати їх як незмінні під час зберігання у стані. Як і з об'єктами, коли вам потрібно оновити масив, що зберігається в стані, слід створити новий (або зробити копію наявного), а потім використати цей новий масив під час задання стану.

</Intro>

<YouWillLearn>

- Як додавати, видаляти або змінювати елементи масиву в стані React
- Як оновити об'єкт всередині масиву
- Як зробити копіювання масиву менш повторюваним за допомогою Immer

</YouWillLearn>

## Оновлення масивів без мутації {/*updating-arrays-without-mutation*/}

У JavaScript масиви — це ще один вид об'єктів. [Як і з об'єктами](/learn/updating-objects-in-state), **потрібно розглядати масиви в стані React як доступні лише для читання.** Це означає, що не слід повторно присвоювати значення елементам усередині масиву, наприклад, `arr[0] = 'bird'`, а також використовувати методи, які мутують масив, як-от `push()` і `pop()`.

Натомість кожного разу, коли хочете оновити масив, потрібно передати *новий* масив у функцію задання стану. Щоб зробити це, ви можете створити новий масив із вихідного у вашому стані, викликавши його немутаційні методи, як-от `filter()` і `map()`. Потім можете задати стан для нового отриманого масиву.

Ось довідкова таблиця загальних операцій із масивами. Маючи справу з масивами всередині стану React, вам потрібно буде уникати методів у лівій колонці, а натомість віддавати перевагу методам у правій:

|           | уникати (змінює масив)           | віддати перевагу (повертає новий масив)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| додавання    | `push`, `unshift`                   | `concat`, spread-синтаксис `[...arr]` ([приклад](#adding-to-an-array)) |
| видалення  | `pop`, `shift`, `splice`            | `filter`, `slice` ([приклад](#removing-from-an-array))              |
| заміна | `splice`, `arr[i] = ...` присвоєння | `map` ([приклад](#replacing-items-in-an-array))                     |
| сортування   | `reverse`, `sort`                   | спочатку скопіюйте масив ([приклад](#making-other-changes-to-an-array)) |

Крім того, ви можете [скористатися Immer](#write-concise-update-logic-with-immer), що дозволить використовувати методи з обох стовпців.

<Pitfall>

На жаль, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) та [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) мають схожі назви, але дуже відрізняються:

* `slice` дозволяє копіювати масив або його частину.
* `splice` **змінює** масив (для вставлення або видалення елементів).

У React ви будете використовувати `slice` (без `p`!) набагато частіше, тому що не потрібно мутувати об'єкти чи масиви в стані. [Оновлення об'єктів](/learn/updating-objects-in-state) пояснює, що таке мутація та чому вона не рекомендована для стану.

</Pitfall>

### Додавання до масиву {/*adding-to-an-array*/}

`push()` змінить масив, що вам не потрібно:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Скульптори, які надихають:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Додати</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Натомість створіть *новий* масив, який містить наявні елементи *і* новий елемент у кінці. Це можна зробити кількома способами, але найпростішим є використання `...` — синтаксису [spread для масиву](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals):

```js
setArtists( // Замінити стан
  [ // новим масивом
    ...artists, // який містить усі попередні елементи
    { id: nextId++, name: name } // і новий елемент у кінці
  ]
);
```

Тепер все працює правильно:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Скульптори, які надихають:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Додати</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Синтаксис spread також дозволяє додавати елемент до початку, розміщуючи його *перед* оригінальним масивом `...artists`:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Покладіть попередні елементи в кінці
]);
```

Отже, поширення може виконувати роботу як `push()`, додаючи в кінець масиву, так і `unshift()`, додаючи до початку. Спробуйте це в пісочниці вище!

### Видалення з масиву {/*removing-from-an-array*/}

Найпростіший спосіб видалити елемент із масиву — це *відфільтрувати його*. Іншими словами, створити новий масив, який не міститиме цей елемент. Для цього скористайтеся методом `filter`, наприклад:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Скульптори, які надихають:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Натисніть кнопку "Видалити" кілька разів і подивіться на її обробник клацання.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Тут `artists.filter(a => a.id !== artist.id)` означає "створити масив, який складається з тих `artists`, ідентифікатори яких відрізняються від `artist.id`". Іншими словами, кнопка "Видалити" кожного скульптора відфільтровує _цього_ скульптора з масиву, а потім запитує повторний рендер з отриманим масивом. Зауважте, що `filter` не змінює вихідний масив.

### Перетворення масиву {/*transforming-an-array*/}

Якщо потрібно змінити деякі або всі елементи масиву, можна скористатися `map()`, щоб створити **новий** масив. Функція, яку передасте `map`, може вирішити, що робити з кожним елементом на основі його даних або індексу (або обох).

У цьому прикладі масив містить координати двох кіл і квадрата. Коли ви натискаєте кнопку, вона пересуває лише кола вниз на 50 пікселів. Це робиться через створення нового масиву даних за допомогою `map()`:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Без змін
        return shape;
      } else {
        // Повертає нове коло нижче на 50px
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Повторний рендер з новим масивом
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Перемістити кола вниз!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Заміна елементів у масиві {/*replacing-items-in-an-array*/}

Особливо часто потрібно замінити один або кілька елементів у масиві. Присвоєння на кшталт `arr[0] = 'bird'` мутують оригінальний масив, тому натомість ви також можете скористатися `map`.

Щоб замінити елемент, створіть новий масив за допомогою `map`. У виклику `map` ви маєте індекс елемента другим аргументом. Використовуйте його, щоб вирішити, повертати оригінальний елемент (перший аргумент) чи щось інше:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Збільшити лічильник біля натиснутих клавіш
        return c + 1;
      } else {
        // Решта не змінилися
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Вставляння в масив {/*inserting-into-an-array*/}

Іноді може знадобитися вставити елемент у певну позицію, яка не є ні на початку, ні в кінці. Для цього ви можете використовувати spread-синтаксис `...` разом із методом `slice()`. Метод `slice()` дозволяє вирізати "шматочок" масиву. Щоб вставити елемент, ви створюєте масив, який розподіляє фрагмент _перед_ точкою вставлення, потім новий елемент, а потім решту вихідного масиву.

У цьому прикладі кнопка "Вставити" завжди вставляє елемент з індексом `1`:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Може бути будь-яким індексом
    const nextArtists = [
      // Елементи перед точкою вставлення:
      ...artists.slice(0, insertAt),
      // Новий елемент:
      { id: nextId++, name: name },
      // Елементи після точки вставлення:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Скульптори, які надихають:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Вставити
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Внесення інших змін до масиву {/*making-other-changes-to-an-array*/}

Дещо неможливо зробити лише за допомогою синтаксису spread та методів, як-от `map()` і `filter()`, які не мутують масив. Наприклад, може знадобитися розмістити елементи масиву у зворотному напрямку або відсортувати їх. Методи JavaScript `reverse()` і `sort()` мутують оригінальний масив, тому не можна використовувати їх безпосередньо.

**Однак можна спочатку зробити копію масиву, а потім внести в неї зміни.**

Наприклад:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Великі животи' },
  { id: 1, title: 'Місячний пейзаж' },
  { id: 2, title: 'Теракотова армія' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Змінити порядок
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Тут ви використовуєте spread-синтаксис `[...list]`, щоб спочатку створити копію вихідного масиву. Тепер, коли маєте копію, можете використовувати методи зміни, як-от `nextList.reverse()` або `nextList.sort()`, або навіть призначати окремі елементи за допомогою `nextList[0] = "something"`.

Однак, **навіть якщо скопіюєте масив, ви не зможете змінити наявні елементи _всередині_ нього безпосередньо.** Це пояснюється тим, що копіювання неглибоке — новий масив міститиме ті самі елементи, що й оригінальний. Отже, якщо змінюєте об'єкт у скопійованому масиві, ви змінюєте наявний стан. Наприклад, такий код є проблемою.

```js
const nextList = [...list];
nextList[0].seen = true; // Проблема: мутація list[0]
setList(nextList);
```

Хоча `nextList` і `list` — це два різні масиви, **`nextList[0]` і `list[0]` вказують на той самий об'єкт.** Отже, змінивши `nextList[0].seen`, ви також змінюєте `list[0].seen`. Це мутація стану, якої слід уникати! Цю проблему можна вирішити подібно до [оновлення вкладених об'єктів JavaScript](/learn/updating-objects-in-state#updating-a-nested-object) – скопіювавши окремі елементи, які потрібно змінити, а не видозмінювати їх. Ось як.

## Оновлення об'єктів всередині масивів {/*updating-objects-inside-arrays*/}

Об'єкти _справді_ не розташовані "всередині" масивів. Вони можуть здаватися тими, що "всередині" коду, але кожен об'єкт у масиві є окремим значенням, на яке "вказує" масив. Ось чому потрібно бути обережним, змінюючи вкладені поля, як-от `list[0]`. Інші водночас можуть працювати з тим самим елементом масиву!

**Під час оновлення вкладеного стану вам потрібно створити копії від точки оновлення і аж до верхнього рівня.** Давайте подивимося, як це робиться.

У цьому прикладі два окремі списки мають однаковий початковий стан. Вони мають бути ізольованими, але через мутацію їхній стан випадково поділяється, і встановлення прапорця в одному списку впливає на інший:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Великі животи', seen: false },
  { id: 1, title: 'Місячний пейзаж', seen: false },
  { id: 2, title: 'Теракотова армія', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Мистецький список</h1>
      <h2>Мій список для перегляду:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Ваш список для перегляду:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Проблема полягає в цьому коді:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Проблема: мутація наявного елементу
setMyList(myNextList);
```

Хоча сам масив `myNextList` є новим, його *елементи* ті самі, що і в оригінальному масиві `myList`. Отже, зміна `artwork.seen` змінює *оригінальний* елемент. Цей елемент також є у `yourList`, що спричиняє помилку. Про такі помилки важко здогадатися, але, на щастя, вони зникають, якщо ви уникаєте зміни стану.

**Ви можете скористатися `map`, щоб замінити попередній елемент його оновленою версією без мутації.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Створення *нового* зміненого об'єкта
    return { ...artwork, seen: nextSeen };
  } else {
    // Без змін
    return artwork;
  }
}));
```

Тут `...` — синтаксис spread об'єкта, який використовується для [створення копії об'єкта.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

За допомогою цього підходу жоден із наявних елементів стану не змінюється, і помилку виправлено:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Великі животи', seen: false },
  { id: 1, title: 'Місячний пейзаж', seen: false },
  { id: 2, title: 'Теракотова армія', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Створення *нового* зміненого об'єкта
        return { ...artwork, seen: nextSeen };
      } else {
        // Без змін
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Створення *нового* зміненого об'єкта
        return { ...artwork, seen: nextSeen };
      } else {
        // Без змін
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Мистецький список</h1>
      <h2>Мій список для перегляду:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Ваш список для перегляду:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Загалом, **ви повинні змінювати лише об'єкти, які щойно створили.** Якщо ви вставляєте *новий* елемент, можете його змінити, але якщо маєте справу з чимось, що вже є в стані, потрібно зробити копію.

### Пишемо стислу логіку оновлення за допомогою Immer {/*write-concise-update-logic-with-immer*/}

Оновлення вкладених масивів без мутації може приводити до деяких повторень. [Так само, як і з об'єктами](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):

- Як правило, вам не потрібно оновлювати стан більш ніж на кілька рівнів у глибину. Якщо об'єкти стану дуже глибокі, можете [реструктурувати їх](/learn/choosing-the-state-structure#avoid-deeply-nested-state) щоб вони були більш плоскими.
- Якщо ви не хочете змінювати структуру стану, можете віддати перевагу [Immer](https://github.com/immerjs/use-immer), який дає змогу писати за допомогою зручного, але мутаційного синтаксису та піклується про створення копії замість вас.

Ось попередній приклад, написаний за допомогою Immer:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Великі животи', seen: false },
  { id: 1, title: 'Місячний пейзаж', seen: false },
  { id: 2, title: 'Теракотова армія', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Мистецький список</h1>
      <h2>Мій список для перегляду:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Ваш список для перегляду:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Зверніть увагу, що з використанням Immer, **мутація, як-от `artwork.seen = nextSeen` тепер задовільна:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Це тому, що ви мутуєте не _вихідний_ стан, а спеціальну чорнетку — об'єкт `draft` з Immer. Аналогічно, можете застосувати такі методи мутації, як `push()` та `pop()`, до змісту `draft`.

Під капотом Immer завжди будує наступний стан з нуля відповідно до змін, які зроблено для `draft`-об'єкта. Це підтримує обробники подій дуже стислими, не мутуючи стан.

<Recap>

- Можна вкласти масиви в стан, але не можна їх змінювати.
- Замість мутування масиву створіть його *нову* версію та оновіть стан.
- Можете скористатися `[...arr, newItem]` spread-синтаксисом для створення масивів із новими елементами.
- Можете використовувати `filter()` та `map()` для створення нових масивів із відфільтрованими та перетвореними елементами.
- Можете скористатися Immer для стислості коду.

</Recap>



<Challenges>

#### Оновіть товар у кошику {/*update-an-item-in-the-shopping-cart*/}

Напишіть логіку в методі `handleIncreaseClick` так, щоб натискання "+" збільшувало відповідне число:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Пахлава',
  count: 1,
}, {
  id: 1,
  name: 'Сир',
  count: 5,
}, {
  id: 2,
  name: 'Спагеті',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Можна скористатися функцією `map` щоб створити новий масив, а потім `...` синтаксисом spread щоб створити копію зміненого об'єкта у новому масиві:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Пахлава',
  count: 1,
}, {
  id: 1,
  name: 'Сир',
  count: 5,
}, {
  id: 2,
  name: 'Спагеті',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Видаліть товар із кошика {/*remove-an-item-from-the-shopping-cart*/}

Цей кошик має робочу кнопку "+", але кнопка "–" нічого не робить. Вам потрібно додати обробник події, який дасть змогу зменшувати `count` для відповідного товару. Коли count дорівнює 1, після натискання "–" товар повинен автоматично видалятись із кошика. Переконайтесь, що 0 не відображено.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Пахлава',
  count: 1,
}, {
  id: 1,
  name: 'Сир',
  count: 5,
}, {
  id: 2,
  name: 'Спагеті',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Скористайтеся спочатку `map`, щоб створити новий масив, а потім `filter`, щоб видалилити товари, якщо `count` дорівнює `0`:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Пахлава',
  count: 1,
}, {
  id: 1,
  name: 'Сир',
  count: 5,
}, {
  id: 2,
  name: 'Спагеті',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Виправте мутації за допомогою методів, що не мутують значення {/*fix-the-mutations-using-non-mutative-methods*/}

У цьому прикладі всі обробники подій в `App.js` використовують мутацію. Як результат, редагування та видалення задач не працює. Перепишіть `handleAddTodo`, `handleChangeTodo`, та `handleDeleteTodo` з використанням методів, що не мутують значення:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купити молоко', done: true },
  { id: 1, title: 'З\'їсти тако', done: false },
  { id: 2, title: 'Заварити чай', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Додати задачу"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Додати</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Зберегти
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редагувати
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Видалити
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

У методі `handleAddTodo` можна скористатися синтаксисом spread. У `handleChangeTodo` можна створити новий масив за допомогою `map`. У `handleDeleteTodo` можна створити новий масив за допомогою `filter`. Тепер список працює як слід:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купити молоко', done: true },
  { id: 1, title: 'З\'їсти тако', done: false },
  { id: 2, title: 'Заварити чай', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Додати задачу"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Додати</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Зберегти
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редагувати
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Видалити
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Виправлення мутацій за допомогою Immer {/*fix-the-mutations-using-immer*/}

Це той самий приклад, що і в попередньому завданні. Але цього разу, треба виправити мутації за допомогою Immer. Для зручності, `useImmer` вже імпортовано, тому вам потрібно змінити стан змінної `todos`, щоб скористатися ним.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купити молоко', done: true },
  { id: 1, title: 'З\'їсти тако', done: false },
  { id: 2, title: 'Заварити чай', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Додати задачу"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Додати</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Зберегти
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редагувати
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Видалити
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

За допомогою Immer ви можете писати код із мутаціями, поки мутуєте тільки частини чернетки `draft`, яку надає вам Immer. Тут всі мутації відбуваються лише з `draft`-об'єктом, тому код працює:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купити молоко', done: true },
  { id: 1, title: 'З\'їсти тако', done: false },
  { id: 2, title: 'Заварити чай', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Додати задачу"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Додати</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Зберегти
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редагувати
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Видалити
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

З Immer також можливо змішувати та поєднувати підходи з мутаціями та без них.

Наприклад, у цій версії `handleAddTodo` реалізований із мутацією `draft`-об'єкта з Immer, а `handleChangeTodo` і `handleDeleteTodo` використовують методи `map` та `filter`, що не мутують значення:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Купити молоко', done: true },
  { id: 1, title: 'З\'їсти тако', done: false },
  { id: 2, title: 'Заварити чай', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Додати задачу"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Додати</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Зберегти
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Редагувати
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Видалити
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Використовуючи Immer, можна обрати стиль, який найбільше підходить до кожного конкретного випадку.

</Solution>

</Challenges>
