---
title: forwardRef
---

<Deprecated>

In React 19, `forwardRef` is no longer necessary. Pass `ref` as a prop instead.

`forwardRef` will be deprecated in a future release. Learn more [here](/blog/2024/04/25/react-19#ref-as-a-prop).

</Deprecated>

<Intro>

<<<<<<< HEAD
`forwardRef` дозволяє вашому компоненту розкрити DOM-вузол батьківському компоненту через [реф.](/learn/manipulating-the-dom-with-refs)
=======
`forwardRef` lets your component expose a DOM node to the parent component with a [ref.](/learn/manipulating-the-dom-with-refs)
>>>>>>> a5181c291f01896735b65772f156cfde34df20ee

```js
const SomeComponent = forwardRef(render)
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `forwardRef(render)` {/*forwardref*/}

Викличте `forwardRef()`, щоб ваш компонент зміг отримати реф та направити його до дочірнього компонента:

```js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

[Перегляньте більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `render`: Функція для рендеру вашого компонента. React викликає цю функцію з пропсами і `ref`, які ваш компонент отримав від батьківського компонента. JSX, який ви повертаєте, буде виводом вашого компонента.

#### Результат {/*returns*/}

`forwardRef` повертає React-компонент, який можна рендерити в JSX. На відміну від React-компонентів, створених звичайними функціями, компонент повернутий з `forwardRef` також може отримувати `ref` проп.

#### Застереження {/*caveats*/}

* У строгому режимі React **викличе вашу функцію для рендеру двічі**, щоб [допомогти вам знаходити побічні ефекти.](/reference/react/useState#my-initializer-or-updater-function-runs-twice) Ця поведінка діє лише під час розробки і не впливає на готовий до впровадження код (production). Якщо ваша функція для рендеру є чистою (якою вона й повинна бути), то ця поведінка не вплине на логіку вашого компонента. Результат одного з викликів буде проігноровано. 


---

### Функція `render` {/*render-function*/}

`forwardRef` приймає функцію для рендеру як аргумент. React викликає цю функцію з `props` та `ref`:

```js
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

#### Параметри {/*render-parameters*/}

* `props`: Пропси передані батьківським компонентом.

* `ref`:  Атрибут `ref`, переданий батьківським компонентом. `ref` може бути об'єктом чи функцією. Якщо батьківський компонент не передав реф, то цей параметр буде `null`. Вам потрібно або передати отриманий `ref` до іншого компонента, або передати його в [`useImperativeHandle`.](/reference/react/useImperativeHandle)

#### Результат {/*render-returns*/}

`forwardRef` повертає React-компонент, який можна рендерити в JSX. На відміну від React-компонентів, створених звичайними функціями, компонент повернутий з `forwardRef` також може отримувати `ref` проп.

---

## Використання {/*usage*/}

### Розкриття DOM-вузла батьківському компоненту {/*exposing-a-dom-node-to-the-parent-component*/}

Початково DOM-вузли кожного компонента приватні. Але іноді потрібно передавати DOM-вузол батьківському компоненту, наприклад, щоб мати можливість сфокусувати його. Щоб зробити це, обгорніть оголошення вашого компонента в `forwardRef()`:

```js {3,11}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} />
    </label>
  );
});
```

Ви отримаєте <CodeStep step={1}>реф</CodeStep> як другий аргумент після пропсів. Передайте його у DOM-вузол, який хочете розкрити:

```js {8} [[1, 3, "ref"], [1, 8, "ref", 30]]
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});
```

Це дозволяє батьківському компоненту `Form` отримати доступ до <CodeStep step={2}>`<input>` DOM-вузла,</CodeStep> розкритого в `MyInput`:

```js [[1, 2, "ref"], [1, 10, "ref", 41], [2, 5, "ref.current"]]
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Редагувати
      </button>
    </form>
  );
}
```

Цей компонент `Form` [передає реф](/reference/react/useRef#manipulating-the-dom-with-a-ref) до `MyInput`. Компонент `MyInput` *направляє* той реф до браузерного тегу `<input>`. Як результат, компонент `Form` має доступ до DOM-вузла `<input>` та може викликати [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) на ньому.

Пам'ятайте, що розкриття рефу DOM-вузла всередині вашого компонента робить важчою зміну внутрішніх частин компонента пізніше. Зазвичай, ви будете розкривати DOM-вузли з компонентів нижнього рівня, що перевикористовуються (як-от кнопки та поля вводу), та не будете робити це із глобальними компонентами, такими як аватар чи коментар.

<Recipes titleText="Приклади направлення рефу">

#### Фокусування на текстовому полі {/*focusing-a-text-input*/}

Натискання кнопки сфокусує курсор на полі вводу. Компонент `Form` оголошує реф і передає його до компонента `MyInput`. Компонент `MyInput` направляє той реф до браузерного `<input>`. Це дозволяє компоненту `Form` сфокусувати курсор на `<input>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Редагувати
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

<Solution />

#### Відтворення та зупинка відео {/*playing-and-pausing-a-video*/}

Натискання на кнопку викличе [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) і [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) на DOM-вузлі `<video>`. Компонент `App` оголошує реф та передає його в компонент `MyVideoPlayer`. Компонент `MyVideoPlayer` направляє той реф до браузерного вузла `<video>`. Це дозволяє компоненту `App` відтворювати та зупиняти `<video>`.

<Sandpack>

```js
import { useRef } from 'react';
import MyVideoPlayer from './MyVideoPlayer.js';

export default function App() {
  const ref = useRef(null);
  return (
    <>
      <button onClick={() => ref.current.play()}>
        Відтворити
      </button>
      <button onClick={() => ref.current.pause()}>
        Зупинити
      </button>
      <br />
      <MyVideoPlayer
        ref={ref}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        type="video/mp4"
        width="250"
      />
    </>
  );
}
```

