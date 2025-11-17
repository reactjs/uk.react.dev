---
title: Оновлення об'єктів у стані
---

<Intro>

У стані може зберігатися будь-який тип значення JavaScript, включно з об'єктами. Але вам не варто просто змінювати об'єкти, які ви зберігаєте в стані React. Натомість, коли ви хочете оновити об'єкт, вам потрібно створити новий (або зробити копію наявного), а потім задати стан, щоб використати цю копію.

</Intro>

<YouWillLearn>

- Як правильно оновити об'єкт у стані React 
- Як оновити вкладений об'єкт без того, щоб його змінювати 
- Що таке незмінність та як її не порушити 
- Як зробити копіювання об'єкта менш монотонним за допомогою Immer

</YouWillLearn>

## Що таке мутація? {/*whats-a-mutation*/}

Ви можете зберігати будь-який тип значення JavaScript у стані.

```js
const [x, setX] = useState(0);
```

Поки що ви працювали з числами, рядками та булевими значеннями. Ці типи значень JavaScript є "незмінними", тобто доступними тільки для читання. Ви можете збудити (trigger) повторний рендер, щоб _замінити_ значення:

```js
setX(5);
```

Стан `x` змінився з `0` на `5`, але _число `0`_ не змінилося. У JavaScript неможливо внести зміни до вбудованих примітивних значень, таких як числа, рядки та булеві значення.

Тепер розглянемо об'єкт у стані:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Технічно можливо змінити вміст _самого об'єкта_. **Це називається мутацією:**

```js
position.x = 5;
```

Проте, хоча об'єкти в стані React технічно можна змінити, вам варто вважати їх незмінними, так само як числа, булеві значення та рядки. Замість того, щоб змінювати їх, краще завжди їх замінювати.

## Вважайте стан доступним тільки для читання {/*treat-state-as-read-only*/}

Інакше кажучи, вам варто **вважати будь-який об'єкт JavaScript, який ви вкладаєте в стан, доступним тільки для читання.**

У цьому прикладі об'єкт зберігається в стані, щоб показувати поточне розташування вказівника. Червона точка повинна рухатися, коли ви водите курсором по області попереднього перегляду. Але ця точка залишається в початковому положенні:

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Помилку допущено в цій частині коду.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

У ній змінюється об'єкт, призначений до `position` з [попереднього рендеру.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) Але без використання функції задання стану React не розуміє, що об'єкт змінився. Тому React нічого не робить у відповідь. Це все одно, що ви намагаєтеся змінити замовлення після того, як вже поїли. Хоча мутація стану може спрацювати в деяких випадках, ми не радимо так робити. Вам варто вважати значення стану, до якого ви маєте доступ під час рендеру, доступним тільки для читання.

