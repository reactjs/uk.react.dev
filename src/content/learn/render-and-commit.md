---
title: Рендер і коміт
---

<Intro>

Перш ніж ваші компоненти відобразяться на екрані, їх повинен підготувати React. Розуміння кроків цього процесу допоможе осмислити те, як виконується код, і пояснити його логіку.

</Intro>

<YouWillLearn>

* Що таке рендеринг у React
* Коли і чому React рендерить компонент
* Кроки виведення компоненту на екран
* Чому рендеринг не завжди призводить до оновлення DOM

</YouWillLearn>

Уявіть, що ваші компоненти — це кухарі на кухні, які створюють смачні страви з інгредієнтів. У такій історії React — це офіціант, який приймає від клієнтів замовлення та видає їм їжу. Цей процес замовлення та подачі UI складається з трьох кроків:

1. **Виклик** рендеру (відправлення замовлення гостя на кухню)
2. **Рендеринг** компонента (підготовка замовлення на кухні)
3. **Коміт** у DOM (розміщення замовлення на столі гостя)

<IllustrationBlock sequential>
  <Illustration caption="Виклик" alt="React як офіціант у ресторані, що збирає замовлення від клієнтів і передає їх до Кухні компонентів." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Рендер" alt="Кухар Card видає React свіжий компонент Card." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Коміт" alt="React доставляє Card клієнту на стіл." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## Крок 1: Запуск рендерингу {/*step-1-trigger-a-render*/}

Існує дві причини для рендерингу компонента:

1. Це **початковий рендер** компонента.
2. **Було оновлено стан** компонента (або одного з його предків).

### Початковий рендер {/*initial-render*/}

Під час запуску застосунку необхідно викликати початковий рендер. Фреймворки та пісочниці іноді приховують цей код, але це виконується через виклик [`createRoot`](/reference/react-dom/client/createRoot) із передачею цільового вузла DOM, і потім через виклик методу `render` із вашим компонентом:

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

Спробуйте закоментувати виклик `root.render()` — і побачите, що компонент зник!

### Повторний рендер під час оновлення стану {/*re-renders-when-state-updates*/}

Після першого рендерингу компонента ви можете викликати подальші рендеринги, оновивши його стан за допомогою [функції `set`.](/reference/react/useState#setstate) Оновлення стану вашого компонента автоматично додає рендеринг до черги. (Уявіть відвідувача ресторану, який після першого замовлення замовляє чай, десерт та всяку всячину залежно від стану спраги чи голоду).

<IllustrationBlock sequential>
  <Illustration caption="Оновлення стану..." alt="React як офіціант у ресторані, що подає клієнту, представленому як постать з курсором замість голови, UI Card. Постать висловлює бажання щодо рожевої картки, а не чорної!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...викликає..." alt="React повертається до Кухні компонентів і каже Кухареві Card, що потрібна рожева Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...рендер!" alt="Кухар Card видає React рожеву Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## Крок 2: React рендерить ваші компоненти {/*step-2-react-renders-your-components*/}

Коли викликано рендер, React викликає ваші компоненти, щоб з'ясувати, що виводити на екран. **"Рендеринг" — це коли React викликає ваші компоненти.**

* **Під час початкового рендеру** React викличе кореневий компонент.
* **Для наступних рендерів** React викликатиме компонент-функцію, оновлення стану якого власне почало рендер.

Цей процес є рекурсивним: якщо оновлений компонент повертає якийсь інший компонент, React буде рендерити _цей_ компонент наступним, і якщо цей компонент також щось повертає, він буде рендерити _той інший_ компонент наступним, і так далі. Процес триватиме доти, доки не залишиться більше вкладених компонентів, і React точно не знатиме, що саме має бути відображено на екрані.

У наступному прикладі React викличе `Gallery()` й `Image()` кілька разів:

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

* **Під час початкового рендеру** React [створює вузли DOM](https://developer.mozilla.org/docs/Web/API/Document/createElement) для `<section>`, `<h1>` і трьох тегів `<img>`. 
* **Під час повторного рендеру* React вираховує, які властивості елементів змінилися після попереднього рендеру та чи змінилися взагалі. Він нічого не робить з цією інформацією до наступного кроку, фази коміту.

<Pitfall>

Рендеринг завжди має бути [чистим обчисленням](/learn/keeping-components-pure):

* **Однакові вихідні дані дають однаковий результат.** Для однакових вихідних даних компонент завжди повинен повертати однаковий JSX. (Коли хтось замовляє салат з помідорами, він не повинен отримати салат з цибулею!)
* **Кожен робить свою роботу.** Рендер не повинен змінювати жодних об'єктів або змінних, які існували до нього. (Одне замовлення не повинно змінювати інші замовлення.)

Інакше ви можете зіткнутися із заплутаними помилками та непередбачуваною поведінкою зі зростанням складності кодової бази. Під час розробки у суворому режимі ("Strict Mode") React викликає функцію кожного компонента двічі, що може допомогти виявити помилки, спричинені нечистими функціями.

</Pitfall>

<DeepDive>

#### Оптимізація продуктивності {/*optimizing-performance*/}

Стандартна поведінка, яка полягає у рендерингу всіх компонентів, вкладених в оновлений компонент, не є оптимальною для продуктивності, якщо оновлений компонент знаходиться дуже високо в дереві. Якщо ви зіткнулися з проблемою продуктивності, є кілька варіантів її вирішення, описаних в розділі ["Продуктивність"](https://reactjs.org/docs/optimizing-performance.html). **Не оптимізуйте передчасно!**

</DeepDive>

## Крок 3: React фіксує зміни в DOM {/*step-3-react-commits-changes-to-the-dom*/}

Після рендерингу (виклику) ваших компонентів React вносить зміни в DOM.

* **Для початкового рендерингу** React використовує API DOM [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild), щоб вивести на екран усі новостворені вузли DOM.
* **Для повторних рендерів** React застосовує мінімально необхідні операції (обчислені під час рендерингу!), щоб оновити DOM відповідно до результату найсвіжішого рендерингу.

**React змінює вузли DOM тільки якщо є різниця між рендерами.** Наприклад, ось компонент, який повторно рендериться щосекунди з різними властивостями, що передаються від батьківського компонента. Зверніть увагу, що можна додати текст у `<input>`, оновивши його `value`, але текст не зникає, коли компонент рендериться наново:

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

Це працює, тому що на останньому кроці React оновлює лише вміст `<h1>` новим `time`. Він бачить, що `<input>` з'являється в JSX в тому ж місці, що і минулого разу, тому React не чіпає `<input>` — або його `value`!
## Епілог: Малювання браузера {/*epilogue-browser-paint*/}

Коли рендеринг завершено і React оновив DOM, браузер перемальовує екран. Хоча цей процес відомий як "рендеринг браузера", ми будемо називати його "малюванням", щоб уникнути плутанини в документації.

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Будь-яке оновлення екрану у React-застосунку відбувається у три кроки:
  1. Виклик
  2. Рендер
  3. Коміт
* Можна скористатися суворим режимом (Strict Mode), аби віднайти помилки у своїх компонентах
* React не змінює DOM, якщо результат рендерингу такий самий, як і минулого разу

</Recap>

