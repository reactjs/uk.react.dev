---
title: Стан як зняток
---

<Intro>

Змінні стану можуть нагадувати звичайні змінні JavaScript, які можна зчитати та змінити. Проте стан поводиться радше як зняток. Задання йому значення не змінює наявну змінну стану, а натомість запускає повторний рендер.

</Intro>

<YouWillLearn>

* Як задання стану запускає повторні рендери
* Коли та як оновлюється стан
* Чому стан не оновлюється відразу після задання значення
* Як обробники подій звертаються до "знятку" стану

</YouWillLearn>

## Задання стану запускає рендери {/*setting-state-triggers-renders*/}

Можна уявляти, що користувацький інтерфейс змінюється безпосередньо внаслідок дії користувача, наприклад, клацання. В React же це працює трохи інакше, ніж передбачає ця ментальна модель. На попередній сторінці ви побачили, що [задання стану просить React про повторний рендер](/learn/render-and-commit#step-1-trigger-a-render). Це означає, що щоб інтерфейс зреагував на подію, необхідно *оновити стан*.

У цьому прикладі, якщо натиснути "надіслати", то `setIsSent(true)` каже React виконати повторний рендер UI:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Привіт!');
  if (isSent) {
    return <h1>Ваше повідомлення — в дорозі!</h1>
  }
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message);
    }}>
      <textarea
        placeholder="Повідомлення"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Надіслати</button>
    </form>
  );
}

