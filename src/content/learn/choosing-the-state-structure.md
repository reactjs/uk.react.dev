---
title: Вибір структури стану
---

<Intro>

Структура стану може утворювати разючу різницю між компонентом, який приємно змінювати та зневаджувати, та компонентом, який є постійним джерелом дефектів. Ось кілька порад, які варто обдумати при структуруванні стану.

</Intro>

<YouWillLearn>

* Коли використовувати одну змінну стану, а коли – декілька
* Чого слід уникати при організації стану
* Як виправити поширені помилки за допомогою доброї структури стану

</YouWillLearn>

## Принципи структурування стану {/*principles-for-structuring-state*/}

Коли ви пишете компонент, що містить певний стан, доводиться приймати рішення про те, скільки змінних стану використати і якою повинна бути форма їхніх даних. Попри те, що можна написати коректну програму навіть з субоптимальною структурою стану, є кілька принципів, які можуть привести до кращих рішень:

1. **Групувати споріднені частини стану.** Якщо дві чи більше змінні стану завжди оновлюватимуться водночас, можливо, їх краще об'єднати в одну змінну стану.
2. **Уникати суперечностей стану.** Коли стан структурований так, що кілька його частин можуть суперечити та "не походжуватися" одне з одним, це утворює простір для помилок. Цього слід уникати.
3. **Уникати надлишкового стану.** Якщо якусь інформацію під час рендерингу можна обчислити на основі пропсів компонента чи його наявних змінних стану, не слід додавати таку інформацію до стану цього компонента.
4. **Уникати дублювання у стані.** Коли одні й ті ж дані дублюються в різних змінних стану, або всередині вкладених об'єктів, то складно підтримувати їхню синхронізацію. Позбавляйтеся дублювання, коли можете.
5. **Уникати стану з глибокою вкладеністю.** Глибоко ієрархічний стан не дуже зручно оновлювати. Коли це можливо, віддавайте перевагу пласкому стану.

Мета цих принципів – *щоб стан було легко оновлювати без додавання помилок*. Вилучення зі стану надлишкових і продубльованих даних допомагає пересвідчитися, що всі частини синхронізовані одна з одною. Це схоже на те, як інженер баз даних міг би ["нормалізуватИ" структуру бази даних](https://docs.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description), щоб знизити шанс появи дефектів. Перефразовуючи Альберта Ейнштейна, **"Роби свій стан простим, як можливо, – але не простіше цього."**

Тепер погляньмо, як ці принципи застосовуються на практиці.

## Групувати споріднений стан {/*group-related-state*/}

Іноді може бути непевність щодо використання однієї або кількох змінних стану.

Чи варто зробити так?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Або так?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Технічно можна зробити і так, і так. Але **якщо якісь дві змінні стану завжди змнюються разом, можливо, краще об'єднати їх в одну змінну стану.** Тоді ви не забудете завжди підтримувати їхню синхронізацію, як у цьому прикладі, де рухання курсора оновлює обидві координати червоної крапки:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Ще одна ситуація, коли дані групують в об'єкт чи масив, – це коли невідомо, скільки порцій стану знадобиться. Наприклад, це допомагає, коли є форма, куди користувач може додати власні поля.

<Pitfall>

Якщо ваша змінна стану є об'єктом, пам'ятайте, що [не можна оновлювати лише одне поле в цьому об'єкті](/learn/updating-objects-in-state), явно не скопіювавши інші поля. Наприклад, у прикладі вище не можна зробити `setPosition({ x: 100 })`, тому що тоді властивості `y` не було б узагалі! Замість цього, щоб оновити лише `x`, треба або виконати `setPosition({ ...position, x: 100 })`, або розбити змінну на дві й виконати `setX(100)`.

</Pitfall>

## Уникати суперечностей стану {/*avoid-contradictions-in-state*/}

Ось форма для відгуків на готель, що має змінні стану `isSending` і `isSent`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Дякуємо за відгук!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Як вам було зупинитися в Поні-стрибунці?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Надіслати
      </button>
      {isSending && <p>Надсилається...</p>}
    </form>
  );
}

