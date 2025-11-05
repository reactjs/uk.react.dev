---
title: useOptimistic
---

<Intro>

`useOptimistic` — це хук React, який дає змогу оптимістично (попередньо) оновлювати UI.

```js
  const [optimisticState, addOptimistic] = useOptimistic(state, updateFn);
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `useOptimistic(state, updateFn)` {/*use*/}

Хук `useOptimistic` дає змогу відображати змінений стан під час виконання асинхронної дії. Він приймає певний стан як аргумент і повертає його копію, яка може відрізнятися від переданого стану протягом виконання асинхронної дії, наприклад, мережевого запиту. Ви надаєте функцію, яка отримує поточний стан і вхідні дані для дії, та повертає "оптимістичний" стан, який буде використовуватися, поки дія триває.

Цей стан називається "оптимістичним", тому що зазвичай використовується, щоб показати користувачеві очікуваний результат одразу, навіть якщо на завершення дії потрібен певний час.

```js
import { useOptimistic } from 'react';

function AppContainer() {
  const [optimisticState, addOptimistic] = useOptimistic(
    state,
    // updateFn
    (currentState, optimisticValue) => {
      // об’єднайте і поверніть новий стан
      // з оптимістичним значенням
    }
  );
}
```

[Перегляньте більше прикладів нижче.](#usage)

#### Параметри {/*parameters*/}

* `state`: значення, яке повертається на початку та щоразу, коли немає дії, що виконується.
* `updateFn(currentState, optimisticValue)`: функція, яка приймає поточний стан і оптимістичне значення, передане до `addOptimistic`, та повертає розрахований оптимістичний стан. Повинна бути чистою функцією. `updateFn` приймає два параметри: `currentState` і `optimisticValue`. Функція повертає значення, створене через об'єднання `currentState` і `optimisticValue`.


#### Результат {/*returns*/}

* `optimisticState`: розрахований оптимістичний стан. Допоки немає дії, що виконується, він дорівнює `state`, інакше він дорівнює значенню, яке повертає `updateFn`.
* `addOptimistic`: `addOptimistic` — це функція для надсилання змін, яку потрібно викликати для оптимістичного оновлення. Вона приймає один аргумент `optimisticValue` будь-якого типу та викликає `updateFn` із `state` і `optimisticValue`.

---

## Використання {/*usage*/}

### Оптимістичне оновлення форм {/*optimistically-updating-with-forms*/}

Хук `useOptimistic` дає змогу оптимістично оновлювати інтерфейс, поки завершується фонова операція, наприклад, мережевий запит. У контексті форм такий підхід створює відчуття швидшої реакції застосунків. Коли користувач надсилає форму, замість очікування відповіді від сервера для змін, інтерфейс одразу оновлюється і відображає очікуваний результат.

Наприклад, коли користувач вводить повідомлення у форму й натискає кнопку "Надіслати", хук `useOptimistic` дає змогу одразу відобразити це повідомлення у списку з позначкою "Надсилання...", ще до того, як воно реально буде відправлене на сервер. Такий "оптимістичний" підхід створює враження швидкодії та миттєвого відгуку інтерфейсу. Після цього форма справді намагається надіслати повідомлення у фоновому режимі. Коли сервер підтвердить, що повідомлення було отримано, позначка "Надсилання..." зникне.

<Sandpack>


```js src/App.js
import { useOptimistic, useState, useRef, startTransition } from "react";
import { deliverMessage } from "./actions.js";

function Thread({ messages, sendMessageAction }) {
  const formRef = useRef();
  function formAction(formData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage,
        sending: true
      },
      ...state,
    ]
  );

  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Вітаю!" />
        <button type="submit">Надіслати</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Надсилання...)</small>}
        </div>
      ))}
      
    </>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Привіт!", sending: false, key: 1 }
  ]);
  async function sendMessageAction(formData) {
    const sentMessage = await deliverMessage(formData.get("message"));
    startTransition(() => {
      setMessages((messages) => [{ text: sentMessage }, ...messages]);
    })
  }
  return <Thread messages={messages} sendMessageAction={sendMessageAction} />;
}
```

```js src/actions.js
export async function deliverMessage(message) {
  await new Promise((res) => setTimeout(res, 1000));
  return message;
}
```


</Sandpack>
