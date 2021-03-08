---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

У цьому довідковому матеріалі описана обгортка `SyntheticEvent`, яка є частиною системи подій React. Дивіться інструкцію [Обробка подій](/docs/handling-events.html) для більш детальної інформації.

## Огляд {#overview}

Ваші обробники подій отримують екземпляр SyntheticEvent — кроcбраузерну обгортку над нативною подією браузера. Вона має такий же інтерфейс, як і браузерна подія, включаючи методи `stopPropagation()` та `preventDefault()`. Ця обгортка допомагає спрацьовувати різним подіям однаково у всіх браузерах.

Якщо ви усвідомили, що вам з якоїсь причини потрібно отримати нативну браузерну подію, то ви просто можете використати атрибут `nativeEvent`. Синтетичні події відрізняються від нативних подій браузера. Наприклад, в `onMouseLeave` `event.nativeEvent` вказуватиме на подію `mouseout`. Конкретне відображення не є частиною загальнодоступного API і може змінитися в будь-який час. Нижче наведено перелік атрибутів об'єкта `SyntheticEvent`:

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
void persist()
DOMEventTarget target
number timeStamp
string type
```

> Примітка:
>
<<<<<<< HEAD
> Починаючи з версії v0.14, повернення `false` з обробника подій більше не припиняє розповсюдження події. Замість цього вам потрібно самотужки викликати `e.stopPropagation()` або `e.preventDefault()`.

### Пул подій {#event-pooling}

Події `SyntheticEvent` містяться в пулі. Це означає, що об'єкт `SyntheticEvent` буде використаний знову, а також всі його властивості будуть очищені після спрацювання функції зворотнього виклику події.
Це було зроблено з міркувань збереження продуктивності.
Таким чином, ви не можете отримати доступ до події асинхронним способом.

```javascript
function onClick(event) {
  console.log(event); // => очищений об'єкт.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Не спрацює. this.state.clickEvent зберігає тільки пусті значення.
  this.setState({clickEvent: event});

  // Ви все ще можете експортувати властивості події.
  this.setState({eventType: event.type});
}
```
=======
> As of v17, `e.persist()` doesn't do anything because the `SyntheticEvent` is no longer [pooled](/docs/legacy-event-pooling.html).
>>>>>>> 9df266413be637705d78688ffdd3697e89b102d1

> Примітка:
>
<<<<<<< HEAD
> Якщо ви все-таки хочете звернутися до властивостей події асинхронно, вам необхідно зробити виклик `event.persist()` на події. Тоді ця подія буде вилучена з пулу, в свою чергу це дозволить вашому коду утримувати посилання на цю подію.

## Підтримувані події {#supported-events}

React нормалізує події таким чином, що вони мають одинакові властивості в усіх браузерах.

Обробники, які перелічені нижче, викликаються на фазі розповсюдження (bubbling). Для того щоб зареєструвати подію на фазі перехоплення (capture), просто додайте `Capture` до імені події; наприклад, замість використання `onClick` використовуйте `onClickCapture`, для того щоб опрацювати подію на стадії перехоплення.

- [Події буфера обміну](#clipboard-events)
- [Композиційні події](#composition-events)
- [Події клавіатури](#keyboard-events)
- [Події фокусу](#focus-events)
- [Події форм](#form-events)
- [Загальні Events](#generic-events)
- [Події миші](#mouse-events)
- [Події курсору](#pointer-events)
- [Події вибору](#selection-events)
- [Сенсорні події](#touch-events)
- [Події інтерфейсу користувача](#ui-events)
- [Події коліщатка миші](#wheel-events)
- [Події медіа-елементів](#media-events)
- [Події зображень](#image-events)
- [Події анімацій](#animation-events)
- [Події переходів](#transition-events)
- [Інші події](#other-events)
=======
> As of v0.14, returning `false` from an event handler will no longer stop event propagation. Instead, `e.stopPropagation()` or `e.preventDefault()` should be triggered manually, as appropriate.

## Supported Events {#supported-events}

React normalizes events so that they have consistent properties across different browsers.

The event handlers below are triggered by an event in the bubbling phase. To register an event handler for the capture phase, append `Capture` to the event name; for example, instead of using `onClick`, you would use `onClickCapture` to handle the click event in the capture phase.

- [Clipboard Events](#clipboard-events)
- [Composition Events](#composition-events)
- [Keyboard Events](#keyboard-events)
- [Focus Events](#focus-events)
- [Form Events](#form-events)
- [Generic Events](#generic-events)
- [Mouse Events](#mouse-events)
- [Pointer Events](#pointer-events)
- [Selection Events](#selection-events)
- [Touch Events](#touch-events)
- [UI Events](#ui-events)
- [Wheel Events](#wheel-events)
- [Media Events](#media-events)
- [Image Events](#image-events)
- [Animation Events](#animation-events)
- [Transition Events](#transition-events)
- [Other Events](#other-events)
>>>>>>> 9df266413be637705d78688ffdd3697e89b102d1

* * *

## Довідка {#reference}

### Події буфера обміну {#clipboard-events}

Назви подій:

```
onCopy onCut onPaste
```

Властивості:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Композиційні події {#composition-events}

Назви подій:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Властивості:

```javascript
string data

