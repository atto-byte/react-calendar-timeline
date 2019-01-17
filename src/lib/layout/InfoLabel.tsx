import * as React from "react";
type InfoLabelProps = {
  label: string
};
export default class InfoLabel extends React.Component<InfoLabelProps, {}> {
  static defaultProps = {
    label: ""
  };
  shouldComponentUpdate(nextProps) {
    const { label: nextLabel } = nextProps;
    return nextLabel !== this.props.label;
  }
  render() {
    return <div className="rct-infolabel">{this.props.label}</div>;
  }
}
