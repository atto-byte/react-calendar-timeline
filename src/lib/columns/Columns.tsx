import * as React from "react";
import { iterateTimes } from "../utility/calendar";
type ColumnsProps = {
  canvasTimeStart: number,
  canvasTimeEnd: number,
  canvasWidth: number,
  lineCount: number,
  minUnit: string,
  timeSteps: object,
  height: number,
  verticalLineClassNamesForTime?: (...args: any[]) => any
};
export default class Columns extends React.Component<ColumnsProps, {}> {
  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.canvasTimeStart === this.props.canvasTimeStart &&
      nextProps.canvasTimeEnd === this.props.canvasTimeEnd &&
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.lineCount === this.props.lineCount &&
      nextProps.minUnit === this.props.minUnit &&
      nextProps.timeSteps === this.props.timeSteps &&
      nextProps.height === this.props.height &&
      nextProps.verticalLineClassNamesForTime ===
        this.props.verticalLineClassNamesForTime
    );
  }
  render() {
    const {
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      minUnit,
      timeSteps,
      height,
      verticalLineClassNamesForTime
    } = this.props;
    const ratio = canvasWidth / (canvasTimeEnd - canvasTimeStart);
    let lines = [];
    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      (time, nextTime) => {
        const left = Math.round((time.valueOf() - canvasTimeStart) * ratio, -2);
        const minUnitValue = time.get(minUnit === "day" ? "date" : minUnit);
        const firstOfType = minUnitValue === (minUnit === "day" ? 1 : 0);
        const lineWidth = firstOfType ? 2 : 1;
        const labelWidth =
          Math.ceil((nextTime.valueOf() - time.valueOf()) * ratio) - lineWidth;
        const leftPush = firstOfType ? -1 : 0;
        let classNamesForTime = [];
        if (verticalLineClassNamesForTime) {
          classNamesForTime = verticalLineClassNamesForTime(
            time.unix() * 1000, // turn into ms, which is what verticalLineClassNamesForTime expects
            nextTime.unix() * 1000 - 1
          );
        }
        // TODO: rename or remove class that has reference to vertical-line
        const classNames =
          "rct-vl" +
          (firstOfType ? " rct-vl-first" : "") +
          (minUnit === "day" || minUnit === "hour" || minUnit === "minute"
            ? ` rct-day-${time.day()} `
            : "") +
          classNamesForTime.join(" ");
        lines.push(
          <div
            key={`line-${time.valueOf()}`}
            className={classNames}
            style={{
              pointerEvents: "none",
              top: "0px",
              left: `${left + leftPush}px`,
              width: `${labelWidth}px`,
              height: `${height}px`
            }}
          />
        );
      }
    );
    return <div className="rct-vertical-lines">{lines}</div>;
  }
}
