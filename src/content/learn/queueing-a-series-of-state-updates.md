---
title: Додавання до черги низки оновлень стану
---

<Intro>

Задання значення змінній стану ставить у чергу ще один рендер. Проте іноді може виникнути потреба виконати кілька операцій над значенням, перш ніж додавати до черги новий рендер. Щоб це зробити, корисно розуміти, як React групує оновлення стану.

</Intro>

<YouWillLearn>

* Що таке "групування" і як React використовує його для обробки кількох оновлень стану
* Як застосувати кілька оновлень до однієї змінної стану підряд

</YouWillLearn>

## React групує оновлення стану {/*react-batches-state-updates*/}

Можна було б очікувати, що клацання кнопки "+3" збільшить лічильник тричі, тому що воно викликає тричі `setNumber(number + 1)`:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Проте, як ви можете пригадати з минулого розділу, [значення стану в кожному рендері — зафіксовані](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time), тож значення `number` всередині обробника подій першого рендеру — завжди `0`, незалежно від того, скільки разів викликати `setNumber(1)`:

```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```

Але тут грає роль ще один чинник. **React чекає, поки не виконається *весь* код у обробниках подій, перш ніж обробляти ваші оновлення стану.** Саме тому повторний рендер відбувається *після* всіх цих викликів `setNumber()`.

Це може нагадати офіціанта, що приймає замовлення в ресторані. Він не бігає на кухню, коли названа одна страва! Замість цього він дає змогу зробити замовлення повністю, внести до нього зміни й навіть прийняти замовлення від інших людей за тим же столом.

<Illustration src="/images/docs/illustrations/i_react-batching.png"  alt="Елегантна курсорка в ресторані робить кілька замовлень у React, що грає роль офіціанта. Коли вона кілька разів викликає setState(), офіціант записує останнє з запитаного як остаточне замовлення." />

