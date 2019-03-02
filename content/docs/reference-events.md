---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

У цьому довідковому матеріалі описана обгортка `SyntheticEvent`, яка є частиною системи подій React. Дивіться інструкцію [Обробка подій](/docs/handling-events.html) для більш детальної інформації.

## Огляд {#overview}

Ваші обробники подій отримують екземпляр `SyntheticEvent`, це кроcбраузерна обгортка над рідною подією браузеру. Вона має такий же інтерфейс, як і браузерна подія, включаючи методи `stopPropagation()` та `preventDefault()`. Ця обгортка допомагає спрацьовувати різним подіям однаково у всіх браузерах.

Якщо ви усвідомили, що вам з якоїсь причини потрібно отримати нативну браузерну подію, то ви просто можете використати атрибут `nativeEvent`. Нижче наведено перелік атрибутів об'єкта `SyntheticEvent`:

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
DOMEventTarget target
number timeStamp
string type
```

> Примітка:
>
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

> Примітка:
>
> Якщо ви все-таки хочете звернутися до властивостей події асинхронно, вам необхідно зробити виклик `event.persist()` на події. Тоді ця подія буде вилучена з пулу, в свою чергу це дозволить вашому коду утримувати посилання на цю подію.

## Підтримувані події {#supported-events}

React нормалізує події таким чином, що вони мають одинакові властивості в усіх браузерах.

Обробники, які перелічені нижче, викликаються на фазі розповсюдження (bubbling). Для того щоб зареєструвати подію на фазі перехоплення (capture), просто додайте `Capture` до імені події; наприклад, замість використання `onClick` використовуйте `onClickCapture`, для того щоб опрацювати подію на стадії перехоплення.

- [Події буфера обміну](#clipboard-events)
- [Композиційні події](#composition-events)
- [Події клавіатури](#keyboard-events)
- [Події фокусу](#focus-events)
- [Події форм](#form-events)
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

Властивість `key` може приймати будь-які із задокументованих в [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values) значень.

* * *

### Події фокусу {#focus-events}

Назви подій:

```
onFocus onBlur
```

Ці події працюють зі всіма React- та DOM-елементами, а не тільки з елементами форм.

Властивості:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Події форм {#form-events}

Назви подій:

```
onChange onInput onInvalid onSubmit
```

Для більш детальної інформації про подію onChange, відвідайте [Форми](/docs/forms.html).

* * *

### Події миші {#mouse-events}

Назви подій:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

Події `onMouseEnter` та `onMouseLeave` розповсюджуються з попереднього елементу до активного, замість звичайного процесу розповсюдженню події й не мають фази перехоплення.

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

Події `onPointerEnter` та `onPointerLeave` розповсюджуються з попереднього елементу до активного, замість звичайного процесу розповсюдженню події й не мають фази перехоплення.

Властивості:

Як вказано в [W3 spec](https://www.w3.org/TR/pointerevents/), події курсору наслідують [Mouse Events](#mouse-events) з наступними властивостями:

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

Властивості:

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
git push git@github.com:TheTonnio/uk.reactjs.org.git synthetic-event
