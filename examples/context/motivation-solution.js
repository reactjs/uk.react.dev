// highlight-range{1-4}
// Контекст дозволяє передати значення глибоко в дерево компонентів
// без явного проходження через кожен компонент.
// Створення контексту для поточної теми (з "light" за замовчуванням).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // Використовуйте компонент Provider для передачі поточної теми в дерево нижче.
    // Будь-який компонент може прочитати його, незалежно від того, наскільки він глибокий.
    // У цьому прикладі ми передаємо "dark" як поточне значення.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
// Компонент посередині не обов’язково
// передавати тему явно.
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // highlight-range{1-3,6}
  // Призначте contextType для читання контексту поточної теми.
  // React знайде найближчий постачальник теми вище та використає його значення.
  // У цьому прикладі поточна тема "dark".
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
