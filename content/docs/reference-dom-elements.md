---
id: dom-elements
title: Елементи DOM
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React впроваджує незалежну від браузера систему DOM для продуктивності та сумісності між браузерами. Ми використали цю можливість, щоб згладити кілька гострих кутів у реалізації DOM у браузері.

 У React усі властивості й атрибути DOM (включно з обробниками подій) мають використовувати *camelCase* нотацію. Наприклад, атрибут HTML `tabindex` відповідає атрибуту `tabIndex` у React. Виключенням є лише `aria-*` та `data-*` атрибути, які будуть у нижньому регістрі. Наприклад, ви можете залишити `aria-label` як `aria-label`.

## Відмінності в атрибутах {#differences-in-attributes}

Є багато атрибутів які працюють по-різному в React та HTML:

### checked {#checked}

Атрибут `checked` підтримується у компонентах `<input>` типу `checkbox` та `radio`. Ви можете використати його, щоб зробити компонент вибраним. Це корисно для побудови контрольованих компонентів. `defaultChecked` — це неконтрольований еквівалент, який робить компонент вибраним коли той вперше змонтовано.

### className {#classname}

Щоб визначити CSS класс, слід використовувати атрибут `className`. Він застосовується з усіма звичайними DOM- та SVG-елементами, як `<div>`, `<a>` та інші.

Якщо ви використовуєте React з Веб-компонентами (що не є типовим), то натомість використовуйте атрибут `class`.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

