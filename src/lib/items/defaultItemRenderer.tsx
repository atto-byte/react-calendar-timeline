import * as React from "react";
type defaultItemRendererProps = {
  item?: any,
  itemContext?: any,
  getItemProps?: any,
  getResizeProps?: any
};
export const defaultItemRenderer: React.SFC<defaultItemRendererProps> = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps
}) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
  return (
    <div {...getItemProps(item.itemProps)}>
      {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ""}

      <div
        className="rct-item-content"
        style={{ maxHeight: `${itemContext.dimensions.height}` }}
      >
        {itemContext.title}
      </div>

      {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ""}
    </div>
  );
};