```js src/MyVideoPlayer.js
import { forwardRef } from 'react';

const VideoPlayer = forwardRef(function VideoPlayer({ src, type, width }, ref) {
  return (
    <video width={width} ref={ref}>
      <source
        src={src}
        type={type}
      />
    </video>
  );
});

export default VideoPlayer;
```

```css
button { margin-bottom: 10px; margin-right: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Передача рефу через кілька компонентів {/*forwarding-a-ref-through-multiple-components*/}

Замість направлення `ref` до DOM-вузла, ви можете направити його у ваш власний компонент, наприклад `MyInput`:

```js {1,5}
const FormField = forwardRef(function FormField(props, ref) {
  // ...
  return (
    <>
      <MyInput ref={ref} />
      ...
    </>
  );
});
```

Якщо компонент `MyInput` направляє реф до свого `<input>`, реф до `FormField` дасть вам той `<input>`:

```js {2,5,10}
function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Редагувати
      </button>
    </form>
  );
}
```

Компонент `Form` оголошує реф та передає його до `FormField`. Компонент `FormField` направляє той реф у `MyInput`, який направляє його в браузерний DOM-вузол `<input>`. Ось як `Form` отримує доступ до того DOM-вузла.


<Sandpack>

```js
import { useRef } from 'react';
import FormField from './FormField.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <FormField label="Enter your name:" ref={ref} isRequired={true} />
      <button type="button" onClick={handleClick}>
        Редагувати
      </button>
    </form>
  );
}
```

```js src/FormField.js
import { forwardRef, useState } from 'react';
import MyInput from './MyInput.js';

const FormField = forwardRef(function FormField({ label, isRequired }, ref) {
  const [value, setValue] = useState('');
  return (
    <>
      <MyInput
        ref={ref}
        label={label}
        value={value}
        onChange={e => setValue(e.target.value)} 
      />
      {(isRequired && value === '') &&
        <i>Обов'язкове поле</i>
      }
    </>
  );
});

export default FormField;
```


```js src/MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  const { label, ...otherProps } = props;
  return (
    <label>
      {label}
      <input {...otherProps} ref={ref} />
    </label>
  );
});

export default MyInput;
```

```css
input, button {
  margin: 5px;
}
```

</Sandpack>

---

### Розкриття імперативного керування замість DOM-вузла {/*exposing-an-imperative-handle-instead-of-a-dom-node*/}

Замість того, щоб розкривати весь DOM-вузол, ви можете розкрити власний об'єкт з обмеженим набором методів, що називають *імперативним керуванням*. Щоб зробити це, вам потрібно буде оголосити окремий реф для зберігання DOM-вузла:

```js {2,6}
const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  // ...

  return <input {...props} ref={inputRef} />;
});
```

Передайте `ref`, який ви отримуєте, в [`useImperativeHandle`](/reference/react/useImperativeHandle) і вкажіть значення яке ви хочете розкрити в `ref`:

```js {6-15}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Якщо якийсь компонент отримує реф до `MyInput`, він отримає тільки ваш об'єкт `{ focus, scrollIntoView }`, замість DOM-вузла. Це дозволяє вам обмежувати розкриту інформацію про ваш DOM-вузол до мінімуму.

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // Це не працюватиме, тому що DOM-вузол не розкритий:
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput placeholder="Enter your name" ref={ref} />
      <button type="button" onClick={handleClick}>
        Редагувати
      </button>
    </form>
  );
}
```

```js src/MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

[Прочитайте більше про використання імперативного керування.](/reference/react/useImperativeHandle)

<Pitfall>

**Не використовуйте рефи занадто часто.** Ви повинні використовувати рефи тільки для *імперативної* поведінки, яку не можете передавати як пропси: для прикладу, скролл до вузла, фокусування на вузлі, активацію анімації, виділення тексту тощо.

**Якщо ви можете виразити щось як проп, вам не потрібно використовувати реф.** Для прикладу, замість розкриття імперативного керування як `{ open, close }` з компонента `Modal`, краще передати `isOpen` як проп, по типу `<Modal isOpen={isOpen} />`. [Ефекти](/learn/synchronizing-with-effects) можуть допомогти вам розкрити імперативну поведінку через пропси.

</Pitfall>

---

## Усунення неполадок {/*troubleshooting*/}

### Мій компонент обгорнутий у `forwardRef`, але `ref` до нього завжди `null` {/*my-component-is-wrapped-in-forwardref-but-the-ref-to-it-is-always-null*/}

Це зазвичай означає, що ви забули використати `ref`, який отримали.

Для прикладу, цей компонент не робить нічого зі своїм `ref`:

```js {1}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input />
    </label>
  );
});
```

Щоб виправити це, передайте `ref` вниз во DOM-вузла або іншого компонента, який може прийняти реф:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});
```

`ref` до `MyInput` також може бути `null`, якщо якась логіка умовна:

```js {1,5}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      {showInput && <input ref={ref} />}
    </label>
  );
});
```

Якщо `showInput` це `false`, реф не буде передано ні в один вузол, і реф до `MyInput` залишиться пустим. Це особливо легко непомітити, якщо умова схована всередині іншого компонента, як `Panel` в цьому прикладі:

```js {5,7}
const MyInput = forwardRef(function MyInput({ label, showInput }, ref) {
  return (
    <label>
      {label}
      <Panel isExpanded={showInput}>
        <input ref={ref} />
      </Panel>
    </label>
  );
});
```
