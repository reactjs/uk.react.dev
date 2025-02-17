---
title: Інструменти розробника React
---

<Intro>

Використовуйте інструменти розробника React (_React Developer Tools_) для інспектування React [компонентів](/learn/your-first-component), редагування їх [пропсів](/learn/passing-props-to-a-component) і [стану](/learn/state-a-components-memory), а також для виявлення проблем з продуктивністю.

</Intro>

<YouWillLearn>

* Як встановити інструменти розробника React

</YouWillLearn>

## Розширення браузера {/*browser-extension*/}

Найпростіший спосіб налагодження вебсайтів, створених за допомогою React — встановити розширення браузера "Інструменти розробника React" (_React Developer Tools_). Воно доступне для декількох популярних браузерів:

* [Встановити для **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=uk)
* [Встановити для **Firefox**](https://addons.mozilla.org/uk/firefox/addon/react-devtools/)
* [Встановити для **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil?hl=uk)

Тепер, якщо ви відвідаєте вебсайт, **який створений за допомогою React**, ви побачите вкладки _Components_ і _Profiler_.

![Розширення 'Інструменти розробника React'](/images/docs/react-devtools-extension.png)

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

![Автономні 'Інструменти розробника React'](/images/docs/react-devtools-standalone.png)

## Мобільний застосунок (React Native) {/*mobile-react-native*/}

Для інспектування застосунків, створених за допомогою [React Native](https://reactnative.dev/), можна використовувати [інструменти розробника React Native](https://reactnative.dev/docs/react-native-devtools) — вбудований налагоджувач, який глибоко інтегрує інструменти розробника React. Усі функції працюють так само, як у розширенні браузера, включно з підсвічуванням та виділенням нативних елементів.

[Дізнатися більше про налагодження React Native.](https://reactnative.dev/docs/debugging)

> Для версій React Native до 0.76, будь ласка, використовуйте автономну (standalone) збірку інструментів розробника React за інструкцією у пункті ["Safari та інші браузери"](#safari-and-other-browsers) вище.