// Удаємо, ніби надсилаємо повідомлення.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Попри те, що цей код працює, він залишає простір для "неможливих" станів. Наприклад, якщо забути викликати `setIsSent` і `setIsSending` разом, то можна опитися в ситуації, коли і `isSending`, і `isSent` мають значення `true` водночас. Чим складніший компонент, тим важче зрозуміти, що трапилося.

**Оскільки `isSending` та `isSent` ніколи не повинні мати значення `true` водночас, краще замінити їх однією змінною стану `status`, яка може перебувати в одному з *трьох* валідних станів:** `'typing'` (початковий), `'sending'` і `'sent'`:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Дякуємо за відгук!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Як вам було зупинитися в Поні-стрибунці?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Надіслати
      </button>
      {isSending && <p>Надсилається...</p>}
    </form>
  );
}

// Удаємо, ніби надсилаємо повідомлення.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Для кращої прочитності можна все ж додати кілька сталих:

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

Але вони не є змінними стану, тож немає потреби турбуватися про те, що вони розсинхронізуються одна з одною.

## Уникати надлишковий стану {/*avoid-redundant-state*/}

Якщо можна обчислити якусь інформацію під час рендерингу, на основі пропсів компонента або наявних змінних стану, **не слід** додавати цю інформацію до стану компонента.

Для прикладу – ця форма. Вона працює, але чи зможете ви знайти в ній надлишковий стан?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Зареєструймо вас</h2>
      <label>
        Ім'я:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Прізвище:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Ваш квиток буде видано на ім'я: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

У цій формі три змінні стану: `firstName`, `lastName` і `fullName`. Проте `fullName` – надлишкова. **Змінну `fullName` завжди можна обчислити під час рендеру на основі `firstName` і `lastName`, тож її слід вилучити зі стану.**

Ось як це робиться:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Зареєструймо вас</h2>
      <label>
        Ім'я:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Прізвище:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Ваш квиток буде видано на ім'я: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Тут `fullName` – це *не* змінна стану. Натомість це значення обчислюється під час рендеру:

```js
const fullName = firstName + ' ' + lastName;
```

Як наслідок, обробникам змін не потрібно робити нічого особливого для його оновлення. Викликавши `setFirstName` або `setLastName`, ви запускаєте повторний рендер, а тоді наступне значення `fullName` обчислюється на основі свіжих даних.

<DeepDive>

#### Не віддзеркалювати пропси у стані {/*don-t-mirror-props-in-state*/}

Поширений приклад надлишкового стану – код, схожий на цей:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

Тут змінна стану `color` ініціалізується пропом `messageColor`. Проблема полягає в тому, що **якщо батьківський компонент передасть інше значення `messageColor` пізніше (наприклад, `'red'` замість `'blue'`), то *змінна стану* `color` не оновиться!** Стан ініціалізується лише під час першого рендеру.

Саме тому "віддзеркалення" якогось пропу на змінну стану може приводити до спантеличеності. Замість цього використовуйте у своєму коді проп `messageColor` безпосередньо. Якщо хочете надати йому коротше ім'я, створіть сталу:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

Так він не розсинхронізується з пропом, переданим з батьківського компонента.

"Віддзеркалення" пропсів у стан має зміст лише тоді, коли ви *хочете* ігнорувати всі оновлення конкретного пропа. Прийнято починати назву такого пропа з `initial` або `default`, аби прояснити, що нові значення ігноруються:

