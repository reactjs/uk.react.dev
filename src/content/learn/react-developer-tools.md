---
title: Інструменти React розробника
---

<Intro>

Використовуйте інструменти React розробника (_React Developer Tools_) для інспектування React [компонентів](/learn/your-first-component), редагування їх [пропсів](/learn/passing-props-to-a-component) і [стану](/learn/state-a-components-memory), а також для виявлення проблем з продуктивністю.

</Intro>

<YouWillLearn>

* Як встановити інструменти React розробника

</YouWillLearn>

## Розширення браузера {/*browser-extension*/}

Найпростіший спосіб налагодження вебсайтів, створених за допомогою React — встановити розширення браузера "Інструменти React розробника" (_React Developer Tools_). Воно доступне для декількох популярних браузерів:

* [Встановити для **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=uk)
* [Встановити для **Firefox**](https://addons.mozilla.org/uk/firefox/addon/react-devtools/)
* [Встановити для **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil?hl=uk)

Тепер, якщо ви відвідаєте вебсайт, **який створений за допомогою React**, ви побачите вкладки _Components_ і _Profiler_.

![Розширення 'Інструменти React розробника'](/images/docs/react-devtools-extension.png)

### Safari та інші браузери {/*safari-and-other-browsers*/}
Для інших браузерів (наприклад, Safari) встановіть npm-пакет [`react-devtools`](https://www.npmjs.com/package/react-devtools):
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Далі відкрийте інструменти розробника з терміналу:
```bash
react-devtools
```

Потім під'єднайте ваш вебсайт, вказавши наступний тег `<script>` на початку елементу `<head>` у коді вашого вебсайту:
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Перезавантажте вебсайт у браузері, щоб переглянути його в інструментах розробника.

![Автономні 'Інструменти React розробника'](/images/docs/react-devtools-standalone.png)

<<<<<<< HEAD
## Мобільний застосунок (React Native) {/*mobile-react-native*/}
Інструменти React розробника також можна використовувати для інспектування застосунків, створених за допомогою [React Native](https://reactnative.dev/).

Найпростіший спосіб використання інструментів — встановити їх глобально:
```bash
# Yarn
yarn global add react-devtools
=======
## Mobile (React Native) {/*mobile-react-native*/}

To inspect apps built with [React Native](https://reactnative.dev/), you can use [React Native DevTools](https://reactnative.dev/docs/debugging/react-native-devtools), the built-in debugger that deeply integrates React Developer Tools. All features work identically to the browser extension, including native element highlighting and selection.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

[Learn more about debugging in React Native.](https://reactnative.dev/docs/debugging)

<<<<<<< HEAD
Далі відкрийте інструменти розробника з терміналу:
```bash
react-devtools
```

Вони повинні під'єднатися до будь-якого локально працюючого застосунку React Native.

> Спробуйте перезавантажити застосунок, якщо інструменти розробки не під'єднуються протягом кількох секунд.

[Дізнатися більше про налагодження React Native.](https://reactnative.dev/docs/debugging)
=======
> For versions of React Native earlier than 0.76, please use the standalone build of React DevTools by following the [Safari and other browsers](#safari-and-other-browsers) guide above.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
