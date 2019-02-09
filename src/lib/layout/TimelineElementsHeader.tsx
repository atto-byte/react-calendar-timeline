import * as React from "react";
import * as moment from "moment";
import { iterateTimes, getNextUnit } from "../utility/calendar";
import { useEffect } from "react";
type TimelineElementsHeaderProps = {
  hasRightSidebar: boolean,
  showPeriod: (...args: any[]) => any,
  canvasTimeStart: number,
  canvasTimeEnd: number,
  canvasWidth: number,
  minUnit: string,
  timeSteps: object,
  width: number,
  headerLabelFormats: object,
  subHeaderLabelFormats: object,
  headerLabelGroupHeight: number,
  headerLabelHeight: number,
  scrollHeaderRef: (...args: any[]) => any
};
type TimelineElementsHeaderState = {
  touchTarget: null,
  touchActive: boolean
};
const TimelineElementsHeader = (props: TimelineElementsHeaderProps) => {
  const [touchTarget, setTouchTarget] = React.useState(null);
  const [touchActive, setTouchActive] = React.useState(false);
  
  const handleHeaderMouseDown = (evt) => {
    //dont bubble so that we prevent our scroll component
    //from knowing about it
    evt.stopPropagation();
  }
  const headerLabel = (time, unit, width) => {
    const { headerLabelFormats: f } = props;
    if (unit === "year") {
      return time.format(width < 46 ? f.yearShort : f.yearLong);
    } else if (unit === "month") {
      return time.format(
        width < 65
          ? f.monthShort
          : width < 75
          ? f.monthMedium
          : width < 120
          ? f.monthMediumLong
          : f.monthLong
      );
    } else if (unit === "day") {
      return time.format(width < 150 ? f.dayShort : f.dayLong);
    } else if (unit === "hour") {
      return time.format(
        width < 50
          ? f.hourShort
          : width < 130
          ? f.hourMedium
          : width < 150
          ? f.hourMediumLong
          : f.hourLong
      );
    } else {
      return time.format(f.time);
    }
  }
  const subHeaderLabel = (time, unit, width) => {
    const { subHeaderLabelFormats: f } = props;
    if (unit === "year") {
      return time.format(width < 46 ? f.yearShort : f.yearLong);
    } else if (unit === "month") {
      return time.format(
        width < 37 ? f.monthShort : width < 85 ? f.monthMedium : f.monthLong
      );
    } else if (unit === "day") {
      return time.format(
        width < 47
          ? f.dayShort
          : width < 80
          ? f.dayMedium
          : width < 120
          ? f.dayMediumLong
          : f.dayLong
      );
    } else if (unit === "hour") {
      return time.format(width < 50 ? f.hourShort : f.hourLong);
    } else if (unit === "minute") {
      return time.format(width < 60 ? f.minuteShort : f.minuteLong);
    } else {
      return time.get(unit);
    }
  }
  const handlePeriodClick = (time, unit) => {
    if (time && unit) {
      props.showPeriod(moment(time - 0), unit);
    }
  };

  useEffect(() => {

  })

  const {
    canvasTimeStart,
    canvasTimeEnd,
    canvasWidth,
    minUnit,
    timeSteps,
    headerLabelGroupHeight,
    headerLabelHeight,
    hasRightSidebar
  } = props;
  const ratio = canvasWidth / (canvasTimeEnd - canvasTimeStart);
  const twoHeaders = minUnit !== "year";
  const topHeaderLabels = [];
  // add the top header
    if (twoHeaders) {
      const nextUnit = getNextUnit(minUnit);
      iterateTimes(
        canvasTimeStart,
        canvasTimeEnd,
        nextUnit,
        timeSteps,
        (time, nextTime) => {
          const left = Math.round((time.valueOf() - canvasTimeStart) * ratio);
          const right = Math.round(
            (nextTime.valueOf() - canvasTimeStart) * ratio
          );
          const labelWidth = right - left;
          // this width applies to the content in the header
          // it simulates stickyness where the content is fixed in the center
          // of the label.  when the labelWidth is less than visible time range,
          // have label content fill the entire width
          const contentWidth = Math.min(labelWidth, canvasWidth);
          topHeaderLabels.push(
            <div
              key={`top-label-${time.valueOf()}`}
              className={`rct-label-group${
                hasRightSidebar ? " rct-has-right-sidebar" : ""
              }`}
              onClick={() => handlePeriodClick(time, nextUnit)}
              style={{
                left: `${left - 1}px`,
                width: `${labelWidth}px`,
                height: `${headerLabelGroupHeight}px`,
                lineHeight: `${headerLabelGroupHeight}px`,
                cursor: "pointer"
              }}
            >
              <span style={{ width: contentWidth, display: "block" }}>
                {headerLabel(time, nextUnit, labelWidth)}
              </span>
            </div>
          );
        }
      );
    }
    const bottomHeaderLabels = [];
    iterateTimes(
      canvasTimeStart,
      canvasTimeEnd,
      minUnit,
      timeSteps,
      (time, nextTime) => {
        const left = Math.round((time.valueOf() - canvasTimeStart) * ratio);
        const minUnitValue = time.get(minUnit === "day" ? "date" : minUnit);
        const firstOfType = minUnitValue === (minUnit === "day" ? 1 : 0);
        const labelWidth = Math.round(
          (nextTime.valueOf() - time.valueOf()) * ratio
        );
        const leftCorrect = firstOfType ? 1 : 0;
        bottomHeaderLabels.push(
          <div
            key={`label-${time.valueOf()}`}
            className={`rct-label ${twoHeaders ? "" : "rct-label-only"} ${
              firstOfType ? "rct-first-of-type" : ""
            } ${minUnit !== "month" ? `rct-day-${time.day()}` : ""} `}
            onClick={() => handlePeriodClick(time, minUnit)}
            style={{
              left: `${left - leftCorrect}px`,
              width: `${labelWidth}px`,
              height: `${
                minUnit === "year"
                  ? headerLabelGroupHeight + headerLabelHeight
                  : headerLabelHeight
              }px`,
              lineHeight: `${
                minUnit === "year"
                  ? headerLabelGroupHeight + headerLabelHeight
                  : headerLabelHeight
              }px`,
              fontSize: `${
                labelWidth > 30 ? "14" : labelWidth > 20 ? "12" : "10"
              }px`,
              cursor: "pointer"
            }}
          >
            {subHeaderLabel(time, minUnit, labelWidth)}
          </div>
        );
      }
    );
    let headerStyle = {
      height: `${headerLabelGroupHeight + headerLabelHeight}px`
    };
    return (
      <div
        key="header"
        data-testid="header"
        className="rct-header"
        onMouseDown={handleHeaderMouseDown}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        style={headerStyle}
        ref={props.scrollHeaderRef}
      >
        <div
          className="rct-top-header"
          style={{
            height: twoHeaders ? headerLabelGroupHeight : 0,
            width: canvasWidth
          }}
        >
          {topHeaderLabels}
        </div>
        <div
          className="rct-bottom-header"
          style={{ height: headerLabelHeight, width: canvasWidth }}
        >
          {bottomHeaderLabels}
        </div>
      </div>
    );
  }
}
export default TimelineElementsHeader