```js
function Message({ initialColor }) {
  // Змінна стану `color` зберігає *перше* значення `initialColor`.
  // Наступні зміни пропа `initialColor` ігноруються.
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## Уникати дублювання стану {/*avoid-duplication-in-state*/}

Цей компонент списку меню дає змогу обрати один дорожній перекус з кількох:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'пиріжок з горохом', id: 0 },
  { title: 'горішки', id: 1 },
  { title: 'зерновий батончик', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>Який вам перекус?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Оберіть</button>
          </li>
        ))}
      </ul>
      <p>Ви обрали {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Наразі він зберігає обраний елемент як об'єкт у змінній стану `selectedItem`. Проте це не надто тішить: **вміст `selectedItem` – той самий об'єкт, що присутній в списку `items`.** Це означає, що інформація про сам елемент дублюється у двох місцях.

Чому це проблема? Зробимо кожний з елементів доступним для редагування:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'пиріжок з горохом', id: 0 },
  { title: 'горішки', id: 1 },
  { title: 'зерновий батончик', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Який вам перекус?</h2> 
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Оберіть</button>
          </li>
        ))}
      </ul>
      <p>Ви обрали {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Зверніть увагу, що якщо спершу клацнути на елементі "Оберіть", а *потім* відредагувати його, то **поле оновлюється, але на підпис унизу це редагування не впливає.** Так відбувається, тому що стан дублюється, і ви забули оновити `selectedItem`.

Попри те, що можна було б оновити і `selectedItem` також, легше виправлення – позбавитися дублювання. У цьому прикладі замість об'єкта `selectedItem` (який утворює дублювання щодо об'єктів усередині `items`) у стані зберігається `selectedId`, а *потім* отримується `selectedItem`, шляхом пошуку в масиві `items` елемента за ідентифікатором:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'пиріжок з горохом', id: 0 },
  { title: 'горішки', id: 1 },
  { title: 'зерновий батончик', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>Який вам перекус?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Оберіть</button>
          </li>
        ))}
      </ul>
      <p>Ви обрали {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Раніше стан дублювався отак:

* `items = [{ id: 0, title: 'пиріжок з горохом'}, ...]`
* `selectedItem = {id: 0, title: 'пиріжок з горохом'}`

Але після внесення змін він отакий:

* `items = [{ id: 0, title: 'пиріжок з горохом'}, ...]`
* `selectedId = 0`

Дублювання зникло, і залишився лише суттєвий стан!

Якщо тепер відредагувати *обраний* елемент, то повідомлення нижче оновиться негайно. Це пов'язано з тим, що `setItems` запускає повторний рендер, а `items.find(...)` знайде елемент з оновленою назвою. Не було потреби зберігати в стані *обраний елемент*, тому що суттєвим є лише *обраний ідентифікатор*. Решту можна обчислити під час рендеру.

## Уникати глибокої вкладеності стану {/*avoid-deeply-nested-state*/}

Уявіть план подорожі, що складається з планет, континентів і країн. Може бути спокуса структурувати його стан за допомогою вкладених об'єктів і масивів, як у цьому прикладі:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>Місця, варті відвідування</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Земля',
    childPlaces: [{
      id: 2,
      title: 'Африка',
      childPlaces: [{
        id: 3,
        title: 'Ботсвана',
        childPlaces: []
      }, {
        id: 4,
        title: 'Єгипет',
        childPlaces: []
      }, {
        id: 5,
        title: 'Кенія',
        childPlaces: []
      }, {
        id: 6,
        title: 'Мадагаскар',
        childPlaces: []
      }, {
        id: 7,
        title: 'Марокко',
        childPlaces: []
      }, {
        id: 8,
        title: 'Нігерія',
        childPlaces: []
      }, {
        id: 9,
        title: 'Південно-Африканська Республіка',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Америка',
      childPlaces: [{
        id: 11,
        title: 'Аргентина',
        childPlaces: []
      }, {
        id: 12,
        title: 'Бразилія',
        childPlaces: []
      }, {
        id: 13,
        title: 'Барбадос',
        childPlaces: []
      }, {
        id: 14,
        title: 'Канада',
        childPlaces: []
      }, {
        id: 15,
        title: 'Ямайка',
        childPlaces: []
      }, {
        id: 16,
        title: 'Мексика',
        childPlaces: []
      }, {
        id: 17,
        title: 'Тринідад і Тобаго',
        childPlaces: []
      }, {
        id: 18,
        title: 'Венесуела',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Азія',
      childPlaces: [{
        id: 20,
        title: 'Китай',
        childPlaces: []
      }, {
        id: 21,
        title: 'Індія',
        childPlaces: []
      }, {
        id: 22,
        title: 'Сингапур',
        childPlaces: []
      }, {
        id: 23,
        title: 'Південна Корея',
        childPlaces: []
      }, {
        id: 24,
        title: 'Тайланд',
        childPlaces: []
      }, {
        id: 25,
        title: "В'єтнам",
        childPlaces: []
      }]
    }, {
      id: 26,
      title: 'Європа',
      childPlaces: [{
        id: 27,
        title: 'Хорватія',
        childPlaces: [],
      }, {
        id: 28,
        title: 'Франція',
        childPlaces: [],
      }, {
        id: 29,
        title: 'Німеччина',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Італія',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Португалія',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Іспанія',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Туреччина',
        childPlaces: [],
      }]
    }, {
      id: 34,
      title: 'Океанія',
      childPlaces: [{
        id: 35,
        title: 'Австралія',
        childPlaces: [],
      }, {
        id: 36,
        title: 'Бора-Бора (Французька Полінезія)',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Острів Пасхи (Чилі)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Фіджі',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Гаваї (США)',
        childPlaces: [],
      }, {
        id: 40,
        title: 'Нова Зеландія',
        childPlaces: [],
      }, {
        id: 41,
        title: 'Вануату',
        childPlaces: [],
      }]
    }]
  }, {
    id: 42,
    title: 'Місяць',
    childPlaces: [{
      id: 43,
      title: 'Рейта',
      childPlaces: []
    }, {
      id: 44,
      title: 'Піколоміні',
      childPlaces: []
    }, {
      id: 45,
      title: 'Тихо',
      childPlaces: []
    }]
  }, {
    id: 46,
    title: 'Марс',
    childPlaces: [{
      id: 47,
      title: 'Кукурудзяне',
      childPlaces: []
    }, {
      id: 48,
      title: 'Зелений пагорб',
      childPlaces: []      
    }]
  }]
};
```

