import * as React from "react";
type PreventClickOnDragProps = {
  onClick: (...args: any[]) => any,
  clickTolerance: number
};
class PreventClickOnDrag extends React.Component<PreventClickOnDragProps, {}> {
  handleMouseDown = evt => {
    this.originClickX = evt.clientX;
  };
  handleMouseUp = evt => {
    if (Math.abs(this.originClickX - evt.clientX) > this.props.clickTolerance) {
      this.cancelClick = true;
    }
  };
  handleClick = evt => {
    if (!this.cancelClick) {
      this.props.onClick(evt);
    }
    this.cancelClick = false;
    this.originClickX = null;
  };
  render() {
    const childElement = React.Children.only(this.props.children);
    return React.cloneElement(childElement, {
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      onClick: this.handleClick
    });
  }
}
export default PreventClickOnDrag;
