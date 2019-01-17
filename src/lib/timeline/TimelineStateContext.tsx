import * as React from "react";
import createReactContext from "create-react-context";
import {
  calculateXPositionForTime,
  calculateTimeForXPosition
} from "../utility/calendar";
/* this context will hold all information regarding timeline state:
  1. timeline width
  2. visible time start and end
  3. canvas time start and end
  4. helpers for calculating left offset of items (and really...anything)
*/
/* eslint-disable no-console */
const defaultContextState = {
  getTimelineState: () => {
    console.warn('"getTimelineState" default func is being used');
  },
  getLeftOffsetFromDate: () => {
    console.warn('"getLeftOffsetFromDate" default func is being used');
  },
  getDateFromLeftOffsetPosition: () => {
    console.warn('"getDateFromLeftOffsetPosition" default func is being used');
  }
};
/* eslint-enable */
const { Consumer, Provider } = createReactContext(defaultContextState);
export type TimelineStateProviderProps = {
  visibleTimeStart: number,
  visibleTimeEnd: number,
  canvasTimeStart: number,
  canvasTimeEnd: number,
  canvasWidth: number
};
export type TimelineStateProviderState = {
  timelineContext: {
    getTimelineState: () => any,
    getLeftOffsetFromDate: (date: any) => any,
    getDateFromLeftOffsetPosition: (leftOffset: any) => any
  },
  timelineState: any
};
export class TimelineStateProvider extends React.Component<
  TimelineStateProviderProps,
  TimelineStateProviderState
> {
  constructor(props: TimelineStateProviderProps) {
    super(props);
    this.state = {
      timelineContext: {
        getTimelineState: this.getTimelineState,
        getLeftOffsetFromDate: this.getLeftOffsetFromDate,
        getDateFromLeftOffsetPosition: this.getDateFromLeftOffsetPosition
      },
      timelineState: null
    };
  }
  getTimelineState = () => {
    return this.state.timelineState; // REVIEW: return copy or object.freeze?
  };
  getLeftOffsetFromDate = date => {
    const { canvasTimeStart, canvasTimeEnd, canvasWidth } = this.props;
    return calculateXPositionForTime(
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      date
    );
  };
  getDateFromLeftOffsetPosition = leftOffset => {
    const { canvasTimeStart, canvasTimeEnd, canvasWidth } = this.props;
    return calculateTimeForXPosition(
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      leftOffset
    );
  };
  render() {
    return (
      <Provider value={this.state.timelineContext}>
        {this.props.children}
      </Provider>
    );
  }
}
export const TimelineStateConsumer = Consumer;
