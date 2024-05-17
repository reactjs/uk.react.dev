---
title: Додавання інтерактивності
---

<Intro>

На екрані деякі елементи оновлюються у відповідь на дії користувача. Наприклад, під час натискання на галерею зображень змінюється поточне зображення. У React дані, які поступово змінюються, називаються *станом.* Ви можете додавати стан до будь-якого компонента і оновлювати його за потреби. У цьому розділі ви дізнаєтеся, як писати компоненти, що оброблюють взаємодію, оновлюють свій стан та згодом відображають різний результат.

</Intro>

<YouWillLearn isChapter={true}>

* [Як обробляти події, ініційовані користувачем](/learn/responding-to-events)
* [Як зберігати інформацію у компонентах за допомогою стану](/learn/state-a-components-memory)
* [Як React оновлює користувацький інтерфейс у двох фазах](/learn/render-and-commit)
* [Чому стан не оновлюється одразу після його зміни](/learn/state-as-a-snapshot)
* [Як чергувати кілька оновлень стану](/learn/queueing-a-series-of-state-updates)
* [Як оновити об'єкт у стані](/learn/updating-objects-in-state)
* [Як оновити масив у стані](/learn/updating-arrays-in-state)

</YouWillLearn>

## Реагування на події {/responding-to-events/}

У React ви можете додавати обробники подій до свого JSX. Обробники подій - це ваші власні функції, які будуть викликані у відповідь на дії користувача, такі як натискання, наведення, фокусування на полях введення форми та інші.

Вбудовані компоненти, наприклад <button>, підтримують лише вбудовані браузерні події, такі як onClick. Однак ви також можете створювати власні компоненти і надавати їм обробникам подій пропи з будь-якими іменами, які підходять для вашого додатку.

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Грає!')}
      onUploadImage={() => alert('Завантажується!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Грати фільм
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

Прочитайте **[Реагування на Події](/learn/responding-to-events)** щоб дізнатися, як додавати обробники подій.

</LearnMore>

## Стан: пам'ять компонента {/state-a-components-memory/}

Компоненти часто потребують змінювати те, що відображається на екрані в результаті взаємодії. Введення даних у форму повинно оновлювати поле введення, натискання кнопки "далі" на каруселі зображень повинно змінювати відображене зображення, натискання кнопки "купити" розміщує товар у кошику. Компоненти повинні "пам'ятати" різні речі: поточне значення введення, поточне зображення, кошик покупок. У React такий тип пам'яті, специфічний для компонента, називається *станом.*

Ви можете додати стан до компонента за допомогою хука [`useState`](/reference/react/useState). *Хуки* - це спеціальні функції, які дозволяють вашим компонентам використовувати функціональні можливості React (стан - одна з цих можливостей). Хук `useState` дозволяє вам оголосити змінну стану. Він приймає початковий стан і повертає пару значень: поточний стан і функцію установки стану, яка дозволяє вам його оновлювати.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Ось як галерея зображень використовує та оновлює стан при натисканні:

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
        Далі
      </button>
      <h2>
        <i>{sculpture.name} </i>
        від {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} з {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
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
  name: 'Homenaje a la Neurocirugía',
  artist: 'Марта Кольвін Андраде',
  description: 'Хоча Кольвін в основному відома своїми абстрактними темами, які натякають на дохідно-гіспанські символи, ця гігантська скульптура, присвячена нейрохірургії, є однією з найвпізнаваніших робіт скульптури в громадському просторі.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Статуя з бронзи, на якій дві перехрещені руки ніжно тримають людський мозок на вказівних пальцях.'
}, {
  name: 'Floralis Genérica',
  artist: 'EЕдуардо Каталано',
  description: 'Ця величезна (75 футів або 23 метри) срібляста квітка розташована в Буенос-Айресі. Вона призначена для руху, закриваючи свої пелюстки ввечері або при сильному вітрі, і відкриваючи їх вранці.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Гігантська металева скульптура квітки з відбиваючими пелюстками, схожими на дзеркало, і міцними тичинками.'
}, {
  name: 'Eternal Presence',
  artist: 'Джон Вудроу Вільсон',
  description: 'Вілсон був відомий своєю зацікавленістю рівністю, соціальною справедливістю, а також основними і духовними якостями людства. Ця величезна (7 футів або 2,13 метри) бронзова скульптура втілює те, що він описував як "символічне чорне присутність, що пройнята почуттям загальної людяності."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'Скульптура, яка зображує людську голову, здається вічно присутньою і урочистою. Вона випромінює спокій і безтурботність.'
}, {
  name: 'Moai',
  artist: 'Невідомий художник',
  description: 'Розташовані на острові Пасхи, є 1000 моаї, або величезних статуй, створених давніми людьми Рапа Нуі, яких деякі вважають уособленням убожествленого предків.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Три величезних кам'яних бюста з головами, які надто великі у порівнянні з тулубом, з похмурними обличчями.'
}, {
  name: 'Blue Nana',
  artist: 'Нікі де Сен-Фалль',
  description: 'Нани — це торжественні створіння, символи жіночності та материнства. Спочатку Сен-Фалль використовувала тканину та знайдені об'єкти для створення Нан, а пізніше ввела поліестер для досягнення більш яскравого ефекту.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Велика мозаїчна скульптура веселого танцюючого жіночого образу в яскравому костюмі, що випромінює радість.'
}, {
  name: 'Ultimate Form',
  artist: 'Барбара Хепворт',
  description: 'Ця абстрактна бронзова скульптура є частиною серії "Сім'я людська", розташованої в Йоркширському скульптурному парку. Хепворт вирішила не створювати буквальні представлення світу, а розвивати абстрактні форми, натхненні людьми та пейзажами.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Висока скульптура з трьох елементів, розміщених один на одному, нагадуючи людську фігуру.'
}, {
  name: 'Cavaliere',
  artist: 'Ламіді Олонаде Факеє',
  description: "Походячи з чотирьох поколінь різьбярів по дереву, творчість Факеє поєднувала традиційні та сучасні теми йоруба.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Складна дерев'яна скульптура воїна з уважним обличчям на коні, прикрашеному візерунками.'
}, {
  name: 'Big Bellies',
  artist: 'Аліна Шапочникова',
  description: "Шапочникова відома своїми скульптурами фрагментованого тіла як метафорою крихкості та непостійності молодості та краси. Ця скульптура зображує дві дуже реалістичні великі животи, розташовані один над одним, кожен приблизно по п'ять футів (1,5 метра) заввишки.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Скульптура нагадує каскад заломів, досить відмінний від животів у класичних скульптурах.'
}, {
  name: 'Terracotta Army',
  artist: 'Невідомий художник',
  description: 'Армія з теракоти - це колекція теракотових скульптур, які зображують армії Цинь Ші Хуана, першого імператора Китаю. Армія складалася з понад 8000 солдатів, 130 колісниць з 520 кіньми та 150 коней кінних вояків.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 теракотових скульптур урочистих воїнів, кожен з унікальним виразом обличчя та бронею.'
}, {
  name: 'Lunar Landscape',
  artist: 'Луїз Невельсон',
  description: 'Невельсон була відома тим, що збирала предмети з решток у Нью-Йорку, які потім вона складала в монументальні конструкції. У цій роботі вона використала різнорідні деталі, такі як ніжка від ліжка, шайба для жонглювання та фрагмент сидіння, прибиваючи та склеюючи їх у коробки, які відображають вплив геометричної абстракції простору та форми кубізму.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Чорна матова скульптура, де окремі елементи спочатку неможливо відрізнити один від одного.'
}, {
  name: 'Aureole',
  artist: 'Ранджані Шеттар',
  description: 'Шеттар об'єднує традиційне і сучасне, природне і промислове. Її мистецтво зосереджене на взаємині людини і природи. Її роботу описали як переконливу як абстрактну, так і фігуративну, що піддається гравітації, і "вдале поєднання незвичайних матеріалів."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Бліда скульптура, схожа на дріт, прикріплена до бетонної стіни і спускається на підлогу. Вона виглядає легкою.'
}, {
  name: 'Hippos',
  artist: 'Тайбейський зоопарк',
  description: 'Тайбейський зоопарк замовив Квадратну площу Гіппопотамів з підводними гіппопотамами, які граються.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Група бронзових скульптур гіпопотамів, що виступають із підвір'я, немов вони пливуть.'
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

Прочитайте **[Стан: Пам'ять компонента](/learn/state-a-components-memory)** щоб дізнатися, як запам'ятати значення та оновлювати його під час взаємодії.

</LearnMore>

## Рендер та фіксація {/*render-and-commit*/}

Перш ніж ваші компоненти будуть відображені на екрані, вони повинні бути відрендерені React. Розуміння кроків у цьому процесі допоможе вам зрозуміти, як працює ваш код і пояснити його поведінку.

Уявіть, що ваші компоненти - це кухарі на кухні, які збирають смачні страви з інгредієнтів. У цьому сценарії React - це офіціант, який приймає замовлення від клієнтів та приносить їм їхні замовлення. Цей процес запиту та обслуговування інтерфейсу має три кроки:

1. **Запуск** рендерингу (передача замовлення клієнта на кухню)
2. **Рендеринг** компонента (приготування замовлення на кухні)
3. **Фіксація** в DOM (розміщення замовлення на столі)

<IllustrationBlock sequential>
  <Illustration caption="Запуск" alt="React як офіціант у ресторані, приймає замовлення від користувачів і доставляє їх до Компонентської Кухні." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Рендеринг" alt="Карточний Шеф надає React свіжий компонент Картки." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Фіксація" alt="React доставляє Картку користувачеві до його столу." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Прочитайте **[Рендер і фіксація](/learn/render-and-commit)** для вивчення життєвого циклу оновлення користувацького інтерфейсу.

</LearnMore>

## Стан як знімок {/*state-as-a-snapshot*/}

На відміну від звичайних змінних JavaScript, стан React працює більше як знімок. Встановлення його не змінює вже існуючу змінну стану, але спричиняє повторний рендерінг. Це може бути неочікувано на початку!

```js
console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```

Це поведінка допомагає уникнути недоліків. Ось невеличкий додаток чату. Спробуйте вгадати, що відбудеться, якщо спершу натиснути "Відправити", а потім змінити отримувача на Боба. Чию ​​назву відображатиме alert через п'ять секунд?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Аліса');
  const [message, setMessage] = useState('Привіт');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`Ви надіслали ${message} до ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
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
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Прочитайте **[Стан як знімок](/learn/state-as-a-snapshot)** щоб дізнатися, чому стан виглядає "фіксованим" і незмінним всередині обробників подій.

</LearnMore>

## Чергування серії оновлень стану {/*queueing-a-series-of-state-updates*/}

Цей компонент має помилку: клацання "+3" збільшує рахунок лише один раз.

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
      <h1>Бали: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[Стан як знімок](/learn/state-as-a-snapshot) Це відбувається через те, що встановлення стану створює запит на новий повторний рендеринг, але не змінює його у вже запущеному коді. Таким чином, `score` залишається `0` одразу після виклику `setScore(score + 1)`.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Ви можете виправити це, передаючи функцію оновлення при встановленні стану. Зауважте, як заміна `setScore(score + 1)` на `setScore(s => s + 1)` виправляє кнопку "+3". Це дозволяє вам чергувати кілька оновлень стану.

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
      <h1>Бали: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Прочитайте **[Чергування Серії Оновлень Стану](/learn/queueing-a-series-of-state-updates)** щоб дізнатися, як чергувати послідовні оновлення стану.

</LearnMore>

## Оновлення об'єктів у стані {/*updating-objects-in-state*/}

Стан може зберігати будь-який тип значень JavaScript, включаючи об'єкти. Але вам не слід змінювати об'єкти та масиви, які ви утримуєте в стані React безпосередньо. Замість цього, коли вам потрібно оновити об'єкт або масив, вам потрібно створити новий (або зробити копію існуючого), а потім оновити стан, щоб використовувати цю копію.

Зазвичай ви використовуватимете синтаксис розгортання ... для копіювання об'єктів та масивів, які ви хочете змінити. Наприклад, оновлення вкладеного об'єкта може виглядати так:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Нікі де Сент-Фаль',
    artwork: {
      title: 'Blue Nana',
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
        Город:
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
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
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

Якщо копіювання об'єктів у коді стає нудним, ви можете використовувати бібліотеку, наприклад, Immer, щоб зменшити повторюваний код:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Нікі де Сент-Фаль',
    artwork: {
      title: 'Blue Nana',
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
        Город:
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
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
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

Прочитайте **[Оновлення об'єктів у стані](/learn/updating-objects-in-state)** щоб дізнатися, як правильно оновлювати об'єкти.

</LearnMore>

## Оновлення масивів у стані {/*updating-arrays-in-state*/}

Масиви - це ще один тип змінних об'єктів JavaScript, які ви можете зберігати у стані і повинні розглядати як тільки для читання. Так само, як і з об'єктами, коли вам потрібно оновити масив, збережений у стані, вам потрібно створити новий (або зробити копію існуючого), а потім встановити стан, щоб використовувати новий масив:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
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
      <h1>Список Мистецтва</h1>
      <h2>Мій список мистецтва, який я хочу побачити:</h2>
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

Якщо копіювання масивів у коді стає нудним, ви можете використовувати бібліотеку, наприклад, [Immer](https://github.com/immerjs/use-immer), щоб зменшити повторюваний код:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
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
      <h1>Список Мистецтва</h1>
      <h2>Мій список мистецтва, який я хочу побачити:</h2>
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

Прочитайте **[Оновлення масивів у стані](/learn/updating-arrays-in-state)** щоб дізнатися, як правильно оновлювати масиви.

</LearnMore>

## Що будемо робити далі?? {/*whats-next*/}

Перейдіть за посиланням [Реагування на події](/learn/responding-to-events) to start reading this chapter page by page!

Або, якщо ви вже знайомі з цими темами, чому б не прочитати про [Управління станом](/learn/managing-state)?
