class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // Компонент Toolbar має приймати додатковий проп "theme"
  // та передавати його в ThemedButton. Це може стати проблемою
  // якщо кожна окрема кнопка в додатку повинна знати тему
  // оскільки його потрібно було б пропустити через усі компоненти.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