</Sandpack>

Тепер, скажімо, ви хочете додати кнопку для видалення місця, яке вже відвідали. З чого почнете? [Оновлення вкладеного стану](/learn/updating-objects-in-state#updating-a-nested-object) включає створення копій об'єктів від частини, що змінилася, аж до самого кінця ланцюжка вкладеності. Видалення місця з глибокою вкладеністю включає копіювання всього його ланцюжка предків. Такий код може бути дуже громіздким.

**Якщо стан має завелику вкладеність, щоб легко його оновити, розгляньте варіант його "сплющення".** Ось один з варіантів реструктуризації цих даних. Замість деревоподібної структури, де кожен `place` має масив *своїх дочірніх місць*, кожне місце може зберігати масив *ідентифікаторів своїх дочірніх місць*. Крім цього, збережіть відображення з ідентифікатора кожного місця на відповідне місце.

Така реструктуризація даних може нагадати вам вигляд таблиці бази даних:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Місця, варті відвідування</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```

```js src/places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Земля',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Африка',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Ботсвана',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Єгипет',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Кенія',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Мадагаскар',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Марокко',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Нігерія',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Південно-Африканська Республіка',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Америка',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Аргентина',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Бразилія',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Барбадос',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Канада',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Ямайка',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Мексика',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Тринідад і Тобаго',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Венесуела',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Азія',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'Китай',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Індія',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Сингапур',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Південна Корея',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Тайланд',
    childIds: []
  },
  25: {
    id: 25,
    title: "В'єтнам",
    childIds: []
  },
  26: {
    id: 26,
    title: 'Європа',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Хорватія',
    childIds: []
  },
  28: {
    id: 28,
    title: 'Франція',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Німеччина',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Італія',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Португалія',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Іспанія',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Туреччина',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Океанія',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Австралія',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Бора-Бора (Французька Полінезія)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Острів Пасхи (Чилі)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Фіджі',
    childIds: []
  },
  39: {
    id: 40,
    title: 'Гаваї (США)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Нова Зеландія',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Вануату',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Місяць',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Рейта',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Піколоміні',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Тихо',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Марс',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Кукурудзяне',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Зелений пагорб',
    childIds: []
  }
};
```

</Sandpack>

**Тепер, коли стан "плаский" (або, як іще кажуть, "нормалізований"), оновлення вкладених елементів полегшилося.**

Щоб вилучити місце тепер, необхідно оновити лише два рівні стану:

- Оновлена версія *батьківсього* місця повинна виключити вилучений ідентифікатор зі свого масиву `childIds`.
- Оновлена версія кореневого "табличного" об'єкта повинна містити оновлену версію батьківського місця.

Ось приклад того, як до цього можна підійти:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Створити нову версію батьківського місця,
    // що не містить цього дочірнього ідентифікатора.
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Оновити кореневий об'єкт стану...
    setPlan({
      ...plan,
      // ...щоб у ньому був оновлений батьківський елемент.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Місця, варті відвідування</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Завершити
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Земля',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Африка',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Ботсвана',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Єгипет',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Кенія',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Мадагаскар',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Марокко',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Нігерія',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Південно-Африканська Республіка',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Америка',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Аргентина',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Бразилія',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Барбадос',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Канада',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Ямайка',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Мексика',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Тринідад і Тобаго',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Венесуела',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Азія',
    childIds: [20, 21, 22, 23, 24, 25],   
  },
  20: {
    id: 20,
    title: 'Китай',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Індія',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Сингапур',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Південна Корея',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Тайланд',
    childIds: []
  },
  25: {
    id: 25,
    title: "В'єтнам",
    childIds: []
  },
  26: {
    id: 26,
    title: 'Європа',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Хорватія',
    childIds: []
  },
  28: {
    id: 28,
    title: 'Франція',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Німеччина',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Італія',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Португалія',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Іспанія',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Туреччина',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Океанія',
    childIds: [35, 36, 37, 38, 39, 40, 41],   
  },
  35: {
    id: 35,
    title: 'Австралія',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Бора-Бора (Французька Полінезія)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Острів Пасхи (Чилі)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Фіджі',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Гаваї (США)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Нова Зеландія',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Вануату',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Місяць',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Рейта',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Піколоміні',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Тихо',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Марс',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Кукурудзяне',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Зелений пагорб',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

Можна робити стан як завгодно вкладеним, але його "сплющення" може розв'язати чимало проблем. Воно полегшує оновлення стану, а також допомагає пересвідчитись, що немає дублювання в різних частинах вкладеного об'єкта.

<DeepDive>

#### Покращення використання пам'яті {/*improving-memory-usage*/}

В ідеалі краще також вилучати видалені елементи (та їхніх нащадків!) з "табличного" об'єкта, щоб покращити використання пам'яті. Ця версія це робить. Також вона [використовує Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer), аби логіка була стислішою.

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Вилучити з батьківського місця дочірні ідентифікатори.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Забути це місце та все його піддерево.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Місця, варті відвідування</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Завершити
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js src/places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 42, 46],
  },
  1: {
    id: 1,
    title: 'Земля',
    childIds: [2, 10, 19, 26, 34]
  },
  2: {
    id: 2,
    title: 'Африка',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Ботсвана',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Єгипет',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Кенія',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Мадагаскар',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Марокко',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Нігерія',
    childIds: []
  },
  9: {
    id: 9,
    title: 'Південно-Африканська Республіка',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Америка',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Аргентина',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Бразилія',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Барбадос',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Канада',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Ямайка',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Мексика',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Тринідад і Тобаго',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Венесуела',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Азія',
    childIds: [20, 21, 22, 23, 24, 25,],   
  },
  20: {
    id: 20,
    title: 'Китай',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Індія',
    childIds: []
  },
  22: {
    id: 22,
    title: 'Сингапур',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Південна Корея',
    childIds: []
  },
  24: {
    id: 24,
    title: 'Тайланд',
    childIds: []
  },
  25: {
    id: 25,
    title: "В'єтнам",
    childIds: []
  },
  26: {
    id: 26,
    title: 'Європа',
    childIds: [27, 28, 29, 30, 31, 32, 33],   
  },
  27: {
    id: 27,
    title: 'Хорватія',
    childIds: []
  },
  28: {
    id: 28,
    title: 'Франція',
    childIds: []
  },
  29: {
    id: 29,
    title: 'Німеччина',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Італія',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Португалія',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Іспанія',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Туреччина',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Океанія',
    childIds: [35, 36, 37, 38, 39, 40,, 41],   
  },
  35: {
    id: 35,
    title: 'Австралія',
    childIds: []
  },
  36: {
    id: 36,
    title: 'Бора-Бора (Французька Полінезія)',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Острів Пасхи (Чилі)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Фіджі',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Гаваї (США)',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Нова Зеландія',
    childIds: []
  },
  41: {
    id: 41,
    title: 'Вануату',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Місяць',
    childIds: [43, 44, 45]
  },
  43: {
    id: 43,
    title: 'Рейта',
    childIds: []
  },
  44: {
    id: 44,
    title: 'Піколоміні',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Тихо',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Марс',
    childIds: [47, 48]
  },
  47: {
    id: 47,
    title: 'Кукурудзяне',
    childIds: []
  },
  48: {
    id: 48,
    title: 'Зелений пагорб',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
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

</DeepDive>

Іноді можна також знизити вкладеність стану, перенісши частину вкладеного стану до дочірніх компонентів. Це добре працює для ефемерного стану UI, який не потребує збереження, наприклад, чи наведений на елемент курсор.

<Recap>

* Якщо дві змінні стану завжди оновлюються разом, розгляньте варіант їх об'єднання докупи.
* Обирайте свої змінні стану ретельно, щоб уникати створення "неможливих" станів.
* Структуруйте свій стан так, щоб знижувати ймовірність помилок при його оновленні.
* Уникайте надлишкового та дубльованого стану, щоб не доводилося його синхронізувати.
* Не додавайте пропси *у* стан, якщо не хочете свідомо запобігти оновленням.
* У разі патернів UI штибу меню вибору, зберігайте у стані ідентифікатор або індекс, а не сам об'єкт.
* Якщо оновлення стану з глибокою вкладеністю – складне, спробуйте його сплющити.

</Recap>

<Challenges>

#### Виправлення компонента, що не оновлюється {/*fix-a-component-thats-not-updating*/}

Цей компонент `Clock` отримує два пропси: `color` і `time`. Коли обрати в блоку вибору інший колір, компонент отримає від свого батьківського компонента інший проп `color`. Проте чомусь виведений колір не оновлюється. Чому? Виправіть проблему.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Оберіть колір:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">світлокораловий</option>
          <option value="midnightblue">опівнічносиній</option>
          <option value="rebeccapurple">темнофіолетовий</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

Проблема в тому, що цей компонент має стан `color`, ініціалізований початковим значенням пропу `color`. Але коли проп `color` змінюється, це не впливає на змінну стану! Тож вони стають розсинхронізованими. Щоб це виправити, вилучіть змінну стану взагалі, й користуйтеся пропом `color` безпосередньо.

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Оберіть колір:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">світлокораловий</option>
          <option value="midnightblue">опівнічносиній</option>
          <option value="rebeccapurple">темнофіолетовий</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Або, користуючись синтаксисом деструктурування:

<Sandpack>

```js src/Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js src/App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Оберіть колір:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">світлокораловий</option>
          <option value="midnightblue">опівнічносиній</option>
          <option value="rebeccapurple">темнофіолетовий</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