```

* * *

### Події клавіатури {#keyboard-events}

Назви подій:

```
onKeyDown onKeyPress onKeyUp
```

Властивості:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

Властивість `key` може приймати будь-які із задокументованих у [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values) значень.

* * *

### Події фокусу {#focus-events}

Назви подій:

```
onFocus onBlur
```

Ці події працюють зі всіма React- та DOM-елементами, а не тільки з елементами форм.

Властивості:

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving {#detecting-focus-entering-and-leaving}

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```

* * *

### Події форм {#form-events}

Назви подій:

```
onChange onInput onInvalid onReset onSubmit 
```

Для більш детальної інформації про подію onChange, відвідайте [Форми](/docs/forms.html).

* * *

### Загальні Події {#generic-events}

Назви подій:

```
onError onLoad
```

* * *

### Події миші {#mouse-events}

Назви подій:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

Події `onMouseEnter` та `onMouseLeave` розповсюджуються з попереднього елементу до активного, замість звичайного процесу розповсюдження події, а також не мають фази перехоплення.

Властивості:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### Події курсору {#pointer-events}

Назви подій:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

Події `onPointerEnter` та `onPointerLeave` розповсюджуються з попереднього елементу до активного, замість звичайного процесу розповсюдження події, а також не мають фази перехоплення.

Властивості:

Як вказано у [W3 spec](https://www.w3.org/TR/pointerevents/), події курсору наслідують [Mouse Events](#mouse-events) з наступними властивостями:

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

Примітка з приводу кросбраузерності:

Події курсору ще не підтримуються всіма браузерами (на момент написання цієї статті підтримуються браузери: Chrome, Firefox, Edge, and Internet Explorer). React свідомо не поліфілізує підтримку в інших браузерах тому що це значно би збільшило розмір `react-dom`.

Якщо вашому застосунку необхідно використовувати події курсору, то ми радимо встановити сторонній поліфіл.

* * *

### Події вибору {#selection-events}

Назви подій:

```
onSelect
```

* * *

### Сенсорні події {#touch-events}

Назви подій:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Властивості:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### Події інтерфейсу користувача {#ui-events}

Назви подій:

```
onScroll
```

<<<<<<< HEAD
Властивості:
=======
>Note
>
>Starting with React 17, the `onScroll` event **does not bubble** in React. This matches the browser behavior and prevents the confusion when a nested scrollable element fires events on a distant parent.

Properties:
>>>>>>> 9df266413be637705d78688ffdd3697e89b102d1

```javascript
number detail
DOMAbstractView view
```

* * *

### Події коліщатка миші {#wheel-events}

Назви подій:

```
onWheel
```

Властивості:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Події медіа-елементів {#media-events}

Назви подій:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Події зображень {#image-events}

Назви подій:

```
onLoad onError
```

* * *

### Події анімацій {#animation-events}

Назви подій:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Властивості:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Події переходів {#transition-events}

Назви подій:

```
onTransitionEnd
```

Властивості:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Інші події {#other-events}

Назви подій:

```
onToggle
```
