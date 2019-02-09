import * as React from 'react';
import Timeline from '../../../src/index'
// make sure you include the timeline stylesheet or the timeline will not be styled
import '../../../lib/Timeline.css'
import * as moment from 'moment'
import AvalibilityItem from './Item/AvalibilityItem';

const groups = [
  { id: 1, title: 'Property 1', parent: null, isParent: true }, 
  { id: 2, title: 'Property 2', parent: 1, isParent: false  },
  { id: 3, title: 'Property 3', parent: 1, isParent: false },
  { id: 4, title: 'Property 4', parent: null,  isParent: false  },
]

let items = [
  {
    id: 1,
    group: 3,
    title: 'Suite',
    start_time: moment('11/01/2019','DD/MM/YYYY'),
    end_time: moment('12/01/2019','DD/MM/YYYY')
  },
  {
    id: 2,
    group: 2,
    title: '',
    start_time: moment('16/01/2019','DD/MM/YYYY'),
    end_time: moment('17/01/2019','DD/MM/YYYY')
  },
  {
    id: 3,
    group: 4,
    title: 'Cottage',
    start_time: moment('12/01/2019','DD/MM/YYYY'),
    end_time: moment('13/01/2019','DD/MM/YYYY'),
    bgColor : 'rgba(255, 255, 244, 0.6)',
  }
]

const itemRenderer = ({
  item,
  itemContext,
  getItemProps,
  getResizeProps
}) => {
  const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
  const {style, ...itemProps} = getItemProps(item.itemProps)
  return (
    <div {...itemProps} style={{...style, background: 'none', border: 'none'}} >
        <AvalibilityItem
            // key={`${room.name}_${day.format('DD-MM-YYYY')}`}
            // avalibility={[]}
            // onClick={() => this.selectDate(day)}
            // selected={day.isSame(this.state.startDay) || day.isSame(this.state.endDay)|| (day.isAfter(this.state.startDay)&& day.isBefore(this.state.endDay))}
          />
    </div>
  )
}

interface AvalibilityState {
  openGroups: any;
  selectedProperties: any;
}
interface AvalibilityProps {

}
class Avalibility extends React.Component<AvalibilityProps, AvalibilityState> {
  state = {
    openGroups: []
  }
  toggleGroup = id => {
    this.setState(({openGroups}) => ({
      openGroups: {
        ...openGroups,
        [id]: !openGroups[id]
      }
    }));
  };
  render(){
    const {
      openGroups
    } = this.state;
    const newGroups = groups.filter(g => g.parent === null || openGroups[g.parent])
      .map(group => {
        return Object.assign({}, group, {
          title:  (group.isParent) ? (
            <div
              onClick={() => this.toggleGroup(parseInt(group.id))}
              style={{ cursor: "pointer" }}
            >
              {openGroups[parseInt(group.id)] ? "[-]" : "[+]"} {group.title}
            </div>
          ) : (
            <div style={{ paddingLeft: 20 }}>{group.title}</div>
          )
        });
      });
    items = items.sort((a, b) => b - a)
    return(
      <Timeline
        sidebarContent={<div></div>}
        groups={newGroups}
        items={items}
        itemsSorted
        sidebarWidth={200}
        itemHeightRatio={1}
        lineHeight={60}
        itemRenderer={itemRenderer}
        minZoom={60*60*1000*24*21}
        defaultTimeStart={moment().add(-14, 'day')}
        defaultTimeEnd={moment().add(14, 'day')}
        />
      
    )
  }
}
export default Avalibility

