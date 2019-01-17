import * as React from "react";
import PreventClickOnDrag from "../interaction/PreventClickOnDrag";
type GroupRowProps = {
  onClick: (...args: any[]) => any,
  onDoubleClick: (...args: any[]) => any,
  onContextMenu: (...args: any[]) => any,
  isEvenRow: boolean,
  style: object,
  clickTolerance: number,
  group: object,
  horizontalLineClassNamesForGroup?: (...args: any[]) => any
};
class GroupRow extends React.Component<GroupRowProps, {}> {
  render() {
    const {
      onContextMenu,
      onDoubleClick,
      isEvenRow,
      style,
      onClick,
      clickTolerance,
      horizontalLineClassNamesForGroup,
      group
    } = this.props;
    let classNamesForGroup = [];
    if (horizontalLineClassNamesForGroup) {
      classNamesForGroup = horizontalLineClassNamesForGroup(group);
    }
    return (
      <PreventClickOnDrag clickTolerance={clickTolerance} onClick={onClick}>
        <div
          onContextMenu={onContextMenu}
          onDoubleClick={onDoubleClick}
          className={
            (isEvenRow ? "rct-hl-even " : "rct-hl-odd ") +
            (classNamesForGroup ? classNamesForGroup.join(" ") : "")
          }
          style={style}
        />
      </PreventClickOnDrag>
    );
  }
}
export default GroupRow;
