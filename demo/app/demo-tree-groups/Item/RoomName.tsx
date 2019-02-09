import * as React from 'react';
import styled from 'styled-components';

const RoomNameWrapper = styled.div`
    display:flex;
    justify-content: space-between;
    margin:10px 5px;
    min-width:240px;
    line-height:32px;
    height:32px;
    font-size:20px;
    color:#808080;
    padding:5px 10px;
    background-color: var(--text);
    border-width: 1px;
    & > div {
      color:var(--background);
    }
`;
type Props = {
  room: Room,
}
const RoomName = (props: Props) => {
  const { room } = props;
  return (
    <RoomNameWrapper>
      <div style={{ display: 'inline-block' }}>
        {room.name}
      </div>
      <div style={{
            display: 'flex', fontSize: '12px', flexDirection: 'column',
        }}
      >
        <div style={{ lineHeight: '10px' }}>
          {`Max Capacity - ${room.max_capacity}`}
        </div>
        <div>
          {`Max Adults - ${room.max_adults}`}
        </div>

      </div>
    </RoomNameWrapper>
  );
};

export default RoomName;
