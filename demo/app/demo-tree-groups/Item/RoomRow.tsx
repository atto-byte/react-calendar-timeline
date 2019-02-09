import React, { Component } from 'react';
import styled from 'styled-components';
import RoomName from './RoomName';
import moment from 'moment';
import {LineLeft, LineRight, Line, Dot} from './UnitRow';
import AvalibilityItem from './AvalibilityItem';
import Context from '../Context';
import { ItemsWrapper } from '../wrappers';

const RoomRowWrapper = styled.div`
  width:100%;
  display:flex;
`;
const CalenderWrapper = styled.div`
  overflow:hidden;
  flex-grow:1;
`;

const DayItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: ${props => parseInt(props.day) === 1 ? '1px #00000066 dashed' : ''};
`;



type Props = {
  room: Room,
};
type State = {
  startDay: moment.Moment,
  endDay: moment.Moment
};
class RoomRow extends Component<Props, State> {
  static defaultProps = {
    room: null,
  };
  constructor(props: Props) {
    super(props);
    this.state = { startDay: '', endDay: '' };
  }
  renderItems = (dates: moment.Moment[], margin) => {
    const { room } = this.props;

    return dates.map((day, i) => {
      const avalibility = room.avalibility[day.format('DD-MM-YYYY')] !== undefined ? room.avalibility[day.format('DD-MM-YYYY')] : 'Na';
      return (
        <DayItemWrapper day={day.format('DD')} >
          <AvalibilityItem
            key={`${room.name}_${day.format('DD-MM-YYYY')}`}
            avalibility={avalibility}
            onClick={() => this.selectDate(day)}
            selected={day.isSame(this.state.startDay) || day.isSame(this.state.endDay)|| (day.isAfter(this.state.startDay)&& day.isBefore(this.state.endDay))}
          />
          {this.getDayType(day, this.state.startDay, this.state.endDay)}
        </DayItemWrapper>
      );
    });
  }
  getDayType = (date, startDay, endDay) => {
    if (date.isAfter(startDay) && date.isBefore(endDay)) {
      return(
        <Line />
      );
    } else if (date.isSame(startDay)) {
      return(
        <Dot>
          <LineLeft/>
        </Dot>
      );
    } else if (date.isSame(endDay)) {
      return(
        <Dot>
          <LineRight/>
        </Dot>
      );
    }
  }
  selectDate = (date: moment.Moment) => {
    const {startDay, endDay} = this.state;
    if (startDay && endDay) {
      this.setState({startDay: date, endDay: null});
    } else if (startDay && date.isAfter(startDay)) {
      this.setState({endDay: date});
    } else if (date.isSame(startDay)) {
      this.setState({startDay: null, endDay: null});
    } else {
      this.setState({startDay: date});
    }
  }
  render() {
    const { room } = this.props;

    return (
      <RoomRowWrapper>
        <RoomName room={room} />
        <CalenderWrapper>
          <Context.Consumer>{
            ({days, margin, containerLeft}) => (
          <ItemsWrapper className="calander-days"  style={{left:`-${containerLeft}px`}}>
            {this.renderItems(days, margin)}
          </ItemsWrapper>
          )}
          </Context.Consumer>
        </CalenderWrapper>
      </RoomRowWrapper>
    );
  }
}

export default RoomRow;