#### Виправлення зламаного списку багажу {/*fix-a-broken-packing-list*/}

Цей список багажу має нижній колонтитул, який показує, скільки предметів зібрано та скільки їх є усього. Спершу здається, що він працює, але в ньому є дефекти. Наприклад, якщо позначити предмет як зібраний, а тоді його видалити, то лічильник не оновиться коректно. Виправіть лічильник так, щоб він завжди працював коректно.

<Hint>

Чи є який-небудь стан у цьому прикладі надлишковим?

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>Зібрано {packed} з {total}!</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Додати предмет"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Додати</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Видалити
          </button>
        </li>
      ))}
    </ul>
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

Попри те, що можна було б ретельно виправити кожний обробник подій для коректного оновлення лічильників `total` і `packed`, корінь проблеми полягає в тому, що ці змінні стану взагалі існують. Вони надлишкові, тому що завжди можна обчислити кількість предметів (зібраних чи загальну) на основі самого масива `items`. Вилучіть надлишковий стан, аби виправити ваду:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>Зібрано {packed} з {total}!</b>
    </>
  );
}
```

```js src/AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Додати предмет"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Додати</button>
    </>
  )
}
```

```js src/PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Видалити
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Зверніть увагу, що обробники подій при змінах займаються лише викликом `setItems`. Кількість предметів тепер обчислюється під час наступного рендеру на основі `items`, тому вона завжди актуальна.

