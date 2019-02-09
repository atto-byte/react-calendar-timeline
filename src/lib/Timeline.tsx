import * as React from "react";
import * as moment from "moment";
import Items from "./items/Items";
import InfoLabel from "./layout/InfoLabel";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import Columns from "./columns/Columns";
import GroupRows from "./row/GroupRows";
import ScrollElement from "./scroll/ScrollElement";
import MarkerCanvas from "./markers/MarkerCanvas";
import windowResizeDetector from "../resize-detector/window";
import {
  getMinUnit,
  getNextUnit,
  calculateTimeForXPosition,
  calculateScrollCanvas,
  getCanvasBoundariesFromVisibleTime,
  getCanvasWidth,
  stackTimelineItems
} from "./utility/calendar";
import { _get, _length } from "./utility/generic";
import {
  defaultKeys,
  defaultTimeSteps,
  defaultHeaderLabelFormats,
  defaultSubHeaderLabelFormats
} from "./default-config";
import { TimelineStateProvider } from "./timeline/TimelineStateContext";
import { TimelineMarkersProvider } from "./markers/TimelineMarkersContext";
export type ReactCalendarTimelineProps = {
  groups: any[] | object,
  items: any[] | object,
  sidebarWidth?: number,
  sidebarContent?: React.ReactNode,
  rightSidebarWidth?: number,
  rightSidebarContent?: React.ReactNode,
  dragSnap?: number,
  minResizeWidth?: number,
  stickyOffset?: number,
  stickyHeader?: boolean,
  lineHeight?: number,
  headerLabelGroupHeight?: number,
  headerLabelHeight?: number,
  itemHeightRatio?: number,
  minZoom?: number,
  maxZoom?: number,
  clickTolerance?: number,
  canChangeGroup?: boolean,
  canMove?: boolean,
  canResize?: any,
  useResizeHandle?: boolean,
  canSelect?: boolean,
  stackItems?: boolean,
  traditionalZoom?: boolean,
  itemTouchSendsClick?: boolean,
  horizontalLineClassNamesForGroup?: (...args: any[]) => any,
  onItemMove?: (...args: any[]) => any,
  onItemResize?: (...args: any[]) => any,
  onItemClick?: (...args: any[]) => any,
  onItemSelect?: (...args: any[]) => any,
  onItemDeselect?: (...args: any[]) => any,
  onCanvasClick?: (...args: any[]) => any,
  onItemDoubleClick?: (...args: any[]) => any,
  onItemContextMenu?: (...args: any[]) => any,
  onCanvasDoubleClick?: (...args: any[]) => any,
  onCanvasContextMenu?: (...args: any[]) => any,
  onZoom?: (...args: any[]) => any,
  moveResizeValidator?: (...args: any[]) => any,
  itemRenderer?: (...args: any[]) => any,
  groupRenderer?: (...args: any[]) => any,
  style?: object,
  keys?: {
    groupIdKey?: string,
    groupTitleKey?: string,
    groupLabelKey?: string,
    groupRightTitleKey?: string,
    itemIdKey?: string,
    itemTitleKey?: string,
    itemDivTitleKey?: string,
    itemGroupKey?: string,
    itemTimeStartKey?: string,
    itemTimeEndKey?: string
  },
  headerRef?: (...args: any[]) => any,
  scrollRef?: (...args: any[]) => any,
  timeSteps?: {
    second?: number,
    minute?: number,
    hour?: number,
    day?: number,
    month?: number,
    year?: number
  },
  defaultTimeStart?: object,
  defaultTimeEnd?: object,
  visibleTimeStart?: number,
  visibleTimeEnd?: number,
  onTimeChange?: (...args: any[]) => any,
  onBoundsChange?: (...args: any[]) => any,
  selected?: any[],
  headerLabelFormats?: {
    yearShort?: string,
    yearLong?: string,
    monthShort?: string,
    monthMedium?: string,
    monthMediumLong?: string,
    monthLong?: string,
    dayShort?: string,
    dayLong?: string,
    hourShort?: string,
    hourMedium?: string,
    hourMediumLong?: string,
    hourLong?: string
  },
  subHeaderLabelFormats?: {
    yearShort?: string,
    yearLong?: string,
    monthShort?: string,
    monthMedium?: string,
    monthLong?: string,
    dayShort?: string,
    dayMedium?: string,
    dayMediumLong?: string,
    dayLong?: string,
    hourShort?: string,
    hourLong?: string,
    minuteShort?: string,
    minuteLong?: string
  },
  resizeDetector?: {
    addListener?: (...args: any[]) => any,
    removeListener?: (...args: any[]) => any
  },
  verticalLineClassNamesForTime?: (...args: any[]) => any
};
export type ReactCalendarTimelineState = {
  width: number,
  visibleTimeStart: any,
  visibleTimeEnd: any,
  canvasTimeStart: any,
  canvasTimeEnd: any,
  selectedItem: null,
  dragTime: null,
  dragGroupTitle: null,
  resizeTime: null,
  resizingItem: null,
  resizingEdge: null
};
export default class ReactCalendarTimeline extends React.Component<
  ReactCalendarTimelineProps,
  ReactCalendarTimelineState
