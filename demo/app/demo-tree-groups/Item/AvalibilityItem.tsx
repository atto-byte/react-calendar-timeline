import * as React from 'react';
import styled from 'styled-components';
import * as moment from 'moment';
import genPie from './getPieChart';

const DayItem = styled.div`
  position: relative;
  box-sizing: border-box;
  /* padding: 5px; */
  /* min-width: 45px !important; */
  border-radius: 50%;
  margin: 5px auto;
  height: 50px;
  width: 50px;
  text-align: center;
  line-height: 50px;
  cursor: pointer;
  color: #808080;
  font-family: 'Roboto', sans-serif;
  font-size: 20px;
`;
const SVG = styled.svg`
  overflow: visible;
  position: absolute;
  top:0;left:0;
  height: 50px;
  width: 50px;
`;

type Avalibility = {
  provisional: number,
  confirmed: number,
  avalible: number,
  total: number,
};
interface IProps {
  key: string;
  avalibility: number;
  onClick: () => void;
  selected: boolean;
  av: Avalibility;
}
interface IState {
  startDay: moment.Moment;
  endDay: moment.Moment;
}
function genPieData(avalibility: Avalibility) {
  return({
    size: 40,
    sectors: [
    {
        percentage: avalibility.provisional / avalibility.total,
        label: 'Provisional',
        color: 'orange',
    },
    {
        percentage: avalibility.confirmed / avalibility.total,
        label: 'Confirmed',
        color: 'red'
    },
    {
        percentage: avalibility.avalible / avalibility.total,
        label: 'Avalible',
        color: 'green',
    }
  ]});
}
class AvalibilityItem extends React.Component<IProps, IState> {
  static defaultProps = {
    av: {
      provisional: 2,
      confirmed: 5,
      avalible: 3,
      total: 10
    }
  };
  constructor(props: IProps) {
    super(props);
    this.state = {
      selected: 'provisional',
    };
  }
  handleMouseEnter = (selected: string) => {
    this.setState({
      selected: selected
    });
    // this.props.onClick();
  }
  handleMouseLeave = () => {
    this.setState({
      selected: 'avalible'
    });
  }
  render() {
    return (

        <DayItem>
          <SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" >
            <defs>
              <mask id="cut-out-middle" >
                <circle id="outer" cx="20" cy="20" r="20" fill="white"/>
                <circle id="inner" cx="20" cy="20" r="15" fill="black"/>
              </mask>
            </defs>
            <title>
                {this.props.av.avalible} - Avalible
                <br/>
                {this.props.av.provisional} - Provisional
                <br/>
                {this.props.av.confirmed} - Confirmed
                <br/>
            </title>
            {genPie(genPieData(this.props.av))}
          </SVG>
          <span>
            {this.props.av[this.state.selected]}
          </span>
        </DayItem>
    );
  }
}

export default AvalibilityItem;
