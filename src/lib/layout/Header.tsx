import * as React from "react";
import TimelineElementsHeader from "./TimelineElementsHeader";
type HeaderProps = {
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
  stickyOffset?: number,
  stickyHeader: boolean,
  headerLabelGroupHeight: number,
  headerLabelHeight: number,
  leftSidebarHeader?: React.ReactNode,
  rightSidebarHeader?: React.ReactNode,
  leftSidebarWidth?: number,
  rightSidebarWidth?: number,
  headerRef: (...args: any[]) => any,
  scrollHeaderRef: (...args: any[]) => any
};
class Header extends React.Component<HeaderProps, {}> {
  render() {
    const {
      width,
      stickyOffset,
      stickyHeader,
      headerRef,
      scrollHeaderRef,
      hasRightSidebar,
      showPeriod,
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      minUnit,
      timeSteps,
      headerLabelFormats,
      subHeaderLabelFormats,
      headerLabelGroupHeight,
      headerLabelHeight,
      leftSidebarHeader,
      rightSidebarHeader,
      leftSidebarWidth,
      rightSidebarWidth
    } = this.props;
    const headerStyle = {
      top: stickyHeader ? stickyOffset || 0 : 0
    };
    const headerClass = stickyHeader ? "header-sticky" : "";
    const leftSidebar = leftSidebarHeader && leftSidebarWidth > 0 && (
      <div className="rct-sidebar-header" style={{ width: leftSidebarWidth }}>
        {leftSidebarHeader}
      </div>
    );
    const rightSidebar = rightSidebarHeader && rightSidebarWidth > 0 && (
      <div
        className="rct-sidebar-header rct-sidebar-right"
        style={{ width: rightSidebarWidth }}
      >
        {rightSidebarHeader}
      </div>
    );
    return (
      <div
        className={`rct-header-container ${headerClass}`}
        data-testid="timeline-elements-container"
        ref={headerRef}
        style={headerStyle}
      >
        {leftSidebar}
        <div style={{ width }} data-testid="timeline-elements-header-container">
          <TimelineElementsHeader
            data-testid="timeline-elements-header"
            hasRightSidebar={hasRightSidebar}
            showPeriod={showPeriod}
            canvasTimeStart={canvasTimeStart}
            canvasTimeEnd={canvasTimeEnd}
            canvasWidth={canvasWidth}
            minUnit={minUnit}
            timeSteps={timeSteps}
            width={width}
            headerLabelFormats={headerLabelFormats}
            subHeaderLabelFormats={subHeaderLabelFormats}
            headerLabelGroupHeight={headerLabelGroupHeight}
            headerLabelHeight={headerLabelHeight}
            scrollHeaderRef={scrollHeaderRef}
          />
        </div>
        {rightSidebar}
      </div>
    );
  }
}
export default Header;
