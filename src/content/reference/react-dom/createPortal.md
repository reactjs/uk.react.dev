---
title: createPortal
---

<Intro>

`createPortal` дозволяє рендерити дочірні компоненти в інші частини DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Опис {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Щоб створити портал, викличте `createPortal`, передаючи JSX і DOM-вузол в якому він повинен відрендеритись:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>Цей дочірній елемент знаходиться в батьківському div.</p>
  {createPortal(
    <p>Цей дочірній елемент знаходиться безпосередньо в тілі документа.</p>,
    document.body
  )}
</div>
```

[Перегляньте більше прикладів нижче.](#usage)

Портал лише змінює фізичне розташування DOM-вузла. У всіх інших випадках, JSX, який ви рендерите в портал, поводиться як дочірній елемент React-компонента, який його рендерить. Для прикладу, цей дочірній елемент має доступ до контексту, наданого батьківським деревом елементів, а події передаються вгору від дочірніх елементів до батьківських, відповідно до React-дереву компонентів.

#### Параметри {/*parameters*/}

* `children`: Все, що може бути відрендерено за допомогою React, включаючи JSX (наприклад `<div />` або `<SomeComponent />`), [Фрагмент](/reference/react/Fragment) (`<>...</>`), рядок, число, або масив з них.

* `domNode`: DOM-вузол, наприклад повернутий з `document.getElementById()`. Переданий вузол вже повинен існувати. Передавання різних DOM-вузлів під час оновлення спричинить повторне створення контенту всередині порталу.

<<<<<<< HEAD
#### Результат {/*returns*/}
=======
* **optional** `key`: A unique string or number to be used as the portal's [key.](/learn/rendering-lists/#keeping-list-items-in-order-with-key)

#### Returns {/*returns*/}
>>>>>>> 2390627c9cb305216e6bd56e67c6603a89e76e7f

`createPortal` повертає React-вузол, який може бути включеним в JSX або ж повернутим з React-компонента. Якщо React зіткнеться з таким у виводі рендеру, він помістить надані `children` всередину переданого `domNode`.

#### Застереження {/*caveats*/}

* Події з порталів поширюються згідно з деревом React-компонентів, а не DOM. Наприклад, якщо ви клікнете в межах порталу, обгорнутого в `<div onClick>`, то цей обробник події `onClick` спрацює. Якщо така поведінка створює проблеми, зупиніть поширення події з порталу або ж перенесіть портал вище в дереві React-компонентів.

---

## Використання {/*usage*/}

### Рендер в іншу частину DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Портали* дозволяють вашим компонентам рендерити деякі їхні дочірні елементи в інші частини DOM. Це дозволяє частині вашого компоненту "втекти"  з будь-яких контейнерів, в яких вона перебуває. Приміром, компонент може відображати модальне вікно або спливаючу підказку, що з'являється поза та над основною частиною сторінки.

Щоб створити портал, відрендеріть результат `createPortal` з <CodeStep step={1}>JSX</CodeStep> і <CodeStep step={2}>DOM-вузлом, куди потрібно помістити JSX</CodeStep>:

```js [[1, 8, "<p>Цей дочірній елемент знаходиться безпосередньо в тілі документа.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Цей дочірній елемент знаходиться в батьківському div.</p>
      {createPortal(
        <p>Цей дочірній елемент знаходиться безпосередньо в тілі документа.</p>,
        document.body
      )}
    </div>
  );
}
```

React помістить DOM-вузли <CodeStep step={1}>переданого вами JSX</CodeStep> всередину <CodeStep step={2}>наданого вами DOM-вузла</CodeStep>.

Без порталу, другий `<p>` розміщувався би всередині батьківського `<div>`, але портал "телепортував" його в [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>Цей дочірній елемент знаходиться в батьківському div.</p>
      {createPortal(
        <p>Цей дочірній елемент знаходиться безпосередньо в тілі документа.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Зверніть увагу, як другий параграф візуально знаходиться поза межами `<div>` з рамкою. Якщо ви перевірите структуру DOM за допомогою інструментів розробника, то побачите, що другий `<p>` розміщений безпосередньо в `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>Цей дочірній елемент знаходиться в батьківському div.</p>
      </div>
    ...
  </div>
  <p>Цей дочірній елемент знаходиться безпосередньо в тілі документа.</p>
</body>
```

Портал лише змінює фізичне розташування DOM-вузла. У всіх інших випадках, JSX, який ви рендерите в портал, поводиться як дочірній елемент React-компонента, який його рендерить. Для прикладу, цей дочірній елемент має доступ до контексту, наданого батьківським деревом елементів, а події передаються вгору від дочірніх елементів до батьківських, відповідно до React-дереву компонентів.

---

### Рендер модального вікна з допомогою порталу {/*rendering-a-modal-dialog-with-a-portal*/}

Ви можете використовувати портал для створення модального вікна, що висітиме поверх решти сторінки, навіть якщо компонент, який викликає це вікно, знаходиться всередині контейнеру з `overflow: hidden` або іншими стилями, які так чи інакше втручаються у модальне вікно.

У цьому прикладі два контейнери мають стилі, які обмежують відображення модального вікна. Проте, обмеження не впливає на вікно, відрендерене в порталі, тому що в DOM воно не знаходиться в межах батьківських JSX елементів.

<Sandpack>

```js App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Показати модальне вікно без порталу
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Показати модальне вікно, використовуючи портал
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>Я модальне вікно</div>
      <button onClick={onClose}>Сховати</button>
    </div>
  );
}
```


```css styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

