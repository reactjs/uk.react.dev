---
title: Додавання інтерактивності
---

<Intro>

На екрані деякі елементи оновлюються у відповідь на дії користувача. Наприклад, під час натискання на галерею зображень змінюється поточне зображення. У React дані, які поступово змінюються, називаються *станом.* Ви можете додавати стан до будь-якого компонента і оновлювати його за потреби. У цьому розділі ви дізнаєтеся, як писати компоненти, що оброблюють взаємодію, оновлюють свій стан та згодом відображають різний результат.

</Intro>

<YouWillLearn isChapter={true}>

* [Як обробляти події, ініційовані користувачем](/learn/responding-to-events)
* [Як змусити компоненти "запам'ятовувати" інформацію за допомогою стану](/learn/state-a-components-memory)
* [Як React оновлює UI за два кроки](/learn/render-and-commit)
* [Чому стан не оновлюється одразу після його зміни](/learn/state-as-a-snapshot)
* [Як додати до черги кілька оновлень стану](/learn/queueing-a-series-of-state-updates)
* [Як оновити об'єкт у стані](/learn/updating-objects-in-state)
* [Як оновити масив у стані](/learn/updating-arrays-in-state)

</YouWillLearn>

## Реагування на події {/*responding-to-events*/}

React надає вам можливість додавати *обробники подій* до вашого JSX. Обробники подій — це ваші власні функції, які виконуватимуться у відповідь на різні взаємодії, як-от натискання мишкою, наведення курсора, фокусування в елементі введення даних у формі тощо.

Вбудовані компоненти, як-от `<button>`, підтримують лише вбудовані браузерні події, наприклад, `onClick`. Однак ви також можете створювати власні компоненти і надавати їхнім обробникам подій пропси з будь-якими назвами, слушними для вашого застосунку.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Відтворюється!')}
      onUploadImage={() => alert('Завантажується!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Відтворити фільм
      </Button>
      <Button onClick={onUploadImage}>
        Завантажити зображення
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

Прочитайте розділ **["Реагування на події"](/learn/responding-to-events)**, щоб дізнатися, як додавати обробники подій.

</LearnMore>

## Стан: пам'ять компонента {/*state-a-components-memory*/}

Компоненти часто потребують змінювати те, що на екрані, унаслідок взаємодії. Введення у формі має оновлювати поле введення, натискання на кнопку "Далі" у каруселі зображень — змінювати відображуване зображення, а натискання на кнопку "Купити" — додавати продукт до кошика. Компонентам потрібно "пам'ятати" все це: поточне значення у полі введення, поточне зображення, продукти у кошику. У React цей вид пам'яті певного компонента називається *стан*.

Ви можете додати стан до компонента за допомогою хука [`useState`](/reference/react/useState). *Хуки* — це спеціальні функції, які дають змогу вашим компонентам використовувати функції React (стан — одна з цих функцій). Хук `useState` дає вам змогу оголосити змінну стану. Він приймає початковий стан і повертає пару значень: поточний стан і функцію встановлення стану, яка може його оновлювати.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Ось як галерея зображень використовує та оновлює стан після натискання:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Наступна
      </button>
      <h2>
        <i>{sculpture.name} </i>
        — {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} із {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Приховати' : 'Показати'} подробиці
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Данина нейрохірургії (Homenaje a la Neurocirugía)',
  artist: 'Марта Колвін (Marta Colvin Andrade)',
  description: 'Хоча Колвін переважно відома абстрактною тематикою з натяком на символи доіспанського періоду, ця величезна скульптура, присвячена нейрохірургії, є однією з її найвідоміших публічних робіт.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Бронзова статуя двох перехрещених рук, які делікатно тримають людський мозок кінцями пальців.'  
}, {
  name: 'Рід квіткові (Floralis Genérica)',
  artist: 'Едуардо Каталано (Eduardo Catalano)',
  description: 'Ця велетенська (висотою 75 футів або 23 м) срібна квітка знаходиться в Буенос-Айресі. Вона рухома і може закривати свої пелюстки ввечері або під час сильного вітру та відкривати їх зранку.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Велетенська металева скульптура квітки зі світловідбивними, схожими на дзеркало пелюстками і міцними тичинками.'
}, {
  name: 'Вічна присутність (Eternal Presence)',
  artist: 'Джон Вілсон (John Woodrow Wilson)',
  description: 'Вілсон був відомий своєю зацікавленістю у рівності, соціальній справедливості, а також в основних і духовних якостях людства. Ця масивна (висотою 7 футів або 2.13 м) бронзова скульптура зображає те, що він описав як "символічна присутність темношкірих, що наповнена почуттям універсальної людяності".',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'Скульптура людської голови, що здається всюдисущою і поважною. Вона випромінює спокій і мир.'
}, {
  name: 'Моаї (Moai)',
  artist: 'Невідомий автор',
  description: 'На острові Пасхи розташовано близько тисячі моаї — збережені до нашого часу монументальні статуї, створені першими рапануйцями, які, як деякі вважають, представляли "божественних" предків.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Три монументальні кам\'яні бюсти з головами, що є непропорційно великими і мають насуплені обличчя.'
}, {
  name: 'Синя "нана́" (Blue Nana)',
  artist: 'Нікі де Сен Фаль (Niki de Saint Phalle)',
  description: 'Нани (від фр. Nana — сленг: "жіночка") — це врочисті створіння, символи жіночності та материнства. Спочатку Сен Фаль використовувала тканину і наявні предмети (found objects) для нан, а потім додала поліестер, щоб зробити їх більш яскравими.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Велика мозаїчна скульптура вигадливої жіночої постаті у кольоровому костюмі, що танцює і випромінює радість.'
}, {
  name: 'Довершена форма (Ultimate Form)',
  artist: 'Барбара Хепворт (Barbara Hepworth)',
  description: 'Ця абстрактна бронзова скульптура є частиною серії "Родина Людей" ("The Family of Man"), розташованої в парку скульптур у Йоркширі. Хепворт вирішила не створювати буквальні зображення світу, а розвивати абстрактні форми, натхненні людьми та пейзажами.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Висока скульптура з трьох поставлених один на одного елементів, що нагадує постать людини.'
}, {
  name: 'Воїн (Cavaliere)',
  artist: 'Ламіді Факеє (Lamidi Olonade Fakeye)',
  description: "Роботи Факеє, різьбяра по дереву у четвертому поколінні, поєднують традиційні та сучасні теми народу Йоруба.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Деталізована дерев\'яна скульптура воїна із зосередженим обличчям на коні, прикрашеному візерунками.'
}, {
  name: 'Великі животи (Big Bellies)',
  artist: 'Аліна Шапочніков (Alina Szapocznikow)',
  description: 'Шапочніков відома своїми скульптурами фрагментів тіла як метафори крихкості та непостійності молодості і краси. Ця скульптура зображує два розташовані один над одним дуже реалістичних великих животи висотою приблизно п\'ять футів (1.5 м) кожен.',
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Скульптура нагадує каскад складок, що зовсім не схоже на животи у класичних скульптурах.'
}, {
  name: 'Теракотова армія (Terracotta Army)',
  artist: 'Невідомий автор',
  description: 'Теракотова армія — це колекція теракотових скульптур, що зображають війська Цінь Ши Хуан-ді, першого імператора Китаю. Армія складалася з понад 8 000 солдатів, 130 колісниць із 520 кіньми та 150 одиниць кінноти.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 теракотових скульптур суворих воїнів, кожен з унікальним виразом обличчя та бронею.'
}, {
  name: 'Місячний пейзаж (Lunar Landscape)',
  artist: 'Луїза Невельсон (Louise Nevelson)',
  description: 'Невельсон була відома тим, що знаходила матеріали серед відходів Нью-Йорка, які вона потім збирала в монументальні споруди. У цій роботі вона використала різнорідні частини, як-от стійку ліжка, булаву для жонглювання та фрагмент сидіння, прибивши та вклеївши їх у коробки, які відображають вплив геометричної абстракції простору та форми кубізму.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Чорна матова скульптура, в якій окремі елементи неможливо розрізнити на початку споглядання.'
}, {
  name: 'Ореол (Aureole)',
  artist: 'Ранджані Шеттар (Ranjani Shettar)',
  description: 'Шеттар поєднує традиційне та сучасне, природне та індустріальне. Її творчість зосереджена на стосунках між людиною та природою. Її роботи описують як переконливі і абстрактно, і образно, як ті, що кидають виклик гравітації, та як "тонкий синтез нетипових матеріалів".',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Бліда подібна до дротів скульптура, що встановлена на бетонній стіні та спадає додолу. Здається легкою.'
}, {
  name: 'Бегемоти (Hippos)',
  artist: 'Зоопарк Тайбею (Taipei Zoo)',
  description: 'Зоопарк Тайбею замовив площу бегемотів із зануреними бегемотами під час гри.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Група бронзових скульптур бегемота, що виринає з тротуару, ніби вони пливуть.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Прочитайте розділ **["Стан: пам'ять компонента"](/learn/state-a-components-memory)**, щоб дізнатися, як запам'ятати значення та оновлювати його внаслідок взаємодії.

</LearnMore>

## Рендер і коміт {/*render-and-commit*/}

Перш ніж ваші компоненти відобразяться на екрані, їх повинен відрендерити React. Розуміння кроків цього процесу допоможе осмислити перебіг виконання вашого коду та пояснити його поведінку.

Уявіть, що ваші компоненти — це кухарі на кухні, які створюють смачні страви з інгредієнтів. У такій історії React — це офіціант, який приймає від клієнтів замовлення та видає їм їжу. Цей процес замовлення та видавання UI складається з трьох кроків:

1. **Тригер** рендеру (доставлення замовлення гостя на кухню)
2. **Рендер** компонента (готування замовлення на кухні)
3. **Коміт** у DOM (розміщення замовлення на столі гостя)

<IllustrationBlock sequential>
  <Illustration caption="Тригер" alt="React як офіціант у ресторані, що збирає замовлення від клієнтів і передає їх до кухні компонентів (Component Kitchen)." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Рендер" alt="Кухар карток видає React свіжий компонент картки (Card)." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Коміт" alt="React доставляє картку (Card) клієнту на стіл." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Прочитайте розділ **["Рендер і коміт"](/learn/render-and-commit)** для вивчення життєвого циклу оновлення UI.

</LearnMore>

## Стан як снепшот {/*state-as-a-snapshot*/}

На відміну від звичайних змінних JavaScript, стан React поводиться радше як снепшот. Задання йому значення не змінює наявну змінну стану, а натомість запускає повторний рендер. Це може бути неочікувано на початку!

```js
console.log(count);  // 0
setCount(count + 1); // Запитує повторний рендер з 1
console.log(count);  // Досі 0!
```

Ця поведінка допомагає уникнути дефектів. Ось невеличкий застосунок чату. Спробуйте вгадати, що відбудеться, якщо спершу натиснути "Надіслати", а *потім* змінити отримувача на Боба. Чиє ​ім'я відображатиме `alert` через п'ять секунд?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Аліса');
  const [message, setMessage] = useState('Привіт');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Ви надіслали ${message} користувачу ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Кому:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Аліса</option>
          <option value="Bob">Боб</option>
        </select>
      </label>
      <textarea
        placeholder="Повідомлення"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Надіслати</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Прочитайте розділ **["Стан як снепшот"](/learn/state-as-a-snapshot)**, щоб дізнатися, чому стан має "фіксований" і незмінний вигляд всередині обробників подій.

</LearnMore>

## Додавання до черги низки оновлень стану {/*queueing-a-series-of-state-updates*/}

Цей компонент має помилку: клацання "+3" збільшує лічильник лише на одиницю.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Загалом: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

Розділ ["Стан як снепшот"](/learn/state-as-a-snapshot) пояснює, чому таке відбувається. Задання значення стану запитує новий повторний рендеринг, але не змінює сам стан у коді, що вже виконується. У такий спосіб `score` все ще дорівнює `0` одразу після виклику `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Ви можете виправити це, передаючи *функцію-оновлювач* під час задання стану. Зауважте, як заміна `setScore(score + 1)` на `setScore(s => s + 1)` виправляє кнопку "+3". Це дає вам змогу додавати до черги кілька оновлень стану.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Загалом: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Прочитайте розділ **["Додавання до черги низки оновлень стану"](/learn/queueing-a-series-of-state-updates)**, щоб дізнатися, як додавати до черги послідовні оновлення стану.

</LearnMore>

## Оновлення об'єктів у стані {/*updating-objects-in-state*/}

Стан може зберігати будь-який тип значень JavaScript, включно з об'єктами. Але вам не слід безпосередньо змінювати об'єкти та масиви, які ви утримуєте в стані React. Замість цього, коли вам потрібно оновити об'єкт або масив, створіть новий (або зробіть копію наявного), а потім оновіть стан, щоб використовувати цю копію.

Зазвичай ви використовуватимете синтаксис поширення `...` для копіювання об'єктів та масивів, які ви хочете змінити. Наприклад, оновлення вкладеного об'єкта може мати такий вигляд:

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

Якщо копіювання об'єктів у коді виснажує, ви можете використовувати бібліотеку, як-от [Immer](https://github.com/immerjs/use-immer), щоб зменшити повторюваний код:

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

<LearnMore path="/learn/updating-objects-in-state">

Прочитайте розділ **["Оновлення об'єктів у стані"](/learn/updating-objects-in-state)**, щоб дізнатися, як правильно оновлювати об'єкти.

</LearnMore>

## Оновлення масивів у стані {/*updating-arrays-in-state*/}

Масиви — це ще один тип змінних об'єктів JavaScript, які ви можете зберігати у стані і повинні розглядати як доступні тільки для читання. Як і з об'єктами, коли вам потрібно оновити масив, що зберігається в стані, слід створити новий (або зробити копію наявного), а потім використати цей новий масив під час задання стану:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Великі животи (Big Bellies)', seen: false },
  { id: 1, title: 'Місячний пейзаж (Lunar Landscape)', seen: false },
  { id: 2, title: 'Теракотова армія (Terracotta Army)', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Мистецький список</h1>
      <h2>Мій список для перегляду</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
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

Якщо копіювання масивів у коді виснажує, ви можете використовувати бібліотеку, як-от [Immer](https://github.com/immerjs/use-immer), щоб зменшити повторюваний код:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Великі животи (Big Bellies)', seen: false },
  { id: 1, title: 'Місячний пейзаж (Lunar Landscape)', seen: false },
  { id: 2, title: 'Теракотова армія (Terracotta Army)', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Мистецький список</h1>
      <h2>Мій список для перегляду</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
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

<LearnMore path="/learn/updating-arrays-in-state">

Прочитайте розділ **["Оновлення масивів у стані"](/learn/updating-arrays-in-state)**, щоб дізнатися, як правильно оновлювати масиви.

</LearnMore>

## Що далі? {/*whats-next*/}

Перейдіть до розділу ["Реагування на події"](/learn/responding-to-events), щоб почати читати цю секцію посторінково!

Або, якщо ви вже знайомі з цими темами, чому б не переглянути ["Управління станом"](/learn/managing-state)?
