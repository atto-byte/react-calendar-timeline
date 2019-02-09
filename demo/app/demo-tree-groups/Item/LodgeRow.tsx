import * as React from 'react';
import styled from 'styled-components';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import RoomRow from './RoomRow';


const RoomsWrapper = styled.div`
  display:flex;
  flex-direction: column;
  overflow:hidden;
`;


type Props = {
  lodge: Lodge,
};

const LodgeRow: React.SFC<Props> = (props = {
  dates: [],
  lodge: null,
  margin: 5
}) => {
  const {
    lodge
  } = props;
  return <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{lodge.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <RoomsWrapper>
            {lodge.rooms.map(room => <RoomRow room={room} />)}
          </RoomsWrapper>
        </ExpansionPanelDetails>
      </ExpansionPanel>;
};

export default LodgeRow;
