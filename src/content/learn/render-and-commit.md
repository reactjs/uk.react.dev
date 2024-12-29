---
title: Рендер і фіксація
---

<Intro>

Перш ніж ваші компоненти відобразяться на екрані, їх повинен підготувати React. Розуміння кроків цього процесу допоможе осмислити те, як виконується код, і пояснити його логіку.

</Intro>

<YouWillLearn>

* Що таке рендеринг в React
* Коли і чому React рендерить компонент
* Кроки виведення компоненту на екран
* Чому рендеринг не завжди призводить до оновлення DOM

</YouWillLearn>

Уявіть, що ваші компоненти - це кухарі на кухні, які збирають смачні страви з інгредієнтів. У цьому сценарії React - це офіціант, який приймає запити від клієнтів і приносить їм замовлення. Цей процес запиту та обслуговування UI складається з трьох кроків:

1. **Запуск** рендеру (доставка замовлення гостя на кухню)
2. **Рендеринг** компонента (підготовка замовлення на кухні)
3. **Фіксація** у DOM (розміщення замовлення на столі)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Крок 1: Запуск рендерингу {/*step-1-trigger-a-render*/}

Існує дві причини для рендерингу компонента:

1. Це **початковий рендер** компонента.
2. **Було оновлено стан** компонента (або одного з його предків).

### Початковий {/*initial-render*/}

Під час запуску програми вам потрібно запустити початковий рендеринг. Фреймворки та пісочниці іноді приховують цей код, але це робиться шляхом виклику [`createRoot`](/reference/react-dom/client/createRoot) з цільового DOM-вузла, і потім викликом його методу `render` з вашим компонентом:

<Sandpack>

```js src/index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js src/Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

Спробуйте закоментувати виклик `root.render()` і побачите, що компонент зникне!

### Повторний рендеринг при оновленні стану {/*re-renders-when-state-updates*/}

Після першого рендерингу компонента ви можете викликати подальші рендеринги, оновивши його стан за допомогою функції[`set` function.](/reference/react/useState#setstate) Оновлення стану вашого компонента автоматично ставить рендеринг у чергу. (Ви можете уявити це як відвідувача ресторану, який після першого замовлення замовляє чай, десерт та інші речі, залежно від стану спраги чи голоду).

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. They patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Крок 2: React рендерить ваші компоненти {/*step-2-react-renders-your-components*/}

Після того, як ви запускаєте рендер, React викликає ваші компоненти, щоб з'ясувати, що виводити на екраню **"Рендеринг" - це виклик React'ом ваших компонентів.**

* **При початковому рендерингу,** React викличе кореневий компонент.
* **Для наступних рендерів,** React буде викликати компонент функції, оновлення стану якого викликало рендер.

Цей процес є рекурсивним: якщо оновлений компонент повертає якийсь інший компонент, React буде рендерити _цей_ компонент наступним, і якщо цей компонент також щось повертає, він буде рендерити _цей_ компонент наступним і так далі. Процес продовжуватиметься доти, доки не залишиться більше вкладених компонентів і React точно знатиме, що саме має бути відображено на екрані.

У наступному прикладі React викличе `Gallery()` і `Image()` кілька разів:

<Sandpack>

```js src/Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js src/index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **Під час початкового рендерингу,** React [створить вузли DOM](https://developer.mozilla.org/docs/Web/API/Document/createElement) для `<section>`, `<h1>`, і трьох `<img>` тегів. 
* **Під час ре-рендерингу,** React вирахує, які властивості цих елементів, якщо такі були, змінилися з моменту попереднього рендерингу. Він нічого не буде робити з цією інформацією до наступного кроку, фази фіксації.

<Pitfall>

Рендеринг завжди має бути [чистим обчисленням](/learn/keeping-components-pure):

* **Однакові вхідні дані, однаковий результат.** При однакових вхідних даних компонент завжди має повертати однаковий JSX. (Коли хтось замовляє салат з помідорами, він не повинен отримати салат з цибулею!)
* **Займається своїми справами.** Він не повинен змінювати жодних об'єктів або змінних, які існували до рендерингу. (Одне замовлення не повинно змінювати інші замовлення.)

Інакше ви можете зіткнутися із заплутаними багами та непередбачуваною поведінкою зі зростанням складності вашої кодової бази. При розробці у "Strict Mode" React викликає функцію кожного компонента двічі, що може допомогти виявити помилки, спричинені нечистими функціями.

</Pitfall>

<DeepDive>

#### Оптимізація продуктивності {/*optimizing-performance*/}

Поведінка за замовчуванням, яка полягає у рендерингу усіх компонентів, вкладених у оновлений компонент, не є оптимальною для продуктивності, якщо оновлений компонент знаходиться дуже високо у дереві. Якщо ви зіткнулися з проблемою продуктивності, є кілька варіантів її вирішення, описаних в розділі [Продуктивність](https://reactjs.org/docs/optimizing-performance.html). **Не оптимізуйте передчасно!**

</DeepDive>

## Крок 3: React фіксує зміни в DOM {/*step-3-react-commits-changes-to-the-dom*/}

Після рендерингу (виклику) ваших компонентів, React змінюватиме DOM.

* **Для початкового рендерингу,** React використовуватиме [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API, щоб вивести на екран усі створені ним вузли DOM.
* **Для ре-рендерингів,** React застосовуватиме мінімально необхідні операції (обчислені під час рендерингу!) щоб зробити DOM відповідним останньому результату рендерингу.

**React змінює вузли DOM тільки якщо є різниця між рендерами.** Наприклад, ось компонент, який ре-рендериться щосекунди з різними пропсами, переданими від батька. Зверніть увагу, що ви можете додати текст у `<input>`, оновивши його `value`, але текст не зникає, коли компонент ре-рендериться:

<Sandpack>

```js src/Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
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
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Це працює, тому що на останньому кроці React оновлює лише вміст `<h1>` з новим `time`. Він бачить, що `<input>` з'являється в JSX в тому ж місці, що і минулого разу, тому React не чіпає `<input>` — або його `value`!

## Епілог: Малювання браузера {/*epilogue-browser-paint*/}

Після того, як рендеринг завершено і React оновив DOM, браузер перемалює екран. Хоча цей процес відомий як "рендеринг браузера", ми будемо називати його "малюванням", щоб уникнути плутанини в документації.

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Будь-яке оновлення екрану у React-застосунку відбувається у три кроки:
  1. Запуск
  2. Рендер
  3. Фіксація
* Ви можете використовувати Strict Mode щоб шукати помилки у ваших компонентах
* React не змінює DOM, якщо результат рендерингу такий самий, як і минулого разу

</Recap>