</Solution>

#### Виправлення зникнення вибору {/*fix-the-disappearing-selection*/}

У стані є список `letters` (листів). Коли навести курсор або фокус на конкретний лист, він виділяється. Наразі виділений лист зберігається в змінній стану `highlightedLetter`. Можна додавати й забирати "зірочку" з окремих листів, що оновлює масив `letters` у стані.

Цей код працює, але є невеликий глюк UI. Коли натиснути "Додати зірочку" чи "Прибрати зірочку", то виділення тимчасово зникає. Проте воно зникає знову, щойно перевести курсор або перемкнутися на інший лист клавіатурою. Чому так відбувається? Виправіть це, щоб виділення не зникало після натискання кнопок.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Вхідна пошта</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);        
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Прибрати зірочку' : 'Додати зірочку'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'Готові до пригод?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Час зареєструватися!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Фестиваль починається вже за СІМ днів!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

Проблема в тому, що об'єкт листа зберігається в `highlightedLetter`. Але та сама інформація також зберігається в масиві `letters`. Тож у стані є дублювання! Коли масив `letters` оновлюється після клацання миші, створюється новий об'єкт листа, відмінний від `highlightedLetter`. Саме тому перевірка `highlightedLetter === letter` стає `false`, і виділення зникає. Воно з'являється, коли при руханні курсором знову викликається `setHighlightedLetter`.