> {
  static defaultProps = {
    sidebarWidth: 150,
    rightSidebarWidth: 0,
    dragSnap: 1000 * 60 * 15,
    minResizeWidth: 20,
    stickyOffset: 0,
    stickyHeader: true,
    lineHeight: 30,
    headerLabelGroupHeight: 30,
    headerLabelHeight: 30,
    itemHeightRatio: 0.65,
    minZoom: 60 * 60 * 1000,
    maxZoom: 5 * 365.24 * 86400 * 1000,
    clickTolerance: 3,
    canChangeGroup: true,
    canMove: true,
    canResize: "right",
    useResizeHandle: false,
    canSelect: true,
    stackItems: false,
    traditionalZoom: false,
    horizontalLineClassNamesForGroup: null,
    onItemMove: null,
    onItemResize: null,
    onItemClick: null,
    onItemSelect: null,
    onItemDeselect: null,
    onCanvasClick: null,
    onItemDoubleClick: null,
    onItemContextMenu: null,
    onZoom: null,
    verticalLineClassNamesForTime: null,
    moveResizeValidator: null,
    dayBackground: null,
    defaultTimeStart: null,
    defaultTimeEnd: null,
    itemTouchSendsClick: false,
    style: {},
    keys: defaultKeys,
    timeSteps: defaultTimeSteps,
    headerRef: () => {},
    scrollRef: () => {},
    // if you pass in visibleTimeStart and visibleTimeEnd, you must also pass onTimeChange(visibleTimeStart, visibleTimeEnd),
    // which needs to update the props visibleTimeStart and visibleTimeEnd to the ones passed
    visibleTimeStart: null,
    visibleTimeEnd: null,
    onTimeChange: function(
      visibleTimeStart,
      visibleTimeEnd,
      updateScrollCanvas
    ) {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    },
    // called when the canvas area of the calendar changes
    onBoundsChange: null,
    children: null,
    headerLabelFormats: defaultHeaderLabelFormats,
    subHeaderLabelFormats: defaultSubHeaderLabelFormats,
    selected: null
  };
  lastTouchDistance: null;
  scrollComponent: any;
  scrollHeaderRef: any;
  container: any;
  headerRef: any;
  static childContextTypes = {
    getTimelineContext: Function
  };
  getChildContext() {
    return {
      getTimelineContext: () => {
        return this.getTimelineContext();
      }
    };
  }
  getTimelineContext = () => {
    const {
      width,
      visibleTimeStart,
      visibleTimeEnd,
      canvasTimeStart,
      canvasTimeEnd
    } = this.state;
    return {
      timelineWidth: width,
      visibleTimeStart,
      visibleTimeEnd,
      canvasTimeStart,
      canvasTimeEnd
    };
  };
  constructor(props: ReactCalendarTimelineProps) {
    super(props);
    let visibleTimeStart = null;
    let visibleTimeEnd = null;
    if (props.defaultTimeStart && props.defaultTimeEnd) {
      visibleTimeStart = props.defaultTimeStart.valueOf();
      visibleTimeEnd = props.defaultTimeEnd.valueOf();
    } else if (props.visibleTimeStart && props.visibleTimeEnd) {
      visibleTimeStart = props.visibleTimeStart;
      visibleTimeEnd = props.visibleTimeEnd;
    } else {
      //throwing an error because neither default or visible time props provided
      throw new Error(
        'You must provide either "defaultTimeStart" and "defaultTimeEnd" or "visibleTimeStart" and "visibleTimeEnd" to initialize the Timeline'
      );
    }
    const [canvasTimeStart, canvasTimeEnd] = getCanvasBoundariesFromVisibleTime(
      visibleTimeStart,
      visibleTimeEnd
    );
    this.state = {
      width: 1000,
      visibleTimeStart: visibleTimeStart,
      visibleTimeEnd: visibleTimeEnd,
      canvasTimeStart: canvasTimeStart,
      canvasTimeEnd: canvasTimeEnd,
      selectedItem: null,
      dragTime: null,
      dragGroupTitle: null,
      resizeTime: null,
      resizingItem: null,
      resizingEdge: null
    };
    const canvasWidth = getCanvasWidth(this.state.width);
    const {
      dimensionItems,
      height,
      groupHeights,
      groupTops
    } = stackTimelineItems(
      props.items,
      props.groups,
      canvasWidth,
      this.state.canvasTimeStart,
      this.state.canvasTimeEnd,
      props.keys,
      props.lineHeight,
      props.itemHeightRatio,
      props.stackItems,
      this.state.draggingItem,
      this.state.resizingItem,
      this.state.dragTime,
      this.state.resizingEdge,
      this.state.resizeTime,
      this.state.newGroupOrder
    );
    /* eslint-disable react/no-direct-mutation-state */
    this.state.dimensionItems = dimensionItems;
    this.state.height = height;
    this.state.groupHeights = groupHeights;
    this.state.groupTops = groupTops;
    /* eslint-enable */
  }
  componentDidMount() {
    this.resize(this.props);
    if (this.props.resizeDetector && this.props.resizeDetector.addListener) {
      this.props.resizeDetector.addListener(this);
    }
    windowResizeDetector.addListener(this);
    this.lastTouchDistance = null;
  }
  componentWillUnmount() {
    if (this.props.resizeDetector && this.props.resizeDetector.addListener && this.props.resizeDetector.removeListener) {
      this.props.resizeDetector.removeListener(this);
    }
    windowResizeDetector.removeListener(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const { visibleTimeStart, visibleTimeEnd, items, groups } = nextProps;
    // This is a gross hack pushing items and groups in to state only to allow
    // For the forceUpdate check
    let derivedState = { items, groups };
    // if the items or groups have changed we must re-render
    const forceUpdate =
      items !== prevState.items || groups !== prevState.groups;
    // We are a controlled component
    if (visibleTimeStart && visibleTimeEnd) {
      // Get the new canvas position
      Object.assign(
        derivedState,
        calculateScrollCanvas(
          visibleTimeStart,
          visibleTimeEnd,
          forceUpdate,
          items,
          groups,
          nextProps,
          prevState
        )
      );
    } else if (forceUpdate) {
      // Calculate new item stack position as canvas may have changed
      const canvasWidth = getCanvasWidth(prevState.width);
      Object.assign(
        derivedState,
        stackTimelineItems(
          items,
          groups,
          canvasWidth,
          prevState.canvasTimeStart,
          prevState.canvasTimeEnd,
          nextProps.keys,
          nextProps.lineHeight,
          nextProps.itemHeightRatio,
          nextProps.stackItems,
          prevState.draggingItem,
          prevState.resizingItem,
          prevState.dragTime,
          prevState.resizingEdge,
          prevState.resizeTime,
          prevState.newGroupOrder
        )
      );
    }
    return derivedState;
  }
  componentDidUpdate(prevProps, prevState) {
    const newZoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
    const oldZoom = prevState.visibleTimeEnd - prevState.visibleTimeStart;
    // are we changing zoom? Report it!
    if (this.props.onZoom && newZoom !== oldZoom) {
      this.props.onZoom(this.getTimelineContext());
    }
    // The bounds have changed? Report it!
    if (
      this.props.onBoundsChange &&
      this.state.canvasTimeStart !== prevState.canvasTimeStart
    ) {
      this.props.onBoundsChange(
        this.state.canvasTimeStart,
        this.state.canvasTimeStart + newZoom * 3
      );
    }
    // Check the scroll is correct
    const scrollLeft = Math.round(
      (this.state.width *
        (this.state.visibleTimeStart - this.state.canvasTimeStart)) /
        newZoom
    );
    if (this.scrollComponent.scrollLeft !== scrollLeft) {
      this.scrollComponent.scrollLeft = scrollLeft;
    }
    if (this.scrollHeaderRef.scrollLeft !== scrollLeft) {
      this.scrollHeaderRef.scrollLeft = scrollLeft;
    }
  }
  resize = (props = this.props) => {
    const { width: containerWidth } = this.container.getBoundingClientRect();
    let width = containerWidth - props.sidebarWidth - props.rightSidebarWidth;
    const canvasWidth = getCanvasWidth(width);
    const {
      dimensionItems,
      height,
      groupHeights,
      groupTops
    } = stackTimelineItems(
      props.items,
      props.groups,
      canvasWidth,
      this.state.canvasTimeStart,
      this.state.canvasTimeEnd,
      props.keys,
      props.lineHeight,
      props.itemHeightRatio,
      props.stackItems,
      this.state.draggingItem,
      this.state.resizingItem,
      this.state.dragTime,
      this.state.resizingEdge,
      this.state.resizeTime,
      this.state.newGroupOrder
    );
    // this is needed by dragItem since it uses pageY from the drag events
    // if this was in the context of the scrollElement, this would not be necessary
    this.setState({
      width,
      dimensionItems,
      height,
      groupHeights,
      groupTops
    });
    this.scrollComponent.scrollLeft = width;
    this.headerRef.scrollLeft = width;
  };
  onScroll = scrollX => {
    const width = this.state.width;
    let newScrollX = scrollX;
    // move the virtual canvas if needed
    // if scrollX is less...i dont know how to explain the logic here
    if (newScrollX < width * 0.5) {
      newScrollX += width;
    }
    if (newScrollX > width * 1.5) {
      newScrollX -= width;
    }
    this.headerRef.scrollLeft = newScrollX;
    this.scrollComponent.scrollLeft = newScrollX;
    const canvasTimeStart = this.state.canvasTimeStart;
    const zoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
    const visibleTimeStart = canvasTimeStart + (zoom * scrollX) / width;
    if (
      this.state.visibleTimeStart !== visibleTimeStart ||
      this.state.visibleTimeEnd !== visibleTimeStart + zoom
    ) {
      this.props.onTimeChange && this.props.onTimeChange(
        visibleTimeStart,
        visibleTimeStart + zoom,
        this.updateScrollCanvas
      );
    }
  };
  // called when the visible time changes
  updateScrollCanvas = (
    visibleTimeStart,
    visibleTimeEnd,
    forceUpdateDimensions,
    items = this.props.items,
    groups = this.props.groups
  ) => {
    this.setState(
      calculateScrollCanvas(
        visibleTimeStart,
        visibleTimeEnd,
        forceUpdateDimensions,
        items,
        groups,
        this.props,
        this.state
      )
    );
  };
  handleWheelZoom = (speed, xPosition, deltaY) => {
    this.changeZoom(1.0 + (speed * deltaY) / 500, xPosition / this.state.width);
  };
  changeZoom = (scale, offset = 0.5) => {
    const { minZoom, maxZoom } = this.props;
    const oldZoom = this.state.visibleTimeEnd - this.state.visibleTimeStart;
    const newZoom = Math.min(
      Math.max(Math.round(oldZoom * scale), minZoom),
      maxZoom
    ); // min 1 min, max 20 years
    const newVisibleTimeStart = Math.round(
      this.state.visibleTimeStart + (oldZoom - newZoom) * offset
    );
    this.props.onTimeChange && this.props.onTimeChange(
      newVisibleTimeStart,
      newVisibleTimeStart + newZoom,
      this.updateScrollCanvas
    );
  };
  showPeriod = (from, unit) => {
    let visibleTimeStart = from.valueOf();
    let visibleTimeEnd = moment(from)
      .add(1, unit)
      .valueOf();
    let zoom = visibleTimeEnd - visibleTimeStart;
    // can't zoom in more than to show one hour
    if (zoom < 360000) {
      return;
    }
    // clicked on the big header and already focused here, zoom out
    if (
      unit !== "year" &&
      this.state.visibleTimeStart === visibleTimeStart &&
      this.state.visibleTimeEnd === visibleTimeEnd
    ) {
      let nextUnit = getNextUnit(unit);
      visibleTimeStart = from.startOf(nextUnit).valueOf();
      visibleTimeEnd = moment(visibleTimeStart).add(1, nextUnit);
      zoom = visibleTimeEnd - visibleTimeStart;
    }
    this.props.onTimeChange && this.props.onTimeChange(
      visibleTimeStart,
      visibleTimeStart + zoom,
      this.updateScrollCanvas
    );
  };
  selectItem = (item, clickType, e) => {
    if (
      this.state.selectedItem === item ||
      (this.props.itemTouchSendsClick && clickType === "touch")
    ) {
      if (item && this.props.onItemClick) {
        const time = this.timeFromItemEvent(e);
        this.props.onItemClick(item, e, time);
      }
    } else {
      this.setState({ selectedItem: item });
      if (item && this.props.onItemSelect) {
        const time = this.timeFromItemEvent(e);
        this.props.onItemSelect(item, e, time);
      } else if (item === null && this.props.onItemDeselect) {
        this.props.onItemDeselect(e); // this isnt in the docs. Is this function even used?
      }
    }
  };
  doubleClickItem = (item, e) => {
    if (this.props.onItemDoubleClick) {
      const time = this.timeFromItemEvent(e);
      this.props.onItemDoubleClick(item, e, time);
    }
  };
  contextMenuClickItem = (item, e) => {
    if (this.props.onItemContextMenu) {
      const time = this.timeFromItemEvent(e);
      this.props.onItemContextMenu(item, e, time);
    }
  };
  // TODO: this is very similar to timeFromItemEvent, aside from which element to get offsets
  // from.  Look to consolidate the logic for determining coordinate to time
  // as well as generalizing how we get time from click on the canvas
  getTimeFromRowClickEvent = e => {
    const { dragSnap } = this.props;
    const { width, canvasTimeStart, canvasTimeEnd } = this.state;
    // this gives us distance from left of row element, so event is in
    // context of the row element, not client or page
    const { offsetX } = e.nativeEvent;
    let time = calculateTimeForXPosition(
      canvasTimeStart,
      canvasTimeEnd,
      getCanvasWidth(width),
      offsetX
    );
    time = Math.floor(time / dragSnap) * dragSnap;
    return time;
  };
  timeFromItemEvent = e => {
    const { width, visibleTimeStart, visibleTimeEnd } = this.state;
    const { dragSnap } = this.props;
    const scrollComponent = this.scrollComponent;
    const { left: scrollX } = scrollComponent.getBoundingClientRect();
    const xRelativeToTimeline = e.clientX - scrollX;
    const relativeItemPosition = xRelativeToTimeline / width;
    const zoom = visibleTimeEnd - visibleTimeStart;
    const timeOffset = relativeItemPosition * zoom;
    let time = Math.round(visibleTimeStart + timeOffset);
    time = Math.floor(time / dragSnap) * dragSnap;
    return time;
  };
  dragItem = (item, dragTime, newGroupOrder) => {
    let newGroup = this.props.groups[newGroupOrder];
    const keys = this.props.keys;
    this.setState({
      draggingItem: item,
      dragTime: dragTime,
      newGroupOrder: newGroupOrder,
      dragGroupTitle: newGroup ? _get(newGroup, keys.groupLabelKey) : ""
    });
  };
  dropItem = (item, dragTime, newGroupOrder) => {
    this.setState({ draggingItem: null, dragTime: null, dragGroupTitle: null });
    if (this.props.onItemMove) {
      this.props.onItemMove(item, dragTime, newGroupOrder);
    }
  };
  resizingItem = (item, resizeTime, edge) => {
    this.setState({
      resizingItem: item,
      resizingEdge: edge,
      resizeTime: resizeTime
    });
  };
  resizedItem = (item, resizeTime, edge, timeDelta) => {
    this.setState({ resizingItem: null, resizingEdge: null, resizeTime: null });
    if (this.props.onItemResize && timeDelta !== 0) {
      this.props.onItemResize(item, resizeTime, edge);
    }
  };
  columns(
    canvasTimeStart,
    canvasTimeEnd,
    canvasWidth,
    minUnit,
    timeSteps,
    height
  ) {
    return (
      <Columns
        canvasTimeStart={canvasTimeStart}
        canvasTimeEnd={canvasTimeEnd}
        canvasWidth={canvasWidth}
        lineCount={_length(this.props.groups)}
        minUnit={minUnit}
        timeSteps={timeSteps}
        height={height}
        verticalLineClassNamesForTime={this.props.verticalLineClassNamesForTime}
      />
    );
  }
  handleRowClick = (e, rowIndex) => {
    // shouldnt this be handled by the user, as far as when to deselect an item?
    if (this.state.selectedItem) {
      this.selectItem(null);
    }
    if (this.props.onCanvasClick == null) return;
    const time = this.getTimeFromRowClickEvent(e);
    const groupId = _get(
      this.props.groups[rowIndex],
      this.props.keys.groupIdKey
    );
    this.props.onCanvasClick(groupId, time, e);
  };
  handleRowDoubleClick = (e, rowIndex) => {
    if (this.props.onCanvasDoubleClick == null) return;
    const time = this.getTimeFromRowClickEvent(e);
    const groupId = _get(
      this.props.groups[rowIndex],
      this.props.keys.groupIdKey
    );
    this.props.onCanvasDoubleClick(groupId, time, e);
  };
  handleScrollContextMenu = (e, rowIndex) => {
    if (this.props.onCanvasContextMenu == null) return;
    const timePosition = this.getTimeFromRowClickEvent(e);
    const groupId = _get(
      this.props.groups[rowIndex],
      this.props.keys.groupIdKey
    );
    if (this.props.onCanvasContextMenu) {
      e.preventDefault();
      this.props.onCanvasContextMenu(groupId, timePosition, e);
    }
  };
  rows(canvasWidth, groupHeights, groups) {
    return (
      <GroupRows
        groups={groups}
        canvasWidth={canvasWidth}
        lineCount={_length(this.props.groups)}
        groupHeights={groupHeights}
        clickTolerance={this.props.clickTolerance}
        onRowClick={this.handleRowClick}
        onRowDoubleClick={this.handleRowDoubleClick}
        horizontalLineClassNamesForGroup={
          this.props.horizontalLineClassNamesForGroup
        }
        onRowContextClick={this.handleScrollContextMenu}
      />
    );
  }
  items(
    canvasTimeStart,
    zoom,
    canvasTimeEnd,
    canvasWidth,
    minUnit,
    dimensionItems,
    groupHeights,
    groupTops
  ) {
    return (
      <Items
        canvasTimeStart={canvasTimeStart}
        canvasTimeEnd={canvasTimeEnd}
        canvasWidth={canvasWidth}
        dimensionItems={dimensionItems}
        groupTops={groupTops}
        items={this.props.items}
        groups={this.props.groups}
        keys={this.props.keys}
        selectedItem={this.state.selectedItem}
        dragSnap={this.props.dragSnap}
        minResizeWidth={this.props.minResizeWidth}
        canChangeGroup={this.props.canChangeGroup}
        canMove={this.props.canMove}
        canResize={this.props.canResize}
        useResizeHandle={this.props.useResizeHandle}
        canSelect={this.props.canSelect}
        moveResizeValidator={this.props.moveResizeValidator}
        itemSelect={this.selectItem}
        itemDrag={this.dragItem}
        itemDrop={this.dropItem}
        onItemDoubleClick={this.doubleClickItem}
        onItemContextMenu={this.contextMenuClickItem}
        itemResizing={this.resizingItem}
        itemResized={this.resizedItem}
        itemRenderer={this.props.itemRenderer}
        selected={this.props.selected}
        scrollRef={this.scrollComponent}
      />
    );
  }
  infoLabel() {
    let label = null;
    if (this.state.dragTime) {
      label = `${moment(this.state.dragTime).format("LLL")}, 
        ${this.state.dragGroupTitle}`;
    } else if (this.state.resizeTime) {
      label = moment(this.state.resizeTime).format("LLL");
    }
    return label ? <InfoLabel label={label} /> : undefined;
  }
  handleHeaderRef = el => {
    this.headerRef = el;
    this.props.headerRef(el);
  };
  handleScrollHeaderRef = el => {
    this.scrollHeaderRef = el;
  };
  header(
    canvasTimeStart,
    canvasTimeEnd,
    canvasWidth,
    minUnit,
    timeSteps,
    headerLabelGroupHeight,
    headerLabelHeight,
  ) {
    return (
      <Header
        canvasTimeStart={canvasTimeStart}
        hasRightSidebar={this.props.rightSidebarWidth > 0}
        canvasTimeEnd={canvasTimeEnd}
        canvasWidth={canvasWidth}
        minUnit={minUnit}
        timeSteps={timeSteps}
        headerLabelGroupHeight={headerLabelGroupHeight}
        headerLabelHeight={headerLabelHeight}
        width={this.props.sidebarContent ? (this.state.width): (this.state.width + this.props.sidebarWidth)}
        stickyOffset={this.props.stickyOffset}
        stickyHeader={this.props.stickyHeader}
        showPeriod={this.showPeriod}
        headerLabelFormats={this.props.headerLabelFormats}
        subHeaderLabelFormats={this.props.subHeaderLabelFormats}
        headerRef={this.handleHeaderRef}
        scrollHeaderRef={this.handleScrollHeaderRef}
        leftSidebarWidth={this.props.sidebarWidth}
        rightSidebarWidth={this.props.rightSidebarWidth}
        leftSidebarHeader={this.props.sidebarContent}
        rightSidebarHeader={this.props.rightSidebarContent}
      />
    );
  }
  sidebar(height, groupHeights) {
    const { sidebarWidth } = this.props;
    return (
      sidebarWidth && (
        <Sidebar
          groups={this.props.groups}
          groupRenderer={this.props.groupRenderer}
          keys={this.props.keys}
          width={sidebarWidth}
          groupHeights={groupHeights}
          height={height}
        />
      )
    );
  }
  rightSidebar(height, groupHeights) {
    const { rightSidebarWidth } = this.props;
    return (
      rightSidebarWidth && (
        <Sidebar
          groups={this.props.groups}
          keys={this.props.keys}
          groupRenderer={this.props.groupRenderer}
          isRightSidebar
          width={rightSidebarWidth}
          groupHeights={groupHeights}
          height={height}
        />
      )
    );
  }
  childrenWithProps(
    canvasTimeStart,
    canvasTimeEnd,
    canvasWidth,
    dimensionItems,
    groupHeights,
    groupTops,
    height,
    headerHeight,
    visibleTimeStart,
    visibleTimeEnd,
    minUnit,
    timeSteps
  ) {
    if (!this.props.children) {
      return null;
    }
    // convert to an array and remove the nulls
    const childArray = Array.isArray(this.props.children)
      ? this.props.children.filter(c => c)
      : [this.props.children];
    const childProps = {
      canvasTimeStart,
      canvasTimeEnd,
      canvasWidth,
      visibleTimeStart: visibleTimeStart,
      visibleTimeEnd: visibleTimeEnd,
      dimensionItems,
      items: this.props.items,
      groups: this.props.groups,
      keys: this.props.keys,
      groupHeights: groupHeights,
      groupTops: groupTops,
      selected:
        this.state.selectedItem && !this.props.selected
          ? [this.state.selectedItem]
          : this.props.selected || [],
      height: height,
      headerHeight: headerHeight,
      minUnit: minUnit,
      timeSteps: timeSteps
    };
    return React.Children.map(childArray, child =>
      React.cloneElement(child, childProps)
    );
  }
  render() {
    const {
      items,
      groups,
      headerLabelGroupHeight,
      headerLabelHeight,
      sidebarWidth,
      rightSidebarWidth,
      timeSteps,
      traditionalZoom
    } = this.props;
    const {
      draggingItem,
      resizingItem,
      width,
      visibleTimeStart,
      visibleTimeEnd,
      canvasTimeStart,
      canvasTimeEnd
    } = this.state;
    let { dimensionItems, height, groupHeights, groupTops } = this.state;
    const zoom = visibleTimeEnd - visibleTimeStart;
    const canvasWidth = getCanvasWidth(width);
    const minUnit = getMinUnit(zoom, width, timeSteps);
    const headerHeight = headerLabelGroupHeight + headerLabelHeight;
    const isInteractingWithItem = !!draggingItem || !!resizingItem;
    if (isInteractingWithItem) {
      const stackResults = stackTimelineItems(
        items,
        groups,
        canvasWidth,
        this.state.canvasTimeStart,
        this.state.canvasTimeEnd,
        this.props.keys,
        this.props.lineHeight,
        this.props.itemHeightRatio,
        this.props.stackItems,
        this.state.draggingItem,
        this.state.resizingItem,
        this.state.dragTime,
        this.state.resizingEdge,
        this.state.resizeTime,
        this.state.newGroupOrder
      );
      dimensionItems = stackResults.dimensionItems;
      height = stackResults.height;
      groupHeights = stackResults.groupHeights;
      groupTops = stackResults.groupTops;
    }
    const outerComponentStyle = {
      height: `${height}px`
    };
    return (
      <TimelineStateProvider
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        canvasTimeStart={canvasTimeStart}
        canvasTimeEnd={canvasTimeEnd}
        canvasWidth={canvasWidth}
      >
        <TimelineMarkersProvider>
          <div
            style={this.props.style}
            ref={el => (this.container = el)}
            className="react-calendar-timeline"
          >
            {this.header(
              canvasTimeStart,
              canvasTimeEnd,
              canvasWidth,
              minUnit,
              timeSteps,
              headerLabelGroupHeight,
              headerLabelHeight,
            )}
            {sidebarWidth > 0 &&
              this.sidebar(height, groupHeights, headerHeight)}
            <div style={{ display: "inline-block" }}>
              <div style={outerComponentStyle} className="rct-outer">
                <ScrollElement
                  scrollRef={el => {
                    this.props.scrollRef(el);
                    this.scrollComponent = el;
                  }}
                  width={width}
                  height={height}
                  onZoom={this.changeZoom}
                  onWheelZoom={this.handleWheelZoom}
                  traditionalZoom={traditionalZoom}
                  onScroll={this.onScroll}
                  isInteractingWithItem={isInteractingWithItem}
                >
                  <MarkerCanvas>
                    {this.items(
                      canvasTimeStart,
                      zoom,
                      canvasTimeEnd,
                      canvasWidth,
                      minUnit,
                      dimensionItems,
                      groupHeights,
                      groupTops
                    )}
                    {this.columns(
                      canvasTimeStart,
                      canvasTimeEnd,
                      canvasWidth,
                      minUnit,
                      timeSteps,
                      height,
                      headerHeight
                    )}
                    {this.rows(canvasWidth, groupHeights, groups)}
                    {this.infoLabel()}
                    {this.childrenWithProps(
                      canvasTimeStart,
                      canvasTimeEnd,
                      canvasWidth,
                      dimensionItems,
                      groupHeights,
                      groupTops,
                      height,
                      headerHeight,
                      visibleTimeStart,
                      visibleTimeEnd,
                      minUnit,
                      timeSteps
                    )}
                  </MarkerCanvas>
                </ScrollElement>
              </div>
            </div>
            {rightSidebarWidth > 0 &&
              this.rightSidebar(height, groupHeights, headerHeight)}
          </div>
        </TimelineMarkersProvider>
      </TimelineStateProvider>
    );
  }
}
