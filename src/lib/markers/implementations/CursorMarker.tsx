import * as React from "react";
import {
  createMarkerStylesWithLeftOffset,
  createDefaultRenderer
} from "./shared";
import { MarkerCanvasConsumer } from "../MarkerCanvasContext";
const defaultRenderer = createDefaultRenderer("default-cursor-marker");
type CursorMarkerProps = {
  subscribeToCanvasMouseOver: (...args: any[]) => any,
  renderer?: (...args: any[]) => any
};
type CursorMarkerState = {
  leftOffset: number,
  date: number,
  isShowingCursor: boolean
};
/**
 * CursorMarker implementation subscribes to 'subscribeToCanvasMouseOver' on mount.
 * This subscription is passed in via MarkerCanvasConsumer, which is wired up to
 * MarkerCanvasProvider in the MarkerCanvas component. When the user mouses over MarkerCanvas,
 * the callback registered in CursorMarker (this component) is passed:
 *  leftOffset - pixels from left edge of canvas, used to position this element
 *  date - the date the cursor pertains to
 *  isCursorOverCanvas - whether the user cursor is over the canvas. This is set to 'false'
 *  when the user mouseleaves the element
 */
class CursorMarker extends React.Component<
  CursorMarkerProps,
  CursorMarkerState
> {
  static defaultProps = {
    renderer: defaultRenderer
  };
  constructor() {
    super();
    this.state = {
      leftOffset: 0,
      date: 0,
      isShowingCursor: false
    };
  }
  handleCanvasMouseOver = ({ leftOffset, date, isCursorOverCanvas }) => {
    this.setState({
      leftOffset,
      date,
      isShowingCursor: isCursorOverCanvas
    });
  };
  componentDidMount() {
    this.unsubscribe = this.props.subscribeToCanvasMouseOver(
      this.handleCanvasMouseOver
    );
  }
  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
  render() {
    const { isShowingCursor, leftOffset, date } = this.state;
    if (!isShowingCursor) return null;
    const styles = createMarkerStylesWithLeftOffset(leftOffset);
    return this.props.renderer({ styles, date });
  }
}
// TODO: turn into HOC?
const CursorMarkerWrapper = props => {
  return (
    <MarkerCanvasConsumer>
      {({ subscribeToMouseOver }) => {
        return (
          <CursorMarker
            subscribeToCanvasMouseOver={subscribeToMouseOver}
            {...props}
          />
        );
      }}
    </MarkerCanvasConsumer>
  );
};
CursorMarkerWrapper.displayName = "CursorMarkerWrapper";
export default CursorMarkerWrapper;