При використанні порталів, важливо впевнитись, що ваш додаток залишається доступним для користувачів з обмеженими можливостями. Приміром, вам може знадобитись функціонал для управління фокусом клавіатури, щоб користувач міг переміщати фокус клавіатури в та з порталу у звичний спосіб.

Слідуйте [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) коли створюєте модальні вікна. Якщо ви використовуєте пакет для модальних вікон від спільноти, переконайтеся, що він відповідає цим рекомендація та доступний користувачам з обмеженими можливостями.

</Pitfall>

---

### Рендер React-компонентів у серверну розмітку, створену без використання React {/*rendering-react-components-into-non-react-server-markup*/}

Портали можуть бути корисними якщо ваш React-корінь це тільки частина статичної або відрендереної на сервері сторінки, не створеної з React. Наприклад, якщо ваша сторінка побудована з серверним фреймворком подібним до Rails, ви можете створити інтерактивні частини в середині статичних зон, приміром в бокових панелях. У порівнянні зі створенням [кількох окремих React-коренів,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) портали дозволяють працювати з додатком як з єдиним React-деревом зі спільним станом, навіть якщо його окремі шматочки рендеряться в інші частини DOM.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>Мій додаток</title></head>
  <body>
    <h1>Ласкаво просимо до мого гібридного додатку</h1>
    <div class="parent">
      <div class="sidebar">
        Це серверна розмітка без React
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>Ця частина рендериться з допомогою React</p>;
}

function SidebarContent() {
  return <p>Ця частина також рендериться з допомогою React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Рендер React-компонентів у DOM-вузли, які знаходяться ззовні React-дерева {/*rendering-react-components-into-non-react-dom-nodes*/}

Ви також можете використовувати портал щоб керувати контентом DOM-вузла, який знаходиться ззовні React-дерева. Припустимо, ви додаєте на сторінку віджет мапи, що не використовує React, і хочете рендерити React-контент всередині спливаючої підказки на мапі. Щоб зробити це, створіть змінну стану `popupContainer` для збереження в ній DOM-вузла, в який ви збираєтеся рендерити спливаючу підказку:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

При створенні віджета з допомогою стороннього пакету, зберігайте повернений віджетом DOM-вузол, щоб мати змогу рендерити контент в середину нього:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Це дозволить використовувати `createPortal` щоб рендерити React-контент всередину `popupContainer`, як тільки він стане доступним:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Привіт від React!</p>,
      popupContainer
    )}
  </div>
);
```

Ось повний приклад з яким ви можете експерементувати:

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

```js App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Привіт від React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
