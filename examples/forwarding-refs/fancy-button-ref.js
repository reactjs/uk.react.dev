import FancyButton from './FancyButton';

// highlight-next-line
const ref = React.createRef();

// Компонент FancyButton, який ми імпортуємо - це КВП LogProps.
// Навіть, якщо результат рендерингу буде таким же самим,
// Наш реф буде вказувати на LogProps, а не на внутрішній компонент FancyButton!
// Це означає, що ми, наприклад, не можемо викликати ref.current.focus()
// highlight-range{4}
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
