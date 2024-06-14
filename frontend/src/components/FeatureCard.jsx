import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  padding: 30px;
  background-color: #fff;
  border: 1px solid #000000;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: background-color 0.3s;
  &:hover {
    background-color: #e0f7fa;
  }
`;

const CardTitle = styled.h2`
  color: ${({ color }) => color};
  font-size: 18px;
`;

const CardDescription = styled.p`
  margin: 10px 0;
  color: #555;
`;

const Arrow = styled.div`
  align-self: flex-end;
  color: #000000;
`;

const FeatureCard = ({ feature }) => {
  return (
    <CardContainer>
      <CardTitle color={feature.color}>{feature.title}</CardTitle>
      <CardDescription>{feature.description}</CardDescription>
      <Arrow>→</Arrow>
    </CardContainer>
  );
};

export default FeatureCard;
