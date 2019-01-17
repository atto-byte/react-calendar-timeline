import * as React from "react";
import {
  createMarkerStylesWithLeftOffset,
  createDefaultRenderer
} from "./shared";
const defaultCustomMarkerRenderer = createDefaultRenderer(
  "default-customer-marker-id"
);
type CustomMarkerProps = {
  getLeftOffsetFromDate: (...args: any[]) => any,
  renderer?: (...args: any[]) => any,
  date: number
};
/**
 * CustomMarker that is placed based on passed in date prop
 */
class CustomMarker extends React.Component<CustomMarkerProps, {}> {
  static defaultProps = {
    renderer: defaultCustomMarkerRenderer
  };
  render() {
    const { date } = this.props;
    const leftOffset = this.props.getLeftOffsetFromDate(date);
    const styles = createMarkerStylesWithLeftOffset(leftOffset);
    return this.props.renderer({ styles, date });
  }
}
export default CustomMarker;