Це дає змогу оновлювати кілька змінних стану — навіть із різних компонентів — не запускаючи забагато [повторних рендерів.](/learn/render-and-commit#re-renders-when-state-updates) Але це також означає, що UI не оновиться _до_ завершення вашого обробника події та всього коду з нього. Така логіка, також відома як **групування,** значно пришвидшує ваш застосунок на React. Також це позбавляє потреби мати справу з безглуздими "напівготовими" рендерами, в яких оновилась лише частина змінних.

**React не групує докупи оновлення з *різних* свідомих дій штибу клацань**: кожне клацання обробляється окремо. Будьте певні: React групує лише тоді, коли це загалом безпечно. Завдяки цьому, наприклад, можна мати певність, що якщо перше клацання кнопкою вимикає форму, то друге клацання не пошле цю ж форму знову.

## Багаторазове оновлення одного й того ж стану до наступного рендеру {/*updating-the-same-state-multiple-times-before-the-next-render*/}

Це непоширений випадок використання, але якщо вам хочеться оновити ту саму змінну стану кілька разів до наступного рендеру, то замість передавання *значення наступного стану* виду `setNumber(number + 1)` можна передати *функцію*, яка обчислює наступний стан на основі попереднього стану в черзі, виду `setNumber(n => n + 1)`. Це спосіб сказати React "зробити щось зі значенням стану" замість простої його заміни.

Спробуйте збільшити значення лічильника тепер:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>+3</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Тут `n => n + 1` зветься **функцією-оновлювачем.** Коли ви передаєте її функції задання стану:

1. React додає цю функцію в чергу до обробки, коли решта коду в обробнику події завершилася.
2. Під час наступного рендеру React йде чергою та видає остаточний оновлений стан.

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

Ось як React проходить цими рядками коду, виконуючи обробник подій:

1. `setNumber(n => n + 1)`: `n => n + 1` — це функція. React додає її до черги.
1. `setNumber(n => n + 1)`: `n => n + 1` — це функція. React додає її до черги.
1. `setNumber(n => n + 1)`: `n => n + 1` — це функція. React додає її до черги.

Коли `useState` викликається під час наступного рендеру, React проходить чергою. Попередній стан `number` був `0`, і це саме те, що React передає до першої функції-оновлювача як аргумент `n`. Потім React бере повернене значення нашої попередньої функції-оновлювача й передає його до наступного оновлювача як `n`, і так далі:

| оновлення в черзі | `n` | повертає    |
| ----------------- | --- | ----------- |
| `n => n + 1`      | `0` | `0 + 1 = 1` |
| `n => n + 1`      | `1` | `1 + 1 = 2` |
| `n => n + 1`      | `2` | `2 + 1 = 3` |

React зберігає `3` як остаточний результат і повертає його з `useState`.

Саме тому клацання "+3" у прикладі вище коректно збільшує значення на 3.
### Що відбудеться, якщо оновити стан, спершу замінивши його {/*what-happens-if-you-update-state-after-replacing-it*/}

Як щодо цього обробника подій? Як гадаєте, яке значення матиме `number` у наступному рендері?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Збільшити число</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Ось що цей обробник подій каже зробити React:

1. `setNumber(number + 5)`: `number` дорівнює `0`, тож `setNumber(0 + 5)`. React додає до своєї черги *"замінити на `5`"*.
2. `setNumber(n => n + 1)`: `n => n + 1` — це функція-оновлювач. React додає до своєї черги *цю функцію*.

Під час наступного рендеру React проходить по черзі стану:

| оновлення в черзі | `n`                       | замінити    |
| ----------------- | ------------------------- | ----------- |
| "замінити на `5`" | `0` (не використовується) | `5`         |
| `n => n + 1`      | `5`                       | `5 + 1 = 6` |

React зберігає `6` як остаточний результат і повертає його з `useState`.

<Note>

Ви могли помітити, що `setState(5)` працює фактично як `setState(n => 5)`, але `n` не використовується!

</Note>

### Що відбудеться, якщо замінити стан, перед тим оновивши його {/*what-happens-if-you-replace-state-after-updating-it*/}

Спробуймо ще один приклад. Як гадаєте, що буде в `number` у наступному рендері?

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
```

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Збільшити число</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Ось як React обробляє ці рядки коду, виконуючи цей обробник подій:

1. `setNumber(number + 5)`: `number` дорівнює `0`, тож `setNumber(0 + 5)`. React додає *"замінити на `5`"* до своєї черги.
2. `setNumber(n => n + 1)`: `n => n + 1` — це функція-оновлювач. React додає до своєї черги *цю функцію*.
3. `setNumber(42)`: React додає *"замінити на `42`"* до своєї черги.

Під час наступного рендеру React проходить по черзі стану:

| оновлення в черзі  | `n`                       | повертає    |
| ------------------ | ------------------------- | ----------- |
| "замінити на `5`"  | `0` (не використовується) | `5`         |
| `n => n + 1`       | `5`                       | `5 + 1 = 6` |
| "замінити на `42`" | `6` (не використовується) | `42`        |

React зберігає `42` як остаточний результат і повертає його з `useState`.

Підсумовуючи, ось як можна осмислити те, що передається до функції задання стану `setNumber`:

* **Функція-оновлювач** (наприклад, `n => n + 1`) додається до черги.
* **Будь-які інші значення** (наприклад, число `5`) додають до черги "замінити на `5`", ігноруючи все, що вже в черзі.

Коли обробник подій завершується, React запускає повторний рендер. Під час нього React обробляє чергу. Функції-оновлювачі запускаються під час рендерингу, тож **функції-оновлювачі повинні бути [чистими](/learn/keeping-components-pure)** й лише *повертати* результат. Не намагайтеся задавати стан зсередини них чи запускати ще якісь побічні ефекти. У суворому режимі (strict mode) React намагається запустити кожну функцію-оновлювач двічі (відкидаючи другий результат), щоб допомогти з пошуком помилок.

### Домовленості про найменування {/*naming-conventions*/}

Прийнято називати аргумент функції-оновлювача за першими літерами відповідної змінної стану:

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```

Якщо вам подобається розлогіший код, то іншим прийнятим підходом є повторити повну назву змінної стану, як `setEnabled(enabled => !enabled)`, або скористатися префіксом, як `setEnabled(prevEnabled => !prevEnabled)`.

<Recap>

* Задання стану не змінить її змінну в наявному рендері, проте зробить запит щодо нового рендеру.
* React обробляє оновлення стану тоді, коли обробники подій уже закінчили виконання. Це зветься групуванням.
* Щоб оновити якийсь стан кілька разів у одній події, можна скористатися функцією-оновлювачем `setNumber(n => n + 1)`.

</Recap>



<Challenges>

#### Виправлення лічильника запитів {/*fix-a-request-counter*/}

Ви працюєте над застосунком мистецького торгівельного майданчика, що дає користувачам змогу розміщати кілька замовлень щодо одного предмету мистецтва водночас. Щоразу, коли користувач натискає кнопку "Придбати", лічильник "Очікування" повинен збільшитись на одиницю. За три секунди лічильник "Очікування" повинен зменшитись, а лічильник "Завершено" — збільшитись.

Проте лічильник "Очікування" не поводиться як задумано. Коли натиснути "Придбати", він зменшується до `-1` (що не повинно бути можливим!). А якщо двічі швидко клацнути, то обидва лічильники, здається, поводяться непередбачувано.

Чому так відбувається? Виправіть обидва лічильники.

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending + 1);
    await delay(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);
  }

  return (
    <>
      <h3>
        Очікування: {pending}
      </h3>
      <h3>
        Завершено: {completed}
      </h3>
      <button onClick={handleClick}>
        Придбати     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

<Solution>

Усередині обробника подій `handleClick` значення `pending` і `completed` відповідають тому, чим вони були в мить події клацання. Для першого рендеру `pending` було `0`, тож `setPending(pending - 1)` стало `setPending(-1)`, що неправильно. Оскільки ми хочемо *інкрементувати* чи *декрементувати* лічильники, а не задавати їм конкретні значення, визначені під час клацання, можна натомість передати їм функції-оновлювачі:

<Sandpack>

```js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(p => p + 1);
    await delay(3000);
    setPending(p => p - 1);
    setCompleted(c => c + 1);
  }

  return (
    <>
      <h3>
        Очікування: {pending}
      </h3>
      <h3>
        Завершено: {completed}
      </h3>
      <button onClick={handleClick}>
        Придбати     
      </button>
    </>
  );
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
```

</Sandpack>

Так можна пересвідчитись, що коли інкрементується чи декрементується лічильник, це відбувається відповідно до його *останнього* стану, а не того, яким стан був під час клацання.

</Solution>

#### Створення власної черги стану {/*implement-the-state-queue-yourself*/}

У цьому завданні ви самі відтворите крихітну частину React з нуля! Це не так важко, як здається.

Погортайте попередньо "пісочницю". Зверніть увагу на те, що у ній показані **чотири тестові випадки.** Вони відповідають прикладам, які ви бачили на цій сторінці вище. Ваше завдання — реалізувати функцію `getFinalState` так, щоб вона повертала коректний результат для кожного з цих випадків. Якщо реалізувати її коректно, то всі чотири тести пройдуть.

Ви отримаєте два аргументи: `baseState` — це початковий стан (наприклад, `0`), а `queue` — це масив, що вміщає мішанину з чисел (наприклад, `5`) і функцій-оновлювачів (наприклад, `n => n + 1`) у тому порядку, в якому вони додані.

Ваше завдання — повернути остаточний стан, як це показано в таблицях на цій сторінці!

<Hint>

Якщо відчуваєте, що застрягли, почніть з цієї структури коду:

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: застосувати функцію-оновлювач
    } else {
      // TODO: замінити стан
    }
  }

  return finalState;
}
```

Заповніть відсутні рядки!

</Hint>

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: зробити щось із чергою...

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Базовий стан: <b>{baseState}</b></p>
      <p>Черга: <b>[{queue.join(', ')}]</b></p>
      <p>Очікуваний результат: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Ваш результат: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'успіх' :
          'помилка'
        })
      </p>
    </>
  );
}
```

</Sandpack>

<Solution>

Ось точний алгоритм, описаний на цій сторінці, який React використовує для обчислення остаточного стану:

<Sandpack>

```js src/processQueue.js active
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // Застосувати функцію-оновлювача.
      finalState = update(finalState);
    } else {
      // Замінити наступний стан.
      finalState = update;
    }
  }

  return finalState;
}
```

```js src/App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}
increment.toString = () => 'n => n+1';

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42,
        ]}
        expected={42}
      />
    </>
  );
}

function TestCase({
  baseState,
  queue,
  expected
}) {
  const actual = getFinalState(baseState, queue);
  return (
    <>
      <p>Базовий стан: <b>{baseState}</b></p>
      <p>Черга: <b>[{queue.join(', ')}]</b></p>
      <p>Очікуваний результат: <b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
          'green' :
          'red'
      }}>
        Ваш результат: <b>{actual}</b>
        {' '}
        ({actual === expected ?
          'успіх' :
          'помилка'
        })
      </p>
    </>
  );
}
```

</Sandpack>

Тепер ви знаєте, як працює ця частина React!

</Solution>

</Challenges>