function sendMessage(message) {
  // ...
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Ось що відбувається, коли ви клацаєте кнопку:

1. Виконується обробник події `onSubmit`.
2. `setIsSent(true)` задає `isSent` значення `true`, і таким чином додає в чергу новий рендер.
3. React виконує повторний рендер компонента, згідно з новим значенням `isSent`.

Погляньмо уважніше на взаємозв'язок між станом і рендерингом.

## Рендеринг бере один зняток за раз {/*rendering-takes-a-snapshot-in-time*/}

["Рендеринг"](/learn/render-and-commit#step-2-react-renders-your-components) означає, що React викликає ваш компонент, який є функцією. JSX, який ви повертаєте з цієї функції, — це як зняток UI в певну мить часу. Його пропси, обробники подій і локальні змінні обчислюються **з використанням його стану в мить рендеру.**

На відміну від світлини чи кадру кінострічки, "зняток" UI, який ви повертаєте, є інтерактивним. Він вміщає логіку штибу обробників подій, які задають, що відбувається внаслідок введення з боку користувача. React оновлює екран до відповідності цьому знятку, й приєднує обробники подій. Як наслідок, натискання кнопки запускає обробник клацання, заданий у вашому JSX.

Коли React виконує повторний рендер компонента, відбувається наступне:

1. React знову викликає вашу функцію.
2. Ваша функція повертає новий зняток JSX.
3. React потім оновлює екран до відповідності знятку, поверненого вашою функцією.

<IllustrationBlock sequential>
    <Illustration caption="React виконує функцію" src="/images/docs/illustrations/i_render1.png" />
    <Illustration caption="Обчислюється зняток" src="/images/docs/illustrations/i_render2.png" />
    <Illustration caption="Оновлюється дерево DOM" src="/images/docs/illustrations/i_render3.png" />
</IllustrationBlock>

Стан, пам'ять компонента, не схожий на звичайну змінну, що зникає, коли відбувається повернення з функції. Стан фактично "живе" в самому React — неначе на поличці! — поза вашою функцією. Коли React викликає ваш компонент, він надає вам зняток стану для конкретного поточного рендеру. Ваш компонент повертає зняток UI зі свіжим набором пропсів і обробників подій у своєму JSX, що обчислюється **з використанням значень стану, взятих з цього рендеру!**

<IllustrationBlock sequential>
  <Illustration caption="Ви кажете React оновити стан" src="/images/docs/illustrations/i_state-snapshot1.png" />
  <Illustration caption="React оновлює значення стану" src="/images/docs/illustrations/i_state-snapshot2.png" />
  <Illustration caption="React передає зняток значення стану до компонента" src="/images/docs/illustrations/i_state-snapshot3.png" />
</IllustrationBlock>

Ось невеликий експеримент для демонстрації того, як це працює. У цьому прикладі можна очікувати, що клацання кнопки "+3" збільшить лічильник тричі, тому що це викликає `setNumber(number + 1)` тричі.

Дивіться, що станеться, якщо клацнути кнопку "+3":

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

Зверніть увагу, що `number` збільшується лише раз за одне клацання!

**Задання стану змінює його лише для *наступного* рендеру.** Під час першого рендеру `number` був `0`. Саме тому в обробнику `onClick` того конкретного рендеру значення `number` все одно `0`, навіть після виклику `setNumber(number + 1)`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```

Ось що обробник клацання цієї кнопки каже React робити:

1. `setNumber(number + 1)`: `number` — `0`, тож `setNumber(0 + 1)`.
    * React готується змінити `number` на `1` в наступному рендері.
2. `setNumber(number + 1)`: `number` — `0`, тож `setNumber(0 + 1)`.
    * React готується змінити `number` на `1` в наступному рендері.
3. `setNumber(number + 1)`: `number` — `0`, тож `setNumber(0 + 1)`.
    * React готується змінити `number` на `1` в наступному рендері.

Навіть попри те, що ви викликали `setNumber(number + 1)` тричі, в обробнику подій *поточного рендеру* `number` завжди дорівнює `0`, тож ви задаєте стан `1` тричі. Саме тому, коли завершується виконання вашого обробника помилок, React виконує повторний рендер компонента, де `number` дорівнює `1`, а не `3`.

Також це можна візуалізувати, уявно замінюючи змінні стану їхніми значеннями в вашому коді. Оскільки змінна стану `number` дорівнює `0` для *поточного рендеру*, обробник подій має наступний вигляд:

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```

Для наступного рендеру `number` дорівнює `1`, тож для *цього наступного рендеру* обробник клацання має такий вигляд:

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```

Саме тому клацання кнопки знову задасть лічильнику значення `2`, потім `3` — після наступного клацання, і так далі.

## Стан протягом часу {/*state-over-time*/}

Що ж, це було весело. Спробуйте вгадати, що покаже клацання цієї кнопки:

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
        alert(number);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Якщо ви скористаєтесь методом заміни, описаним вище, то можете вгадати, що буде показано "0":

```js
setNumber(0 + 5);
alert(0);
```

Але що якщо поставити таймер на виведення повідомлення, щоб воно спрацювало лише *після* повторного рендеру компонента? Буде "0" чи "5"? Вгадайте!

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
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Здивовані? Якщо скористалися методом заміни, то бачите, який "зняток" стану був переданий до повідомлення.

```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```

Стан, що зберігається в React, може змінитися на час виведення повідомлення, але він був запланований з використанням знятку стану, актуального тоді, коли користувач повзаємодіяв з елементом!

**Значення змінної стану ніколи не змінюється протягом одного рендеру,** навіть якщо код обробника події є асинхронним. Всередині `onClick` *поточного рендеру* значення `number` усе одно залишається `0`, навіть після виклику `setNumber(number + 5)`. Її значення "зафіксувалося", коли React "зробив зняток" UI, викликавши ваш компонент.

Ось приклад того, що робить обробники помилок більш захищеними щодо помилок хронометражу. Нижче — форма, що надсилає повідомлення з п'ятисекундною затримкою. Уявіть такий сценарій:

1. Ви натискаєте кнопку "Надіслати", надсилаючи "Привіт" Анні.
2. Перш ніж закінчиться п'ятисекундна затримка, ви змінюєте значення в полі "Кому" на "Богдан".

Як гадаєте, що покаже `alert`? Чи виведеться "Ви надіслали Привіт користувачу Анна"? Чи, можливо, "Ви надіслали Привіт користувачу Богдан"? Спробуйте вгадати на основі того, що знаєте, а потім перевірте:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Анна');
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
          <option value="Анна">Анна</option>
          <option value="Богдан">Богдан</option>
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

**React підтримує значення стану "зафіксованими" в межах обробників подій одного рендеру.** Немає потреби перейматися тим, чи стан змінився, поки виконувався код.

Але що якщо хочеться зчитати найсвіжіший стан перед повторним рендером? Знадобиться скористатися [функцією-оновлювачем стану](/learn/queueing-a-series-of-state-updates), про яку мова піде на наступній сторінці!

<Recap>

* Задання стану спричиняє прохання про новий рендер.
* React зберігає стан поза вашим компонентом, неначе на поличці.
* Коли викликається `useState`, React видає зняток стану *для конкретного поточного рендеру*.
* Змінні та обробники подій не "переживають" повторні рендери. Кожний рендер має власні обробники подій.
* Кожний рендер (а також функції в ньому) завжди "бачить" зняток стану, який React видав *цьому конкретному* рендеру.
* Можна уявно підставити стан у обробниках подій, подібного до того, як ми уявляємо JSX після рендеру.
* Обробники подій, створені в минулому, мають значення стану з тих рендерів, у яких вони створені.

</Recap>



<Challenges>

#### Реалізація світлофора {/*implement-a-traffic-light*/}

Ось компонент пішохідного світлофора, що перемикається, коли натискається кнопка:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
  }

  return (
    <>
      <button onClick={handleClick}>
        Змінити на {walk ? 'Стійте' : 'Йдіть'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Йдіть' : 'Стійте'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Додайте до обробника клацання `alert`. Коли світлофор світиться зеленим і каже "Йдіть", натискання кнопки повинно видавати "Далі буде Стійте". Коли світлофор світиться червоним і каже "Стійте", натискання кнопки повинно видавати "Далі буде Йдіть".

Чи важливо те, чи поставити `alert` до виклику `setWalk`, чи після?

<Solution>

Ваш `alert` повинен мати такий вигляд:

<Sandpack>

```js
import { useState } from 'react';

export default function TrafficLight() {
  const [walk, setWalk] = useState(true);

  function handleClick() {
    setWalk(!walk);
    alert(walk ? 'Далі буде Стійте' : 'Далі буде Йдіть');
  }

  return (
    <>
      <button onClick={handleClick}>
        Змінити на {walk ? 'Стійте' : 'Йдіть'}
      </button>
      <h1 style={{
        color: walk ? 'darkgreen' : 'darkred'
      }}>
        {walk ? 'Йдіть' : 'Стійте'}
      </h1>
    </>
  );
}
```

```css
h1 { margin-top: 20px; }
```

</Sandpack>

Незалежно від того, чи ви поставите виклик `alert` до виклику `setWalk`, чи після, це дасть один і той же результат. Значення `walk` у рендері — зафіксовано. Виклик `setWalk` змінить його лише для *наступного* рендеру, але не вплине на обробник подій з попереднього.

Цей рядок може спершу здаватися контрінтуїтивним:

```js
alert(walk ? 'Далі буде Стійте' : 'Далі буде Йдіть');
```

Але він має зміст, якщо прочитати його так: "Якщо світлофор показує 'Йдіть', то повідомлення повинно звучати 'Далі буде Стійте.'". Змінна `walk` усередині вашого обробника подій відповідає значенню `walk` конкретного рендеру й не змінюється.

Перевірити, що це саме так, можна застосувавши підхід підстановки. Коли `walk` дорівнює `true`, вийде:

```js
<button onClick={() => {
  setWalk(false);
  alert('Далі буде Стійте');
}}>
  Change to Stop
</button>
<h1 style={{color: 'darkgreen'}}>
  Walk
</h1>
```

Тож клацання "Змінити на Стійте" додає в чергу рендер, у якому `walk` отримує значення `false`, і виводить "Далі буде Стійте".

</Solution>

</Challenges>