Щоб виправити цю проблему, приберіть зі стану дублювання. Замість зберігання в двох місцях *самого листа*, збережіть натомість `highlightedId`. Потім можна перевірити `isHighlighted` для кожної літери, обчисливши `letter.id === highlightedId`, і це спрацює, навіть якщо об'єкт `letter` змінився після минулого рендера.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Вхідна пошта</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);        
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Прибрати зірочку' : 'Додати зірочку'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js src/data.js
export const initialLetters = [{
  id: 0,
  subject: 'Готові до пригод?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Час зареєструватися!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Фестиваль починається вже за СІМ днів!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

#### Реалізація множинного вибору {/*implement-multiple-selection*/}

У цьому прикладі кожний `Letter` має проп `isSelected` і обробник `onToggle`, який позначає цей лист як обраний. Це працює, але стан зберігається у вигляді `selectedId` (або `null`, або ідентифікатор), тож лише один лист може бути обраний водночас.

Змініть структуру стану для підтримки множинного вибору. (Як структурувати його? Подумайте, перш ніж писати код.) Кожне поле для позначки повинно стати незалежним від іншим. Клацання обраного листа повинно знімати з нього позначку. І наостанок, нижній колонтитул повинен показувати коректне число обраних елементів.

<Hint>

Замість одного обраного ідентифікатора може мати зміст зберігати у стані масив або [Set](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Set/) обраних ідентифікаторів.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: дозволити множинний вибір
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: дозволити множинний вибір
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>Вхідна пошта</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: дозволити множинний вибір
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Ви обрали {selectedCount} листів
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Готові до пригод?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Час зареєструватися!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Фестиваль починається вже за СІМ днів!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

Замість одного-єдиного `selectedId` зберігайте у стані *масив* `selectedIds`. Наприклад, якщо обрати перший і останній листи, в масиві було б `[0, 2]`. Коли нічого не вибрано, це був би порожній масив `[]`:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Чи був цей лист досі обраним?
    if (selectedIds.includes(toggledId)) {
      // Тоді вилучіть цей ідентифікатор з масиву.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Інакше – додайте цей ідентифікатор до масиву.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>Вхідна пошта</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Ви обрали {selectedCount} листів
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Готові до пригод?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Час зареєструватися!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Фестиваль починається вже за СІМ днів!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Невеличкий недолік використання масиву полягає в тому, що для кожного елемента викликається `selectedIds.includes(letter.id)`, аби перевірити, чи є цей елемент обраним. Якщо масив дуже великий, це може стати проблемою швидкодії, тому що пошук у масиві за допомогою [`includes()`](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) займає лінійний час, і цей пошук відбувається для кожного окремого елемента.

Аби це виправити, можна натомість зберігати в стані [Set](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Set), що пропонує швидку операцію [`has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has):

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Створити копію (для запобігання внесенню змін).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>Вхідна пошта</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            Ви обрали {selectedCount} листів
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js src/Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js src/data.js
export const letters = [{
  id: 0,
  subject: 'Готові до пригод?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Час зареєструватися!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Фестиваль починається вже за СІМ днів!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Тепер кожний елемент має перевірку `selectedIds.has(letter.id)`, яка дуже швидка.

Майте на увазі, що [не слід змінювати об'єкти у стані](/learn/updating-objects-in-state), і те саме також стосується Set. Саме тому функція `handleToggle` спершу створює *копію* Set, а тоді оновлює цю копію.

</Solution>

</Challenges>
