class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Замість того, щоб експортувати FancyButton, ми експортуємо LogProps.
// При цьому рендеритись буде FancyButton.
// highlight-next-line
export default logProps(FancyButton);