`dangerouslySetInnerHTML` — це React-альтернатива використання `innerHTML` в DOM браузера. Взагалі, вставка HTML-коду через JavaScript є ризикованою, бо можна ненавмисне наразити ваших користувачів на [міжсайтовий скриптинг (XSS)](https://uk.wikipedia.org/wiki/%D0%9C%D1%96%D0%B6%D1%81%D0%B0%D0%B9%D1%82%D0%BE%D0%B2%D0%B8%D0%B9_%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B8%D0%BD%D0%B3) атаку. Тож, ви можете використовувати вставку HTML-коду безпосередньо через React, але ви повинні використовувати `dangerouslySetInnerHTML` та передавати об'єкт з ключем `__html`, щоб нагадати самому собі, що це є небезпечним. Наприклад:

```js
function createMarkup() {
  return {__html: 'First &middot; Second'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

Оскільки `for` є зарезервованим словом у JavaScript, елементи React натомість використовують `htmlFor`.

### onChange {#onchange}

Подія `onChange` веде себе так, як ви й очікували: вона буде запущена, коли змінюється поле форми. Ми навмисно не використовуємо існуючу поведінку браузера, оскільки `onChange` має неправильний принцип роботи і React покладається на цю подію, щоб опрацьовувати дані введені користувачем в реальному часі.

### selected {#selected}

Атрибут `selected` підтримується компонентами `<option>`. Ви можете використовувати його, щоб визначити чи є компонент вибраним. Це корисно для створення контрольованих компонентів.

### style {#style}

>Примітка
>
>Деякі приклади в документації використовують `style` для зручності, але **використання атрибута `style` як основного засобу стилізації елементів, як правило, не рекомендується.** У більшості випадків має використовуватися [`className`](#classname) для посилання на класи, визначені у зовнішній таблиці стилів CSS. `style` найчастіше використовується у програмах React для додавання динамічно-обчислювальних стилів під час рендеру. Див. також [FAQ: Стилізація та CSS](/docs/faq-styling.html).

Атрибут `style` приймає JavaScript об'єкт з властивостями у *camelCase* нотації, а не рядки CSS. Це співвідносно з DOM властивістю `style` у JavaScript, але є більш ефективним та попереджає можливі XSS-дірки в безпеці. Наприклад:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Hello World!</div>;
}
```

Зауважте, що стилі не отримують префікси автоматично. Для підтримки старих браузерів ви маєте використовувати відповідні властивості стилів:

```js
const divStyle = {
  WebkitTransition: 'all', // тут зверніть увагу на велику літеру 'W'
  msTransition: 'all' // 'ms' — це єдиний вендорний префікс, що починається з малої літери
};

function ComponentWithTransition() {
  return <div style={divStyle}>Це має працювати крос-браузерно</div>;
}
```

Стилі використовують нотацію *camelCase*, для забезпечення доступу до аналогічних властивостей DOM у JS (наприклад, `node.style.backgroundImage`). Вендорні префікси, [окрім `ms`](https://www.andismith.com/blogs/2012/02/modernizr-prefixed/), мають починатися з великих літер. Ось чому `WebkitTransition` має велику літеру "W".

React автоматично додасть суфікс "px" до певних числових властивостей стилю. Якщо ви хочете використовувати одиниці, відмінні від "px", вкажіть значення у вигляді рядка з бажаними одиницями вимірювання. Наприклад:

```js
// Result style: '10px'
<div style={{ height: 10 }}>
  Hello World!
</div>

// Result style: '10%'
<div style={{ height: '10%' }}>
  Hello World!
</div>
```

Але не всі властивості стилів конвертуються до рядків з пікселями. Деякі залишаються без одиниць вимірювання (наприклад, `zoom`, `order`, `flex`). Повний список властивостей без одиниць вимірювання можете переглянути [тут](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59).

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Зазвичай, існує попередження, коли елемент з дочірніми елементами позначений як `contentEditable`, оскільки це не спрацює. Цей атрибут пригнічує це попередження. Не використовуйте його, якщо ви не створюєте бібліотеку на кшталт [Draft.js](https://facebook.github.io/draft-js/), яка керує `contentEditable` вручну.

### suppressHydrationWarning {#suppresshydrationwarning}

Якщо ви використовуєте сервер-рендеринг React, зазвичай існує попередження, коли сервер і клієнт відтворюють відмінний вміст. Проте в деяких рідкісних випадках дуже важко або неможливо гарантувати точний збіг. Наприклад, очікується, що часові мітки будуть відрізнятися на сервері і на клієнті.

Якщо ви встановите `suppressHydrationWarning` на `true`, React не попередить вас про невідповідності атрибутів і вмісту цього елемента. Він працює лише на одному рівні і призначений для використання в якості "аварійного виходу". Будьте обережні з його використанням. Докладніше про гідратацію можна дізнатися в [документації до ReactDOM.hydrate()](/docs/react-dom.html#hydrate).

### value {#value}

Атрибут `value` підтримується компонентами `<input>` та `<textarea>`. Ви можете використовувати його щоб встановити значення компоненту. Це корисно для побудови контрольованих компонентів. `defaultValue` — це неконтрольований еквівалент, який встановлює значення компоненту, коли той вперше змонтовано.

## Усі підтримувані атрибути HTML {#all-supported-html-attributes}

Починаючи з React 16, будь-які стандартні атрибути DOM [або атрибути користувача](/blog/2017/09/08/dom-attributes-in-react-16.html) повністю підтримуються.

React завжди надавав JavaScript-орієнтоване API для DOM. Оскільки компоненти React часто містять як атрибути користувача, так і пов'язані з DOM пропси, React використовує `camelCase` конвенцію так само, як і DOM API:

```js
<div tabIndex="-1" />      // Так само, як і node.tabIndex DOM API
<div className="Button" /> // Так само, як і node.className DOM API
<input readOnly={true} />  // Так само, як і node.readOnly DOM API
```

Ці пропси працюють подібно до відповідних атрибутів HTML, за винятком спеціальних випадків задокументованих вище.

Деякі атрибути DOM, що підтримуються React, включають:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Відповідно, усі атрибути SVG повністю підтримуються:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

Ви також можете використовувати атрибути користувача у випадку, якщо вони повністю складаються з малих літер.
