import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
`;

export const Line = styled.div`
  text-align: center;
  position: relative;
  width: 100%;
  margin: auto;
  margin-bottom: 15px;
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    border-top: 1px solid #00bcd4;
    background: #00bcd4;
    width: 100%;
    transform: translateY(-50%);
  }
`;

export const LineLeft = styled.div`
  content: '';
  position: absolute;
  top: 50%;
  right: -29.75px;
  border-top: 1px solid #00bcd4;
  background: #00bcd4;
  width: 29.75px;
  transform: translateY(-50%);
`;

export const LineRight = styled.div`
  content: '';
  position: absolute;
  top: 50%;
  left: -29.75px;
  border-top: 1px solid #00bcd4;
  background: #00bcd4;
  width: 29.75px;
  transform: translateY(-50%);
`;

export const Dot = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
  border-radius:50%;
  background: #db7093;
  margin: 4px 7.5px;
`;

const Slider = () => (
  <Wrapper>
    <Dot>
      <LineLeft />
    </Dot>
    <Line />
    <Dot>
      <LineRight />
    </Dot>
  </Wrapper>
);

export default Slider;