Щоб правильно [збудити повторний рендер](/learn/state-as-a-snapshot#setting-state-triggers-renders) у цьому разі, **створіть *новий* об'єкт та передайте його у функцію задання стану:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

Використовуючи `setPosition`, ви кажете React:

* Заміни `position` новим об'єктом 
* І відрендер цей компонент знову

Погляньте, як червона точка тепер слідує за вашим вказівником, коли ви водите курсором по області попереднього перегляду:

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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Локальна мутація — це нормально {/*local-mutation-is-fine*/}

У такому коді, як цей, є помилка, оскільки він змінює об'єкт, що *наявний* у стані:

```js
position.x = e.clientX;
position.y = e.clientY;
```

Але код нижче є **абсолютно припустимим**, оскільки ви змінюєте новий об'єкт, який ви *щойно створили*.

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Це фактично те саме, що написати таким чином:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Мутація спричиняє проблеми тільки тоді, коли ви змінюєте *наявні* об'єкти, що вже знаходяться в стані. Змінення об'єкта, який ви щойно створили, є нормальним, оскільки *у жодному іншому коді поки немає посилання на нього.* Якщо змінити його, це не вплине випадково на щось, що залежить від нього. Це називається "локальною мутацією". Локальна мутація допустима навіть [під час рендеру.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Дуже зручно й абсолютно нормально!

</DeepDive>  

## Копіювання об'єктів за допомогою синтаксису spread {/*copying-objects-with-the-spread-syntax*/}

У попередньому прикладі об'єкт `position` завжди створюється наново відповідно до поточного розташування курсора. Але часто ви захочете включити *наявні* дані як частину нового об'єкта, що ви створюєте. Наприклад, ви, можливо, хочете оновити *тільки одне* поле у формі, але залишити попередні значення для всіх інших полів.

Ці поля введення не працюють, бо обробники `onChange` змінюють стан:

<Sandpack>

```js {expectedErrors: {'react-compiler': [11, 15, 19]}}
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Барбара',
    lastName: 'Гепворт',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        Ім'я:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Прізвище:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Наприклад, у цьому рядку змінюється стан з попереднього рендеру:

```js
person.firstName = e.target.value;
```

Щоб отримати бажаний результат, надійний спосіб — це створити новий об'єкт і передати його до `setPerson`. Але тут ви також хочете **скопіювати наявні дані в нього**, тому що тільки одне з полів змінилося:

```js
setPerson({
  firstName: e.target.value, // Нове ім'я, отримане з поля введення
  lastName: person.lastName,
  email: person.email
});
```

Ви можете використати [spread-синтаксис об'єкта](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Operators/Spread_syntax/#rozghortannia-v-obiektnykh-literalakh) `...`, так що вам не треба буде копіювати кожну властивість окремо.

```js
setPerson({
  ...person, // Скопіювати попередні значення полів
  firstName: e.target.value // Але переписати значення цього поля
});
```

Тепер форма працює!

Зверніть увагу на те, що ви не оголосили окрему змінну в стані для кожного поля введення. Зберігання всіх даних, зібраних в одному об'єкті, є дуже зручним для великих форм, поки ви оновлюєте його правильно!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Барбара',
    lastName: 'Гепворт',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        Ім'я:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Прізвище:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Примітьте, що синтаксис spread `...` є "поверхневим", тобто він копіює властивості тільки на одному рівні. Це робить його швидким, але також означає, що, коли ви захочете оновити вкладену властивість, вам треба буде використати його більше одного разу.

<DeepDive>

#### Використання одного обробника подій для багатьох полів {/*using-a-single-event-handler-for-multiple-fields*/}

Ви також можете використати дужки `[` і `]` всередині визначення об'єкта, щоб установити властивість з динамічним іменем. Нижче наведений той самий приклад, але тільки з одним обробником подій замість трьох різних.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Барбара',
    lastName: 'Гепворт',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        Ім'я:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Прізвище:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Тут `e.target.name` посилається на властивість `name`, яка дана DOM-елементу `<input>`.

</DeepDive>

## Оновлення вкладеного об'єкта {/*updating-a-nested-object*/}

Зверніть увагу на таку структуру вкладеного об'єкта:

```js
const [person, setPerson] = useState({
  name: 'Нікі де Сен Фаль (Niki de Saint Phalle)',
  artwork: {
    title: 'Синя "нана́" (Blue Nana)',
    city: 'Гамбург',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Якщо б ви захотіли оновити `person.artwork.city`, нескладно зрозуміти, як це зробити за допомогою мутації:

```js
person.artwork.city = 'Нью-Делі';
```

Але в React вам варто вважати стан незмінним! Щоб змінити `city`, вам спочатку треба було б створити новий об'єкт `artwork` (заздалегідь заповнений даними з попереднього), а потім створити новий об'єкт `person`, який вказує на новий `artwork`:

```js
const nextArtwork = { ...person.artwork, city: 'Нью-Делі' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Або записати як одиничний виклик функції:

```js
setPerson({
  ...person, // Скопіювати інші поля
  artwork: { // але замінити artwork
    ...person.artwork, // таким самим витвором мистецтва
    city: 'Нью-Делі' // але в Нью-Делі!
  }
});
```

Виглядає дещо багатослівним, але добре працює в багатьох випадках:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Нікі де Сен Фаль (Niki de Saint Phalle)',
    artwork: {
      title: 'Синя "нана́" (Blue Nana)',
      city: 'Гамбург',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Ім'я:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Назва:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Місто:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Зображення:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' — '}
        {person.name}
        <br />
        (місце розташування: {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### Об'єкти насправді не зовсім вкладені {/*objects-are-not-really-nested*/}

У коді такий об'єкт, як цей, здається "вкладеним":

```js
let obj = {
  name: 'Нікі де Сен Фаль (Niki de Saint Phalle)',
  artwork: {
    title: 'Синя "нана́" (Blue Nana)',
    city: 'Гамбург',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Однак думка про те, що об'єкти поводять себе так, ніби можуть бути "вкладеними", є неточною. Під час виконання коду немає такого поняття як "вкладений" об'єкт. Насправді це два різні об'єкти:

```js
let obj1 = {
  title: 'Синя "нана́" (Blue Nana)',
  city: 'Гамбург',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Нікі де Сен Фаль (Niki de Saint Phalle)',
  artwork: obj1
};
```

Об'єкт `obj1` не є "всередині" об'єкта `obj2`. Наприклад, `obj3` може "вказувати" на `obj1` також:

```js
let obj1 = {
  title: 'Синя "нана́" (Blue Nana)',
  city: 'Гамбург',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Нікі де Сен Фаль (Niki de Saint Phalle)',
  artwork: obj1
};

let obj3 = {
  name: 'Повторюха',
  artwork: obj1
};
```

Якби ви змінили властивість `obj3.artwork.city`, вона б вплинула і на `obj2.artwork.city`, і на `obj1.city`. Це відбувається, оскільки `obj3.artwork`, `obj2.artwork`, та `obj1` є одним і тим самим об'єктом. Це складно зрозуміти, якщо ви сприймаєте об'єкти як "вкладені". Натомість вони є окремими об'єктами, які "вказують" один на одного за допомогою властивостей.

</DeepDive>  

### Пишіть лаконічну логіку оновлення за допомогою Immer {/*write-concise-update-logic-with-immer*/}

Якщо ваш стан глибоко вкладений, ви, можливо, захочете звернути увагу на те, щоб [його реконструювати.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) Але якщо ви не хочете змінювати структуру вашого стану, можете віддати перевагу спрощенню над використанням вкладеного spread-синтаксису. [Immer](https://github.com/immerjs/use-immer) — це популярна бібліотека, яка дозволяє вам писати код, використовуючи зручний синтаксис з мутаціями, що робить копії за вас. За допомогою Immer написаний вами код виглядає так, ніби ви "порушуєте правила" і змінюєте об'єкт:

```js
updatePerson(draft => {
  draft.artwork.city = 'Лагос';
});
```

Але на відміну від звичайної мутації, він не переписує минулий стан!

<DeepDive>

#### Як Immer працює? {/*how-does-immer-work*/}

Чернетка `draft`, яку надає Immer, — це спеціальний тип об'єкта, названий [Proxy](https://webdoky.org/uk/docs/Web/JavaScript/Reference/Global_Objects/Proxy), який "записує" те, що ви робите з ним. Ось чому ви можете вільно змінювати його стільки разів, скільки вам потрібно! Під капотом Immer знаходить, які частини `draft` були змінені, і створює абсолютно новий об'єкт, що містить ваші редагування.

</DeepDive>

Щоб спробувати Immer:

1. Виконайте `npm install use-immer`, щоб додати Immer як залежність
2. Потім замініть `import { useState } from 'react'` на `import { useImmer } from 'use-immer'`

Ось вище зазначений приклад, перетворений за допомогою Immer:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Нікі де Сен Фаль (Niki de Saint Phalle)',
    artwork: {
      title: 'Синя "нана́" (Blue Nana)',
      city: 'Гамбург',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Ім'я:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Назва:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Місто:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Зображення:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' — '}
        {person.name}
        <br />
        (місце розташування: {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Зверніть увагу на те, наскільки лаконічним став обробник подій. Ви можете поєднувати `useState` та `useImmer` в одному компоненті стільки разів, скільки захочеться. Immer — незамінний помічник у тому, щоб тримати обробники подій лаконічними, особливо коли вкладення є присутнім у вашому стані та копіювання об'єктів призводить до монотонного коду.

<DeepDive>

#### Чому не рекомендується змінювати стан у React? {/*why-is-mutating-state-not-recommended-in-react*/}

Є декілька причин:

* **Налагодження:** Якщо ви використовуєте `console.log` і ваш стан не має мутацій, попередні логи не будуть замінені недавніми змінами стану. Тому ви чітко можете побачити, як стан змінився між рендерами.
* **Оптимізація:** Загальні [стратегії оптимізації](/reference/react/memo) в React полягають в пропущенні роботи, якщо попередні пропси або стан такі ж самі, як і наступні. Якщо ви ніколи не змінюєте стан, перевірка на зміни в ньому є дуже швидкою. Якщо `prevObj === obj` (попередній об'єкт дорівнює теперішньому), ви можете бути впевненими, що нічого не змінилося всередині нього.
* **Нові функції:** Нові функції в React, що ми створюємо, залежать від стану, який ми [вважаємо снепшотом.](/learn/state-as-a-snapshot) Якщо ви змінюєте минулі версії стану, це може перешкоджати вам використовувати нові функції.
* **Зміни вимог:** Деякі функції додатка, такі як Скасувати/Повторити, відображення історії змін або дозвіл користувачу скинути форму до попередніх значень, легше втілити в життя, коли немає мутацій. Це можливо, бо ви можете зберігати попередні копії стану в пам'яті і використовувати їх знову, коли це доречно. Якщо на початку ваш підхід полягає в мутаціях, то потім подібні функції може бути складно додати.
* **Легше втілення:** Оскільки React не спирається на мутації, йому не треба робити нічого особливого з вашими об'єктами. Йому не треба викрадати їхні властивості, завжди загортати їх в Proxy об'єкти або виконувати іншу роботу під час ініціалізації, як це роблять багато "реактивних" фреймворків та бібліотек. Це також причина того, чому React дозволяє вам вкласти в стан будь-який об'єкт незалежно від його розміру, а також без додаткових пасток, пов'язаних з продуктивністю або правильністю.

На практиці ви часто можете "втекти" за допомогою мутацій стану в React, але ми наполегливо рекомендуємо не змінювати його для того, щоб ви могли використовувати нові функції в React, розробленими, враховуючи цей підхід. Майбутні співробітники будуть вдячні та, можливо, навіть майбутній ви скажете собі дякую!

</DeepDive>

<Recap>

* Вважайте весь стан у React незмінним.
* Коли ви зберігаєте об'єкти в стані, їх змінення не збудить рендери й перемінить стан у попередніх "снепшотах" рендеру.
* Замість того, щоб змінювати об'єкт, створіть його *нову* версію та збудіть повторний рендер, задаючи йому стан.
* Ви можете використати spread-синтаксис об'єкта `{...obj, something: 'newValue'}`, щоб створити копії об'єктів.
* Синтаксис spread є поверхневим: він копіює тільки на одному рівні.
* Щоб оновити вкладений об'єкт, вам потрібно створити копії всього аж до того місця, що ви оновлюєте.
* Щоб зменшити монотонне копіювання коду, використайте Immer.

</Recap>



<Challenges>

#### Виправіть неправильне оновлення стану {/*fix-incorrect-state-updates*/}

Ця форма має декілька дефектів. Натисніть на кнопку, що збільшує рахунок, кілька разів. Зверніть увагу на те, що він не збільшується. Потім змініть ім'я — і ви побачите, що рахунок раптом "наздогнав" ваші зміни. Зрештою змініть прізвище — і ви побачите, що рахунок повністю зник.

Ваше завдання полягає в тому, щоб виправити всі ці дефекти. Виправляючи їх, поясніть причину кожного окремо.

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ранджані',
    lastName: 'Шеттар',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Рахунок: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Ім'я:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Прізвище:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Ось версія, де обидва дефекти виправлено:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ранджані',
    lastName: 'Шеттар',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Рахунок: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Ім'я:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Прізвище:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Проблема з `handlePlusClick` полягала в тому, що обробник подій змінював об'єкт `player`. В результаті React не знав, що є причина для повторного рендеру, і не оновив рахунок на екрані. Ось чому, коли ви змінили ім'я, стан оновився, збудивши повторний рендер, який _також_ оновив рахунок на екрані.

Проблема з `handleLastNameChange` полягала в тому, що обробник подій не скопіював *наявні* поля `...player` до нового об'єкта. Ось чому рахунок загубився після того, як ви змінили прізвище.

</Solution>

#### Знайдіть та виправте мутацію {/*find-and-fix-the-mutation*/}

На статичному фоні знаходиться квадрат, який можна перемістити. Ви можете змінити його колір, використовуючи поле вибору.

Але є дефект. Якщо ви спочатку пересунете квадрат, а потім зміните його колір, то фон (який не повинен переміщатися!) "перестрибне" на нову позицію. Але не треба, щоб так було: проп `position` компонента `Background` заданий до об'єкта `initialPosition`, який дорівнює `{ x: 0, y: 0 }`.  Чому фон переміщується, коли колір змінюється?

Знайдіть дефект та виправте його.

<Hint>

Якщо щось непередбачено змінюється, значить причиною є мутація. Знайдіть мутацію в `App.js` та виправте її.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [17]}} src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">помаранчевий</option>
        <option value="lightpink">світло-рожевий</option>
        <option value="aliceblue">ціано-блакитний</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Тягніть мене!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Проблема полягала в мутації всередині `handleMove`. Обробник подій змінив `shape.position`, але це той самий об'єкт, на який вказує `initialPosition`. Ось чому і образ (`shape`), і фон переміщуються. (Це мутація, тому зміну не видно на екрані, поки непов'язане оновлення, тобто переміна кольору, не збудить повторний рендер.)

Налагодження полягає в тому, щоб прибрати мутацію з `handleMove` і використати синтаксис spread, щоб скопіювати образ. Зверніть увагу на те, що `+=` — це мутація, тому вам треба зробити запис по-іншому, використовуючи звичайну операцію `+`.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">помаранчевий</option>
        <option value="lightpink">світло-рожевий</option>
        <option value="aliceblue">ціано-блакитний</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Тягніть мене!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Оновіть об'єкт за допомогою Immer {/*update-an-object-with-immer*/}

Це той самий приклад з дефектами з попереднього завдання. На цей раз виправте мутацію, використовуючи Immer. Для вашої зручності `useImmer` вже імпортовано, тому вам треба перемінити змінну в стані об'єкта `shape`, щоб використати Immer.

<Sandpack>

```js {expectedErrors: {'react-compiler': [18]}} src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">помаранчевий</option>
        <option value="lightpink">світло-рожевий</option>
        <option value="aliceblue">ціано-блакитний</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Тягніть мене!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

Це розв'язок, записаний за допомогою Immer. Зверніть увагу, як обробники подій записані в стилі мутацій, але дефектів немає. Це відбувається, бо під капотом Immer ніколи не змінює наявні об'єкти.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">помаранчевий</option>
        <option value="lightpink">світло-рожевий</option>
        <option value="aliceblue">ціано-блакитний</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Тягніть мене!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
