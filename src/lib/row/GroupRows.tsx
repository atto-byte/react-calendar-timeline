import * as React from "react";
import GroupRow from "./GroupRow";
type GroupRowsProps = {
  canvasWidth: number,
  lineCount: number,
  groupHeights: any[],
  onRowClick: (...args: any[]) => any,
  onRowDoubleClick: (...args: any[]) => any,
  clickTolerance: number,
  groups: any[],
  horizontalLineClassNamesForGroup?: (...args: any[]) => any,
  onRowContextClick: (...args: any[]) => any
};
export default class GroupRows extends React.Component<GroupRowsProps, {}> {
  shouldComponentUpdate(nextProps) {
    return !(
      nextProps.canvasWidth === this.props.canvasWidth &&
      nextProps.lineCount === this.props.lineCount &&
      nextProps.groupHeights === this.props.groupHeights &&
      nextProps.groups === this.props.groups
    );
  }
  render() {
    const {
      canvasWidth,
      lineCount,
      groupHeights,
      onRowClick,
      onRowDoubleClick,
      clickTolerance,
      groups,
      horizontalLineClassNamesForGroup,
      onRowContextClick
    } = this.props;
    let lines = [];
    for (let i = 0; i < lineCount; i++) {
      lines.push(
        <GroupRow
          clickTolerance={clickTolerance}
          onContextMenu={evt => onRowContextClick(evt, i)}
          onClick={evt => onRowClick(evt, i)}
          onDoubleClick={evt => onRowDoubleClick(evt, i)}
          key={`horizontal-line-${i}`}
          isEvenRow={i % 2 === 0}
          group={groups[i]}
          horizontalLineClassNamesForGroup={horizontalLineClassNamesForGroup}
          style={{
            width: `${canvasWidth}px`,
            height: `${groupHeights[i] - 1}px`
          }}
        />
      );
    }
    return <div className="rct-horizontal-lines">{lines}</div>;
  }
}
