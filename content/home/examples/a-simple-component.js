class HelloMessage extends React.Component {
  render() {
    return <div>Привіт, {this.props.name}</div>;
  }
}

root.render(<HelloMessage name="Taylor" />);
