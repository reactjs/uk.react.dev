---
id: testing-recipes
title: Рецепти тестування
permalink: docs/testing-recipes.html
prev: testing.html
next: testing-environments.html
---

Загальні принципи тестування React-компонентів.

> Примітка:
>
> Ця сторінка передбачає, що ви використовуєте виконацець тестів [Jest](https://jestjs.io/). Якщо ви використовуєте інший виконавець тестів, можливо, вам доведеться налаштувати API, але загальна форма рішення, швидше за все, буде однаковою. Докладніше про налаштування середовища тестування на сторінці [Середовища тестування](/docs/testing-environments.html).

На цій сторінці ми в основному будемо використовувати функціональні компоненти. Проте, стратегії тестування не залежать від деталей реалізації і працюють так само добре для компонентів-класів.

- [Підготовка/Завершення](#setup--teardown)
- [`act()`](#act)
- [Рендеринг](#rendering)
- [Отримання даних](#data-fetching)
- [Фіктивні модулі](#mocking-modules)
- [Події](#events)
- [Таймери](#timers)
- [Тестування знімками](#snapshot-testing)
- [Декілька рендерерів](#multiple-renderers)
- [Чогось не вистачає?](#something-missing)

---

### Підготовка/Завершення {#setup--teardown}

Для кожного тесту ми зазвичай хочемо рендерити наше React дерево до конкретного DOM-елемента, який прикріплений до `document`. Це важливо, щоб він міг отримувати DOM-події. Коли тест завершується, ми хочемо виконати «підчистку» і демонтувати дерево від `document`.

Поширеним способом зробити це є використання пари блоків `beforeEach` та `afterEach`, вони завжди будуть виконуватися і ізолювати тести один від одного:

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

Ви можете використовувати інший підхід, але майте на увазі що ми хочемо виконувати «підчистку» _навіть якщо тест не проходить_. В іншому випадку тести можуть стати «негерметичними», і один тест може змінити поведінку іншого тесту. Це ускладнює їх налагодження.

---

### `act()` {#act}

При написанні UI-тестів, такі завдання, як рендеринг, події користувача або отримання даних, можна розглядати як «модулі» взаємодії з інтерфейсом користувача. `react-dom/test-utils` надає допоміжну функцію під назвою [`act()`](/docs/test-utils.html#act), що гарантує, що всі оновлення, пов’язані з цими «модулями» були виконані та застосовані до DOM до перевірки будь-яких тверджень:

```js
act(() => {
  // рендер компонентів
});
// перевірка тверджень
```

Це допомагає наблизити ваші тести до того, що реальні користувачі могли б відчувати при використанні вашого додатку. В решті прикладів використовується `act()` щоб забезпечити це.

Якщо ви вважаєте, що використання `act()` вимагає написання більшої кількості шаблонного коду, то щоб частково цього уникнути, ви можете скористатись бібліоткою подібною до [React Testing Library](https://testing-library.com/react), допоміжні функції якої вже обернуті в `act()`.

> Примітка:
>
> Назва функції `act` походить від шаблону [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert).

---

### Рендеринг {#rendering}

Зазвичай вам може знадобитися перевірити, чи правильно компонент відображається для заданих властивостей. Розглянемо простий компонент, який відображає повідомлення на основі властивості:

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

Ми можемо написати тест для цього компонента:

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### Отримання даних {#data-fetching}

Замість звернення до реальних API в своїх тестах, ви можете робити фіктивні запити, які повернуть підставні дані. Такі запити запобігають виникненню проблем у тестах, пов'язані з недоступністю бекенд та збільшують швидкість їх виконання. Примітка: ви все ще можете виконувати запуск [«наскрізних»](/docs/testing-environments.html#end-to-end-tests-aka-e2e-tests) тестів через фреймворк, який повідомляє, чи працює додаток в цілому.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return "loading...";
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

Ми можемо написати тести для цього компонента:

```jsx{23-33,44-45}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // підготовлюємо DOM-елемент, до якого робитимемо рендеринг
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // робимо підчистку після завершення
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Використовуємо асинхронну версію act для передачі успішно завершених промісів
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // вимикаємо фіктивний fetch, щоб переконатися, що тести повністю ізольовані
  global.fetch.mockRestore();
});
```

---

### Фіктивні модулі {#mocking-modules}

Деякі модулі можуть погано працювати у тестовому середовищі або можуть бути не такими важливими для самого тесту. Заміна таких модулів фіктивними може полегшити написання тестів для вашого коду.

Розглянемо компонент `Contact`, який використовує сторонній компонент `GoogleMap`:

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

export default function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

Якщо ми не хочемо завантажувати цей компонент в наших тестах, ми можемо підмінити його фіктивним і запустити наші тести:

```jsx{10-18}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
beforeEach(() => {
  // підготовлюємо DOM-елемент, до якого робитимемо рендеринг
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // робимо підчистку після завершення
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />,
      container
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```

---

### Події {#events}

Ми рекомендуємо створювати справжні DOM-події на DOM-елементах і після перевіряти очікуваний результат. Розглянемо компонент `Toggle`:

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

Ми можемо написати тести для цього компонента:

```jsx{13-14,35,43}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  // container *must* be attached to document so events work correctly.
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle onChange={onChange} />, container);
  });

  // get ahold of the button element, and trigger some clicks on it
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

Різні DOM-події і їх властивості описані на [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent). Зверніть увагу, що вам необхідно передавати `{ bubbles: true }` в кожну подію, яку ви створюєте для нього, щоб повідомити обробника подій React, оскільки React автоматично делегує події документу.

> Примітка:
>
> React Testing Library пропонує лаконічний варіант [допоміжної функції](https://testing-library.com/docs/dom-testing-library/api-events) для запуску подій.

---

### Таймери {#timers}

Ваш код може використовувати функції на основі таймера, такі як `setTimeout` щоб запланувати додаткові дії в майбутньому. У наступному прикладі панель множинного вибору очікує вибору користувача і виконує подальші дії, якщо вибір не був зроблений протягом 5 секунд:

```jsx
// card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map(choice => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>
  ));
}
```

Ми можемо написати тести для цього компонента використовуючи [фіктивні таймери Jest](https://jestjs.io/docs/en/timer-mocks), і протестуємо різні стани, в яких він може бути.

```jsx{7,31,37,49,59}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Card from "./card";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  // move ahead in time by 100ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // and then move ahead by 5 seconds
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // unmount the app
  act(() => {
    render(null, container);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

Необов'язково використовувати фіктивні таймери у всіх тестах. У тесті вище, ми включили їх викликавши метод `jest.useFakeTimers()`. Головна їхня перевага полягає в тому, що вашому тесту не потрібно чекати п'ять секунд для виконання, а вам ускладнювати код компонента тільки для проведення тестування.

---

### Тестування знімками {#snapshot-testing}

Фреймворки, такі як Jest, дозволяють зберігати «знімки» даних використовуючи [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). З їх допомогою ми можемо «зберегти» результат рендеру компонента і переконатися, що зміну в ньому явно відображено в знімку.

У наступному прикладі ми рендеримо компонент і форматуємо відрендерений HTML, використовуючи пакет [`pretty`](https://www.npmjs.com/package/pretty), перед його збереженням у вигляді вбудованого знімка:

```jsx{29-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */
});
```

Зазвичай краще перевіряти більш конкретні твердження, ніж використовувати знімки. Цей тип тестів спирається на внутрішню реалізацію компонентів, в результаті чого легко ламаються і команди починають приділяти менше уваги поломкам у знімках. Вибіркова [підзаміна дочірніх компонентів](#mocking-modules) може допомогти знизити розмір знімків і зробить їх код більш читабельним для колег.

---

### Декілька рендерерів {#multiple-renderers}

У окремих випадках ви можете запустити тест компонента, який використовує декілька рендерерів. Наприклад, можна запускати тести знімками для компонента за допомогою `react-test-renderer`, який використовує `ReactDOM.render` всередині дочірнього компонента для рендеру деякого вмісту. В цьому випадку ви можете обернути оновлення функціями `act()` відповідно до їх рендерерів.

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### Чогось не вистачає? {#something-missing}

Якщо будь-які із розповсюджених сценаріїв не були охоплені, повідомте нас про це за допомогою [трекера проблем](https://github.com/reactjs/reactjs.org/issues) сайту з документацією.
