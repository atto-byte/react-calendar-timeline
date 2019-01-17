import * as React from "react";
import { TimelineMarkersConsumer } from "../TimelineMarkersContext";
import { TimelineMarkerType } from "../markerType";
type TodayMarkerProps = {
  subscribeMarker: (...args: any[]) => any,
  updateMarker: (...args: any[]) => any,
  interval?: number
};
class TodayMarker extends React.Component<TodayMarkerProps, {}> {
  static defaultProps = {
    interval: 1000 * 10 // default to ten seconds
  };
  componentDidMount() {
    const { unsubscribe, getMarker } = this.props.subscribeMarker({
      type: TimelineMarkerType.Today,
      renderer: this.props.children,
      interval: this.props.interval
    });
    this.unsubscribe = unsubscribe;
    this.getMarker = getMarker;
  }
  componentWillUnmount() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.interval !== this.props.interval && this.getMarker) {
      const marker = this.getMarker();
      this.props.updateMarker({
        ...marker,
        interval: this.props.interval
      });
    }
  }
  render() {
    return null;
  }
}
// TODO: turn into HOC?
const TodayMarkerWrapper = props => {
  return (
    <TimelineMarkersConsumer>
      {({ subscribeMarker, updateMarker }) => (
        <TodayMarker
          subscribeMarker={subscribeMarker}
          updateMarker={updateMarker}
          {...props}
        />
      )}
    </TimelineMarkersConsumer>
  );
};
TodayMarkerWrapper.displayName = "TodayMarkerWrapper";
export default TodayMarkerWrapper;
