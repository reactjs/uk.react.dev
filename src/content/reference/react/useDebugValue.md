---
title: useDebugValue
---

<Intro>

`useDebugValue` — це хук React, який дає змогу додати мітку до вашого користувацького хука в [React DevTools.](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Викликайте `useDebugValue` на верхньому рівні вашого [користувацького хуку](/learn/reusing-logic-with-custom-hooks), щоб показати зручне для читання значення для налагодження:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[Дивіться більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `value`: Значення, яке ви хочете показати в React DevTools. Може бути будь‑якого типу.
* **необов'язково** `format`: Функція форматування. Коли компонент буде інспектовано, React DevTools викличе цю функцію, передавши `value` як аргумент, а потім відобразить повернуте відформатоване значення (яке також може бути будь‑якого типу). Якщо ви не вкажете функцію форматування, буде показано початкове значення `value`.

#### Повертає {/*returns*/}

`useDebugValue` нічого не повертає.

## Використання {/*usage*/}

### Додавання мітки до користувацького хуку {/*adding-a-label-to-a-custom-hook*/}

Викликайте `useDebugValue` на верхньому рівні вашого [користувацького хуку](/learn/reusing-logic-with-custom-hooks), щоб показати зручне для читання <CodeStep step={1}>значення для налагодження</CodeStep> у [React DevTools.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

Це дає компонентам, які викликають `useOnlineStatus`, мітку на кшталт `OnlineStatus: "Online"`, коли ви їх інспектуєте:

![Скріншот React DevTools, що показує значення для налагодження](/images/docs/react-devtools-usedebugvalue.png)

Без виклику `useDebugValue` відобразилися б лише самі дані (у цьому прикладі `true`).

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js src/useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

<Note>

Не додавайте значення для налагодження до кожного користувацького хуку. Це найбільш корисно для тих користувацьких хуків, що входять до спільних бібліотек і мають складну внутрішню структуру даних, яку важко інспектувати.

</Note>

---

### Відкладене форматування значення для налагодження {/*deferring-formatting-of-a-debug-value*/}

Ви також можете передати функцію форматування другим аргументом до `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Ваша функція форматування отримає <CodeStep step={1}>значення для налагодження</CodeStep> як параметр і має повернути <CodeStep step={2}>відформатоване відображуване значення</CodeStep>. Коли ваш компонент буде інспектовано, React DevTools викличе цю функцію і відобразить її результат.

Це дає змогу уникнути виконання потенційно «дорогої» логіки форматування, доки компонент фактично не буде інспектовано. Наприклад, якщо `date` — це об’єкт Date, ви таким чином не викликаєте `toDateString()` на кожному рендері.
