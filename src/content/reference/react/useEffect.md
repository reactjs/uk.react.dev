---
title: useEffect
---

<Intro>

`useEffect` це хук, який дозволяє [синхронізувати компонент із зовнішньою системою](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Короткий огляд {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Щоб оголосити Ефект, на верхньому рівні компонента викличте `useEffect`.

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[Перегляньте більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `setup` (з англ. встановлюючий): Функція з логікою вашого Ефекту. Ваша функція `setup` може додатково повертати *cleanup* функцію (з англ. cleanup - прибирання). Після того, як ваш компонент буде додано в DOM, React виконає функцію `setup`. Потім після кожного наступного рендеру React буде перевіряти чи змінилось значення хоча б однієї із залежностей, і якщо значення хоча б однієї залежності змінилось, то React спочатку виконає *cleanup*-функцію (якщо ви її надали) зі старими значеннями, а потім знову виконає `setup` функцію із новими значеннями. Після видалення компонента з DOM React виконає *cleanup*-функцію.

* **необов’язковий** `dependencies` (з англ. залежності): Список реактивних значень, від яких залежить код всередині `setup`-функції. Під реактивними значеннями мається на увазі `props`, `state`, а також усі змінні та функції, оголошені безпосередньо в тілі вашого компонента. Якщо ваш лінтер [налаштовано для React](/learn/editor-setup#linting), він буде контролювати, що ви не забули додати до списку жодне з необхідних реактивних значень. Список залежностей має містити фіксовану кількість елементів і бути поданий підряд, наприклад `[dep1, dep2, dep3]`. React порівнюватиме кожну залежність із її попереднім значенням, використовуючи порівняння [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Якщо ви не передасте масив залежностей, то ваш Effect виконуватиметься після додавання компонента в DOM та після кожного повторного рендеру компонента. І якщо передасте порожній масив, то ваш Effect виконається лише один раз після додавання компонента в DOM. [Подивитись різницю між передачею масиву залежностей, порожнього масиву та не передаванням нічого.](#examples-dependencies)


#### Результат {/*returns*/}

`useEffect` повертає `undefined`.

#### Застереження {/*caveats*/}

* `useEffect` — це Hook, тому його можна викликати **лише на верхньому рівні вашого компонента** або у власних Hook'ах. Не можна викликати його всередині циклів чи умов. Якщо вам потрібно використати його в циклах або умовах, то виділіть новий компонент, додайте `useEffect` в ньому і додавайте той компонент по циклу / за умовою.

* Якщо ви **не намагаєтеся синхронізуватися із зовнішньою системою,** [вам, ймовірно, не потрібен Effect.](/learn/you-might-not-need-an-effect)

* Коли ввімкнено Strict Mode (з англ. Strict Mode - суворий режим), React **запускатиме setup+cleanup один зайвий раз** перед першим запуском `setup` ((але тільки в режимі розробки)). Це стрес-тест, який гарантує, що ваша логіка `cleanup` «відзеркалює» логіку `setup` і зупиняє або скасовує все, що робить `setup`. Якщо Strict Mode викликає проблему, [реалізуйте cleanup-функцію.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Якщо деякі ваші залежності — це об’єкти або функції, визначені всередині компонента, є ризик, що вони **спричинятимуть повторний запуск Effect частіше, ніж потрібно.** Щоб це виправити, приберіть зайві [залежності-об’єкти](#removing-unnecessary-object-dependencies) і [залежності-функції](#removing-unnecessary-function-dependencies). Також можна [винести оновлення стану](#updating-state-based-on-previous-state-from-an-effect) і [нереактивну логіку](#reading-the-latest-props-and-state-from-an-effect) за межі вашого Effect.

* Якщо ваш Effect не був спричинений взаємодією (наприклад кліком), React зазвичай дозволяє браузеру **спочатку відмалювати оновлений екран, а потім виконати Effect.** Якщо Effect робить щось візуальне (наприклад, зображає підказку), і затримка помітна (наприклад, блимає), замініть `useEffect` на [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Якщо ваш Effect викликаний взаємодією (наприклад, кліком), **React може виконати ваш Effect до того, як браузер відмалює оновлений екран.** Це гарантує, що результат Effect буде доступний для системи обробки подій. Зазвичай це очікуваний результат. Однак, якщо потрібно відкласти виконання на після малювання (наприклад, `alert()`), можна використати `setTimeout`. Див. [reactwg/react-18/128](https://github.com/reactwg/react-18/discussions/128) щодо деталей.

* Навіть якщо ваш Effect спричинений взаємодією (наприклад, кліком), **React може дозволити браузеру перемалювати екран до обробки оновлень стану всередині Ефекту.** Зазвичай така поведінка працює добре. Але якщо потрібно заблокувати перемалювання, замініть `useEffect` на [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Ефекти **виконуються лише на клієнті.** Вони не запускаються під час серверного рендерингу.


---

## Використання {/*usage*/}

### З'єднання із зовнішньою системою {/*connecting-to-an-external-system*/}

Деякі компоненти мають залишатися підключеними до мережі, до деякого **API браузера** або до **сторонньої бібліотеки**, доки вони відображаються на сторінці. Ці системи не контролюються React, тому вони називаються **зовнішніми**.

Щоб [підключити ваш компонент до зовнішньої системи,](/learn/synchronizing-with-effects) викличте `useEffect` на верхньому рівні вашого компонента:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

Ви маєте передати два аргументи до `useEffect`:

1. *Функцію установки* з <CodeStep step={1}>кодом установки</CodeStep> що підключається до цієї системи.
   - Він має повернути *функцію очистки* з <CodeStep step={2}>кодом очистки</CodeStep> який відключається від тієї системи.
2. <CodeStep step={3}>Масив залежностей</CodeStep>, куди маєте передати всі значення від вашого компонента, які використовуються всередині тих функцій (функції установки та функції очистки).

**React викликає ваші функцію установки та та функцію очистки кожен раз, коли це необхідно, а це може ставатись багато разів:**

1. Ваш <CodeStep step={1}>код установки</CodeStep> запускається коли ваш компонента додається на сторінку *(монтується)*.
2. Після кожного ререндеру, під час якого значення якоїсь із <CodeStep step={3}>залежностей було змінено</CodeStep> :
   - Спершу ваш <CodeStep step={2}>код очистки</CodeStep> запускається з старими пропсами і станом.
   - Тоді, ваш <CodeStep step={1}>код установки</CodeStep> запускається з новими пропсами та станом.
3. Ваш <CodeStep step={2}>код очистки</CodeStep> виконується ще один, останній раз, коли ваш компонент видаляється з сторінки.

**Давайте опишемо цю чергу використовуючи приклад вище**  

Коли компонент `ChatRoom` додається на сторінку, він підключається до чату використовуючи первинні значення `serverUrl` та `roomId`. Якщо хоча б одне із цих значень, будь то `serverUrl` чи `roomId` мінється в результаті ререндеру (наприклад якщо користувач обрав інший чат з випадаючого списку), наш Ефект *відключиться від попереднього чату, і підключиться до наступного чату.* Після того, як компонент `ChatRoom` буде демонтовано з сторінки, наш Ефект відключиться від чату останній раз.

**Щоб [допомогти знайти баги,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) в Strict Mode (з англ. суворий режим) в режимі розробки React умисно зайвий раз запускає <CodeStep step={1}>функцію установки</CodeStep> та <CodeStep step={2}>функцію очистки</CodeStep> перед тим як запустити <CodeStep step={1}>функцію установки</CodeStep>.** Цей стрес-тест допомагає вам або переконатись, що логіка вашого Ефекту реалізована правильно, або ж помітити баг ще на етапі розробки (якщо із-за цього "надлишкового" запуску функції установки та функції очистки ваш компонент працює не так, як він мав би). Функція очистки мусить зупиняти або відміняти все, що запустила функція установки. Показник того, що код працює правильно - код має працювати однаково добре незалежно від того чи було запущено *функцію установки* один раз, чи було запущено *функцію установки*, потім *функцію очистки* і знову *функцію установки*. [Дивитись поширені рішення.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**Намагайтесь [писати кожен Ефект як окремий процес](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) і [мисліть про один цикл установки/очистки за раз.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** Не важливо чи ваш компонент монтується, чи оновлюється, чи демонтовується. Якщо ваша логіка очистки правильно "віддзеркалює" логіку установки, тоді ваш компонент працюватиме правильно незалежно від того, скільки разів викликано функції установки та очистки.

<Note>

**Ефект** дозволяє **синхронізувати ваш компонент** із деякою **зовнішньою системою** (наприклад, службою чату). Тут *зовнішня система* означає будь-яку частину коду, яка не контролюється з React, як-от:

* Таймер, керований за допомогою <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> і <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* Підписка на подію з використанням <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> і <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Стороння бібліотека анімації з API на кшталт <CodeStep step={1}>`animation.start()`</CodeStep> і <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Якщо ви не підключаєтеся до жодної зовнішньої системи, [вам, ймовірно, не потрібен Ефект.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Приклади підключення до зовнішньої системи" titleId="examples-connecting">

#### Підключення до чат-сервера {/*connecting-to-a-chat-server*/}

У цьому прикладі компонент **ChatRoom** використовує **Effect** для підтримки з’єднання із зовнішньою системою, визначеною у файлі `chat.js`. Натисніть **"Open chat"** (Відкрити чат), щоб компонент **ChatRoom** з’явився. Цей застосунок (sandbox) працює в режимі розробки, тому відбувається додатковий цикл підключення та відключення, як [пояснено тут.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Спробуйте змінити значення `roomId` та `serverUrl` за допомогою випадаючого списку та поля введення і подивіться, як **Effect** повторно підключається до чату. Натисніть **"Close chat"** (Закрити чат), щоб побачити, як **Effect** відключається востаннє.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        URL сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Ласкаво просимо до чату {roomId} !</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('загальне');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Оберіть чат:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="загальне">загальне</option>
          <option value="подорожі">подорожі</option>
          <option value="подорожі">музика</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Закрити чат' : 'Відкрити чат'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Підключаємось до чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Відключаємось від чату"' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Відстежування глобальної події браузера {/*listening-to-a-global-browser-event*/}

У цьому прикладі зовнішньою системою є сам **DOM браузера**. Зазвичай ви вказуєте слухачі подій за допомогою **JSX**, але таким чином ви **не можете прослуховувати** глобальний об’єкт [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window). Ефект дозволяє вам підключитися до об’єкта `window` і прослуховувати його події. Прослуховування події `pointermove` дозволяє відстежувати позицію курсора (або пальця) та оновлювати червону точку, щоб вона рухалася разом з ним.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Запуск анімацій {/*triggering-an-animation*/}

У цьому прикладі зовнішньою системою є **бібліотека з анімаціями** в `animation.js`. Вона надає JavaScript-клас під назвою `FadeInAnimation`, який приймає **DOM-вузол** як аргумент та відкриває методи `start()` та `stop()` для керування анімацією. Цей компонент [використовує реф](/learn/manipulating-the-dom-with-refs), щоб отримати доступ до базового DOM-вузла. Ефект зчитує DOM-вузол з рефу та **автоматично запускає анімацію** для цього вузла, коли компонент з'являється.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Здоровенькі були!
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Сховати' : 'Показати'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Переходить в кінець одразу ж
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Починає анімування
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // В нас все ще багато кадрів для відображення
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution />

#### Керування модальним діалоговим вікном {/*controlling-a-modal-dialog*/}

У цьому прикладі **зовнішньою системою** є **DOM** браузера. Компонент `ModalDialog` відображає елемент [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Він використовує **Ефект** для синхронізації пропу `isOpen` із викликами методів [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) та [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Дізнатись корисний факт
      </button>
      <ModalDialog isOpen={show}>
        Ринок React вакансій перегрітий. Краще учити Angular.
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Дякую, кеп!</button>
      </ModalDialog>
    </>
  );
}
```

```js src/ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Відстеження видимості елемента {/*tracking-element-visibility*/}

У цьому прикладі зовнішньою системою знову є **DOM браузера**. Компонент `App` відображає довгий список, потім компонент `Box`, а потім ще один довгий список. Прокрутіть список униз. Зверніть увагу, що коли весь компонент `Box` повністю **видимий у вікні перегляду** (**viewport**), колір фону змінюється на чорний. Щоб реалізувати це, компонент `Box` використовує Ефект для керування [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). Цей **API браузера** повідомляє вам, коли елемент DOM стає видимим у вікні перегляду.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Елемент №{i} (продовжуй скролити)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Обгортання Ефектів у користувацькі хуки {/*wrapping-effects-in-custom-hooks*/}

Ефекти є ["рятівним виходом":](/learn/escape-hatches) використовуйте їх, коли вам потрібно "вийти за межі React" і коли для вашого випадку використання немає кращого вбудованого рішення. Якщо ви помічаєте, що вам часто доводиться вручну писати Ефекти, це зазвичай є ознакою того, що вам потрібно виділити деякі **користувацькі хуки** [/learn/reusing-logic-with-custom-hooks] для поширених дій, на які покладаються ваші компоненти.

Наприклад, цей власний хук `useChatRoom` "загортає" логіку вашого Ефекту за більш декларативним API:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```
Після цього ви можете бачити це з будь-якого компонента:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

В екосистемі React також доступно багато чудових **користувацьких Хуків** для будь-якої мети.

[Дізнайтися більше про обгортання Ефектів у користувацькі Хуки.](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Приклади обгортання Ефектів у користувацькі Хуки" titleId="examples-custom-hooks">

#### Користувацький Хук `useChatRoom` {/*custom-usechatroom-hook*/}

Цей приклад ідентичний одному з [попередніх прикладів,](#examples-connecting) але логіка винесена в користувацький Хук.

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        URL сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Ласкаво просимо до чату {roomId} !</h1>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('загальне');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Оберіть чат:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="загальне">загальне</option>
          <option value="подорожі">подорожі</option>
          <option value="музика">музика</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Закрити чат' : 'Відкрити чат'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Підключаємось до чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Відключаємось від чату"' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution />

#### Користувацький Хук `useWindowListener` {/*custom-usewindowlistener-hook*/}

Цей приклад ідентичний до одного з [попередніх прикладів,](#examples-connecting) але логіка винесена до окремого Хука.

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity: 0.6,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Користувацький Хук `useIntersectionObserver` {/*custom-useintersectionobserver-hook*/}

Цей приклад ідентичний до одного з [попередніх прикладів,](#examples-connecting) але логіка винесена до окремого Хука.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Елемент № {i} (продовжуй скролити)</li>);
  }
  return <ul>{items}</ul>
}
```

```js src/Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js src/useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Керування не-React віджетом {/*controlling-a-non-react-widget*/}

Іноді ви хочете, щоб **зовнішня система** була синхронізована з деяким пропом чи станом вашого компонента.

Наприклад, якщо у вас є сторонній віджет карти або компонент відеопрогравача, написаний без React, ви можете використати **Ефект**, щоб викликати його методи, які змусять його стан відповідати поточному стану вашого React-компонента. Цей Ефект створює екземпляр класу `MapWidget`, визначеного у `map-widget.js`. Коли ви змінюєте проп `zoomLevel` компонента `Map`, Ефект викликає `setZoom()` на екземплярі класу, щоб той був завжди синхронізованим:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Масштаб мапи: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js src/Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

У цьому прикладі функція очистки не потрібна, оскільки клас `MapWidget` керує лише DOM-вузлом, який був йому переданий. Після того, як реактівський компонента `Map` буде видалено з документа, то обидва, і DOM-вузол, і екземпляр класу `MapWidget` будуть автоматично прибрані **збирачем сміття** (garbage-collector) браузерного рушія JavaScript.

---

### Отримання даних за допомогою Ефектів {/*fetching-data-with-effects*/}

Ви можете використовувати **Ефект** (Effect) для отримання даних для вашого компонента. Зауважте, що [якщо ви використовуєте фреймворк](/learn/start-a-new-react-project#full-stack-frameworks), використання механізму отримання даних вашого фреймворку буде набагато **ефективнішим**, ніж написання Ефектів вручну.

Якщо ви хочете отримати дані з Ефекту вручну, ваш код може виглядати так:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Руслан');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Зверніть увагу на змінну `ignore`, яка спершу має значення `false` і потім змінюється на `true` під час очищення. Це гарантує, що [ваш код не постраждає від "станів гонки" (race conditions):](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) мережеві відповіді можуть надходити в іншому порядку, ніж ви їх відправили.

<Sandpack>

{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [9]}} src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Руслан');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Руслан">Руслан</option>
        <option value="Борис">Борис</option>
        <option value="Барбарис">Барбарис</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Завантажуємо...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Борис' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Це біографія ' + person + 'а.');
    }, delay);
  })
}
```

</Sandpack>

Ви також можете переписати це, використовуючи синтаксис [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), але всеодно потрібно надати функцію очищення:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Руслан');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Руслан">Руслан</option>
        <option value="Борис">Борис</option>
        <option value="Барбарис">Барбарис</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Завантажуємо...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Борис' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Це біографія ' + person + 'а.');
    }, delay);
  })
}
```

</Sandpack>

Написання логіки отримання даних безпосередньо в Ефектах призводить до повторюваного коду та ускладнює додавання оптимізацій, як-от кешування та рендеринг на стороні сервера, згодом. [Простіше використовувати якийсь із користувацьких хуків (**Custom Hook**) – або свій власний, або той, що підтримується спільнотою.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Які є хороші альтернативи отриманню даних в Ефектах? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Написання викликів `fetch` всередині **Ефектів** — це [популярний спосіб отримання даних](https://www.robinwieruch.de/react-hooks-fetch-data/), особливо в додатках, які повністю працюють на стороні клієнта. Однак, це дуже ручний підхід, який має суттєві недоліки:

- **Ефекти не запускаються на сервері.** Це означає, що початковий HTML, відрендерений сервером, буде містити лише стан завантаження, але без даних. Клієнтський комп'ютер повинен буде завантажити весь JavaScript і відрендерити ваш додаток, лише щоб виявити, що тепер йому потрібно завантажити дані. Це не дуже ефективно.
- **Отримання даних безпосередньо в Ефектах полегшує створення "мережевих водоспадів" (network waterfalls).** Ви рендерите батьківський компонент, він отримує деякі дані, рендерить дочірні компоненти, а потім вони починають отримувати *свої* дані. Якщо мережа не дуже швидка, це значно повільніше, ніж отримання всіх даних паралельно.
- **Отримання даних безпосередньо в Ефектах зазвичай означає, що ви не завантажуєте попередньо і не кешуєте дані.** Наприклад, якщо компонент демонтується, а потім монтується знову, йому доведеться знову отримувати дані.
- **Це не дуже ергономічно.** Щоб написати виклики fetch так, щоб уникнути багів (наприклад таких, як [стани гонки (race conditions).](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)) - треба писати дуже багато шаблонного коду. 

Цей список недоліків не є специфічним для React. Він стосується отримання даних при монтуванні з будь-якою бібліотекою. Як і з маршрутизацією, отримання даних не є тривіальним завданням для якісної реалізації, тому ми рекомендуємо наступні підходи:

- **Якщо ви використовуєте [фреймворк](/learn/start-a-new-react-project#full-stack-frameworks), використовуйте його вбудований механізм отримання даних.** Сучасні фреймворки React мають інтегровані механізми отримання даних, які є ефективними і не страждають від вищезгаданих недоліків.
- **В іншому випадку, розгляньте можливість використання або створення клієнтського кешу.** Популярні рішення з відкритим вихідним кодом включають [React Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/) та [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Ви також можете створити власне рішення, і в такому випадку використовувати **Ефекти** "під капотом", але також додати логіку для дедуплікації запитів, кешування відповідей та уникнення мережевих водоспадів (шляхом попереднього завантаження даних або піднесення вимог до даних до маршрутів).

Ви можете й далі отримувати дані безпосередньо в **Ефектах**, якщо жоден з цих підходів вам не підходить.

</DeepDive>

---

### Зазначення реактивних залежностей {/*specifying-reactive-dependencies*/}

**Зверніть увагу, що ви не можете "вибирати" залежності вашого Ефекту.** Кожне <CodeStep step={2}>реактивне значення</CodeStep>, яке використовується кодом вашого Ефекту, має бути оголошено як залежність. Список залежностей вашого Ефекту визначається кодом, який оточує Ефект:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // Це реактивне значення
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // Це також реактивне значення

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Цей Ефект читає ці реактивні значення
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ Тож ви повинні вказати їх як залежності вашого Ефекту
  // ...
}
```

Якщо `serverUrl` або `roomId` зміняться, ваш Ефект повторно підключиться до чату, використовуючи нові значення.

**[Реактивними значеннями](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) є як пропси (props), так і всі змінні й функції, оголошені безпосередньо всередині вашого компонента.** Оскільки `roomId` та `serverUrl` є реактивними значеннями, ви не можете видалити їх із залежностей. Якщо ви спробуєте їх проігнорувати і [ваш лінтер правильно налаштований для React,](/learn/editor-setup#linting) лінтер позначить це як помилку, яку вам потрібно виправити:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect має пропущені залежності: 'roomId' і 'serverUrl'
  // ...
}
```

**Щоб видалити залежність, вам потрібно ["довести" лінтеру, що вона *не має* бути залежністю.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** Наприклад, ви можете винести `serverUrl` за межі вашого компонента, щоб довести, що це не реактивне значення і не зміниться при повторних рендерах:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Більше не реактивне значення

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Всі залежності оголошено
  // ...
}
```

Тепер, коли `serverUrl` більше не є реактивним значенням (і не може змінитися при повторному рендері), його можна не передавати в список залежностей. **Якщо код вашого Ефекту не використовує жодних реактивних значень, його список залежностей має бути порожнім (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Більше не реактивне значення
const roomId = 'music'; // Більше не реактивне значення

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Всі залежності оголошено
  // ...
}
```

[Ефект з порожніми залежностями](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) не запускається повторно, навіть якщо змінюється якийсь з пропсів або змінних стану вашого компонента.

<Pitfall>

Якщо у вас є існуюча кодова база, у вас можуть бути деякі Ефекти, які ігнорують лінтер наступним чином:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Уникайте ігнорування лінтера таким чином:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Коли залежності не відповідають коду, існує високий ризик появи помилок.** Ігноруючи лінтер, ви "брешете" React про значення, від яких залежить ваш Ефект. [Замість цього, доведіть, що вони непотрібні.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Приклади передачі реактивних залежностей" titleId="examples-dependencies">

#### Передача масиву залежностей {/*passing-a-dependency-array*/}

Якщо ви вказуєте залежності, ваш Ефект запускається **після початкового рендера _і_ після повторних рендерів зі зміненими залежностями.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Запускається знову, якщо a або b відрізняються
```

У наведеному нижче прикладі `serverUrl` і `roomId` є [реактивними значеннями,](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) тому обидва повинні бути вказані як залежності. В результаті, вибір іншої кімнати у спадному списку або редагування вводу URL-адреси сервера призводить до повторного підключення чату. Однак, оскільки `message` не використовується в Ефекті (і, отже, не є залежністю), редагування повідомлення не призводить до повторного підключення до чату.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        URL-адреса сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Ласкаво просимо до чату {roomId}!</h1>
      <label>
        Ваше повідомлення:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('загальне');
  return (
    <>
      <label>
        Оберіть кімнату чату:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="загальне">загальне</option>
          <option value="подорожі">подорожі</option>
          <option value="музика">музика</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Закрити чат' : 'Відкрити чат'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Реальна реалізація фактично підключалася б до сервера
  return {
    connect() {
      console.log('✅ Підключаємось до чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Відключаємось від чату "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Передача порожнього масиву залежностей {/*passing-an-empty-dependency-array*/}

Якщо ваш Ефект справді не використовує жодних реактивних значень, він запуститься лише **після початкового рендера.**

```js {3}
useEffect(() => {
  // ...
}, []); // Не запускається знову (крім одного разу в розробці)
```

**Навіть якщо залежності порожні, в режимі розробки функція установки та функція очистки [запустяться один додатковий раз](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development), щоб допомогти вам виявити помилки.**


У цьому прикладі, як `serverUrl`, так і `roomId` вказані вручну. Оскільки вони оголошені поза компонентом, вони не є реактивними значеннями і, отже, не є залежностями. Список залежностей порожній, тому Ефект не запускається повторно при повторних рендерах.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Ласкаво просимо до чату {roomId}!</h1>
      <label>
        Ваше повідомлення:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Закрити чат' : 'Відкрити чат'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Реальна реалізація фактично підключалася б до сервера
  return {
    connect() {
      console.log('✅ Підключаємось до чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Відключаємось від чату "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

</Sandpack>

<Solution />


#### Передача відсутнього масиву залежностей {/*passing-no-dependency-array-at-all*/}

Якщо ви взагалі не передаєте масив залежностей, ваш Ефект запускається **після кожного рендера (і повторного рендера)** вашого компонента.

```js {3}
useEffect(() => {
  // ...
}); // Завжди запускається знову
```

У цьому прикладі Ефект запускається повторно, коли ви змінюєте `serverUrl` та `roomId`, що є логічним. Однак він *також* запускається повторно, коли ви змінюєте `message`, що, ймовірно, небажано. Ось чому зазвичай краще вказувати масив залежностей.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // Взагалі немає масиву залежностей

  return (
    <>
      <label>
        URL-адреса сервера:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Ласкаво просимо до чату {roomId}!</h1>
      <label>
        Ваше повідомлення:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  const [roomId, setRoomId] = useState('загальне');
  return (
    <>
      <label>
        Оберіть кімнату чату:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="загальне">загальне</option>
          <option value="подорожі">подорожі</option>
          <option value="музика">музика</option>
        </select>
        <button onClick={() => setShow(!show)}>
          {show ? 'Закрити чат' : 'Відкрити чат'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Реальна реалізація фактично підключалася б до сервера
  return {
    connect() {
      console.log('✅ Підключаємось до чату "' + roomId + '" на ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Відключаємось від чату "' + roomId + '" на ' + serverUrl);
    }
  };
}
```

```css
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Оновлення стану на основі попереднього стану з Ефекту {/*updating-state-based-on-previous-state-from-an-effect*/}

Коли ви хочете оновити стан на основі попереднього стану з Ефекту, ви можете зіткнутися з проблемою:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // Ви хочете збільшувати лічильник щосекунди...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... але вказування `count` як залежності завжди скидає інтервал.
  // ...
}
```

Оскільки `count` є реактивним значенням, воно має бути вказано у списку залежностей. Однак це призводить до того, що Ефект очищується і знову налаштовується щоразу, коли змінюється `count`. Це не ідеально. 

Щоб виправити це, [передайте функцію оновлення стану `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state) до `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Передайте функцію оновлення стану
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Тепер count не є залежністю

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Тепер, коли ви передаєте `c => c + 1` замість `count + 1`, [вашому Ефекту більше не потрібно залежати від `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Внаслідок цього виправлення, йому не доведеться очищати та налаштовувати інтервал знову щоразу, коли змінюється `count`.

---


### Видалення непотрібних залежностей-об'єктів {/*removing-unnecessary-object-dependencies*/}

Якщо ваш Ефект залежить від об'єкта або функції, створеної під час рендерингу, він може запускатися занадто часто. Наприклад, цей Ефект повторно підключається після кожного рендера, оскільки об'єкт `options` [є новим об'єктом під час кожного кожного рендера:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 Цей об'єкт створюється з нуля при кожному повторному рендері
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // Він використовується всередині Ефекту
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 В результаті, ці залежності завжди відрізняються при повторному рендері
  // ...
```

Уникайте використання об'єкта, створеного під час рендерингу, як залежності. Замість цього, створіть об'єкт всередині Ефекту:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Ласкаво просимо до кімнати {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('загальне');
  return (
    <>
      <label>
        Оберіть кімнату:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="загальне">загальне</option>
          <option value="подорожі">подорожі</option>
          <option value="музика">музика</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Реальна реалізація фактично підключалася б до сервера
  return {
    connect() {
      console.log('✅ Підключення до кімнати "' + roomId + '" за адресою ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Відключено від кімнати "' + roomId + '" за адресою ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Тепер, коли ви створюєте об'єкт `options` всередині Ефекту, сам Ефект залежить лише від рядка `roomId`.

Завдяки цьому виправленню, введення тексту у поле вводу не призводить до повторного підключення чату. На відміну від об'єкта, який перестворюється, рядок, як наприклад `roomId`, не змінюється (звісно ж якщо ви не зміните його значення). [Дізнайтеся більше про видалення залежностей.](/learn/removing-effect-dependencies)

---

### Видалення непотрібних залежностей-функцій {/*removing-unnecessary-function-dependencies*/}

Якщо ваш Ефект залежить від об'єкта або функції, створеної під час рендерингу, він може запускатися занадто часто. Наприклад, цей Ефект повторно підключається після кожного рендера, оскільки функція `createOptions` [відрізняється для кожного рендера:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 Ця функція створюється з нуля при кожному повторному рендері
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // Вона використовується всередині Ефекту
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 В результаті, ці залежності завжди відрізняються при повторному рендері
  // ...
```

Саме по собі створення функції з нуля при кожному повторному рендері не є проблемою. Вам не потрібно це оптимізувати. Однак, якщо ви використовуєте її як залежність свого Ефекту, це призведе до повторного запуску Ефекту після кожного повторного рендера.

Уникайте використання функції, створеної під час рендерингу, як залежності. Замість цього, оголосіть її всередині Ефекту:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Ласкаво просимо до чату {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('загальне');
  return (
    <>
      <label>
        Оберіть кімнату чату:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="загальне">загальне</option>
          <option value="подорожі">подорожі</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Реальна реалізація фактично підключалася б до сервера
  return {
    connect() {
      console.log('✅ Підключення до кімнати "' + roomId + '" за адресою ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Відключено від кімнати "' + roomId + '" за адресою ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Тепер, коли ви визначаєте функцію `createOptions` всередині Ефекту, сам Ефект залежить лише від рядка `roomId`. Завдяки цьому виправленню, введення тексту у поле вводу не призводить до повторного підключення чату. На відміну від функції, яка перестворюється, рядок, як `roomId`, не змінюється, якщо ви не присвоїте йому інше значення. [Дізнайтися більше про видалення залежностей.](/learn/removing-effect-dependencies)

---

### Зчитування найновіших пропсів та стану з Ефекту {/*reading-the-latest-props-and-state-from-an-effect*/}

За замовчуванням, коли ви зчитуєте реактивне значення з Ефекту, ви повинні додати його як залежність. Це гарантує, що ваш Ефект "реагує" на кожну зміну цього значення. Для більшості залежностей це саме та поведінка, яку ви хочете.

**Однак, іноді ви захочете зчитувати *найновіші* пропси та стан з Ефекту, не "реагуючи" на них.** Наприклад, уявіть, що ви хочете реєструвати кількість товарів у кошику для кожного відвідування сторінки:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ Всі залежності оголошено
  // ...
}
```

**Що робити, якщо ви хочете реєструвати нове відвідування сторінки після кожної зміни `url`, але *не* якщо змінюється лише `shoppingCart`?** Ви не можете виключити `shoppingCart` із залежностей, не порушивши [правил реактивності].(#specifying-reactive-dependencies) Однак ви можете вказати, що *не хочете*, щоб частина коду "реагувала" на зміни, навіть якщо вона викликається зсередини Ефекту. [Оголосіть *Подію Ефекту*](/learn/separating-events-from-effects#declaring-an-effect-event) за допомогою Хука [`useEffectEvent`](/reference/react/useEffectEvent) і перемістіть код, що зчитує `shoppingCart`, всередину неї:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Всі залежності оголошено
  // ...
}
```

**Події Ефекту не є реактивними і завжди повинні бути виключені із залежностей вашого Ефекту.** Саме це дозволяє вам розміщувати всередині них нереактивний код (де ви можете зчитувати найновіше значення деяких пропсів та стану). Зчитуючи `shoppingCart` всередині `onVisit`, ви гарантуєте, що `shoppingCart` не перезапустить ваш Ефект.

[Дізнайтеся більше про те, як Події Ефекту дозволяють розділити реактивний і нереактивний код.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Відображення різного вмісту на сервері та клієнті {/*displaying-different-content-on-the-server-and-the-client*/}

Якщо ваш додаток використовує рендеринг на стороні сервера (або [напряму](/reference/react-dom/server), або через [фреймворк](/learn/start-a-new-react-project#full-stack-frameworks)), ваш компонент буде рендеритися у двох різних середовищах. На сервері він буде рендеритися для створення початкового HTML. На клієнті React знову запустить код рендерингу, щоб він міг приєднати ваші обробники подій до цього HTML. Саме тому, щоб [гідратація](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) працювала, ваш початковий вивід рендерингу має бути ідентичним на клієнті та сервері.

У рідкісних випадках вам може знадобитися відображати різний вміст на клієнті. Наприклад, якщо ваш додаток зчитує деякі дані з [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), він не може цього зробити на сервері. Ось як це можна реалізувати:


{/* TODO(@poteto) - investigate potential false positives in react compiler validation */}
```js {expectedErrors: {'react-compiler': [5]}}
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... повернути JSX, лише для клієнта ...
  }  else {
    // ... повернути початковий JSX ...
  }
}
```

Поки додаток завантажується, користувач побачить початковий вивід рендерингу. Потім, коли він завантажиться та гідратується, ваш Ефект запуститься та змінить значення `didMount` на `true`, викликаючи повторний рендер. Це переключить на вивід рендерингу, який був обчислений лише на клієнті. Ефекти не запускаються на сервері, тому `didMount` був `false` під час початкового рендерингу на сервері.

Використовуйте цей шаблон рідко. Майте на увазі, що користувачі з повільним з'єднанням бачитимуть початковий вміст протягом досить тривалого часу – потенційно, багато секунд – тому ви не хочете робити різких змін у зовнішньому вигляді вашого компонента. У багатьох випадках ви можете уникнути необхідності цього з допомогою CSS, показуючи різні речі за різних умов.

---

## Вирішення проблем {/*troubleshooting*/}

### Мій Ефект запускається двічі, коли компонент монтується {/*my-effect-runs-twice-when-the-component-mounts*/}

Коли ввімкнено Суворий режим, у розробці React запускає функції установки та очистки один додатковий раз перед головним запуском функції установки.

Це стрес-тест, який перевіряє, чи правильно реалізована логіка вашого Ефекту. Якщо це викликає видимі проблеми, ваша функція очищення не має деякої логіки. Функція очищення повинна зупиняти або скасовувати те, що робила функція установки. Основне правило полягає в тому, що користувач не повинен мати змоги відрізнити, чи викликається функція установки один раз (як у продакшені), чи в послідовності установка → очищення → установка (як у розробці).

Дізнайтеся більше про те, [як це допомагає знайти помилки](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) та [як виправити вашу логіку.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Мій Ефект запускається після кожного повторного рендера {/*my-effect-runs-after-every-re-render*/}

Спочатку перевірте, чи ви не забули вказати масив залежностей:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 Немає масиву залежностей: повторно запускається після кожного рендера!
```

Якщо ви вказали масив залежностей, але ваш Ефект все одно повторно запускається в циклі, це тому, що одна з ваших залежностей відрізняється при кожному повторному рендері.

Ви можете відлагодити цю проблему, вручну відобразивши ваші залежності в консолі:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Потім ви можете клацнути правою кнопкою миші на масивах з різних повторних рендерів у консолі та вибрати "Store as a global variable" (Зберегти як глобальну змінну) для обох із них. Припускаючи, що перший був збережений як `temp1`, а другий як `temp2`, ви можете використовувати консоль браузера, щоб перевірити, чи кожна залежність в обох масивах однакова:

```js
Object.is(temp1[0], temp2[0]); // Чи перша залежність однакова між масивами?
Object.is(temp1[1], temp2[1]); // Чи друга залежність однакова між масивами?
Object.is(temp1[2], temp2[2]); // ... і так далі для кожної залежності ...
```

Коли ви знайдете залежність, яка відрізняється при кожному повторному рендері, ви зазвичай можете виправити її одним із цих способів:

- [Оновлення стану на основі попереднього стану з Ефекту](#updating-state-based-on-previous-state-from-an-effect)
- [Видалення непотрібних залежностей-об'єктів](#removing-unnecessary-object-dependencies)
- [Видалення непотрібних залежностей-функцій](#removing-unnecessary-function-dependencies)
- [Зчитування найновіших пропсів та стану з Ефекту](#reading-the-latest-props-and-state-from-an-effect)

Як крайній захід (якщо ці методи не допомогли), оберніть її створення за допомогою [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) або [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (для функцій).

---

### Мій Ефект продовжує повторно запускатися у нескінченному циклі {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Якщо ваш Ефект запускається у нескінченному циклі, значить відбуваються дві речі:

- Ваш Ефект оновлює якийсь стан.
- Цей стан призводить до повторного рендера, що спричиняє зміну залежностей Ефекту.

Перш ніж почати виправляти проблему, запитайте себе, чи ваш Ефект підключається до якоїсь зовнішньої системи (наприклад, DOM, мережа, сторонній віджет тощо). Навіщо вашому Ефекту потрібно встановлювати стан? Він синхронізується з цією зовнішньою системою? Чи ви намагаєтеся керувати потоком даних вашого додатка за допомогою нього?

Якщо зовнішньої системи немає, подумайте, чи не спростило б вашу логіку [повне видалення Ефекту](/learn/you-might-not-need-an-effect).

Якщо ви дійсно синхронізуєтеся з якоюсь зовнішньою системою, подумайте, чому і за яких умов ваш Ефект повинен оновлювати стан. Чи змінилося щось, що впливає на візуальний вивід вашого компонента? Якщо вам потрібно відстежувати деякі дані, які не використовуються для рендерингу, більш доречним може бути [реф](/reference/react/useRef#referencing-a-value-with-a-ref) (який не викликає повторних рендерів). Переконайтеся, що ваш Ефект не оновлює стан (і не викликає повторні рендери) більше, ніж потрібно.

В кінці-кінців, якщо ваш Ефект оновлює стан коли слід, але все ще існує цикл, то це тому, що це оновлення стану призводить до зміни однієї з залежностей Ефекту. [Дізнайтеся, як відлагодити зміни залежностей.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### Моя логіка очищення запускається, хоча мій компонент не розмонтовувався {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

Функція очистки запускається не лише під час розмонтування, але й перед кожним повторним рендером зі зміненими залежностями. Крім того, у розробці React [запускає установки + очищення один додатковий раз одразу після монтування компонента.](#my-effect-runs-twice-when-the-component-mounts)

Якщо у вас є код очищення без відповідного коду установки, це зазвичай є ознакою поганого коду:

```js {2-5}
useEffect(() => {
  // 🔴 Уникайте: Логіка очищення без відповідної логіки установки
  return () => {
    doSomething();
  };
}, []);
```

Ваша логіка очищення має бути "симетричною" до логіки установки та має зупиняти або скасовувати те, що робило налаштування:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Дізнайтися, чим життєвий цикл Ефекту відрізняється від життєвого циклу компонента.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### Мій Ефект робить щось візуальне, і я бачу мерехтіння перед його запуском {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Якщо ваш Ефект повинен блокувати [відображення браузером екрана,](/learn/render-and-commit#epilogue-browser-paint) замініть `useEffect` на [`useLayoutEffect`](/reference/react/useLayoutEffect). Зауважте, що **це не повинно бути потрібним для переважної більшості Ефектів.** Вам це знадобиться лише в тому випадку, якщо критично важливо запустити ваш Ефект до відображення браузером: наприклад, для вимірювання та позиціонування підказки, перш ніж користувач її побачить.