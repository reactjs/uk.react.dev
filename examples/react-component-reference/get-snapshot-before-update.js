class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Чи додаємо ми нові позиції у список?
    // Захоплюємо позицію прокрутки, щоб можна було налаштувати прокрутку пізніше.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Якщо ми маємо значення знімку, ми лише додаємо нові позиції.
    // Налаштувати прокрутку так, що ці нові позиції не зсунуть попередні з зони огляду.
    // (snapshot тут — це значення повернуте з getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...вміст... */}</div>
    );
  }
}
