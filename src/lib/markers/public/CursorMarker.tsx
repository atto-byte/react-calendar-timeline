import * as React from "react";
import { TimelineMarkersConsumer } from "../TimelineMarkersContext";
import { TimelineMarkerType } from "../markerType";
type CursorMarkerProps = {
  subscribeMarker: (...args: any[]) => any
};
class CursorMarker extends React.Component<CursorMarkerProps, {}> {
  componentDidMount() {
    const { unsubscribe } = this.props.subscribeMarker({
      type: TimelineMarkerType.Cursor,
      renderer: this.props.children
    });
    this.unsubscribe = unsubscribe;
  }
  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
  render() {
    return null;
  }
}
// TODO: turn into HOC?
const CursorMarkerWrapper = props => {
  return (
    <TimelineMarkersConsumer>
      {({ subscribeMarker }) => (
        <CursorMarker subscribeMarker={subscribeMarker} {...props} />
      )}
    </TimelineMarkersConsumer>
  );
};
CursorMarkerWrapper.displayName = "CursorMarkerWrapper";
export default CursorMarkerWrapper;
