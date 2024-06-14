import React from 'react';
import styled from 'styled-components';

const ListContainer = styled.ul`
  margin-top: 50px;
  margin-bottom: 50px;
  list-style-type: none;
  padding: 0;
  width: 96%;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 20px;
  text-align: left;
  margin: 5px 0;
  color: #4caf50;
  width: 100%;
`;

const CheckIcon = styled.span`
  font-size: 20px;
  margin-right: 10px;
`;

const benefits = [
  'Improve the accuracy and fluency of your writing.',
  'Save time and effort by automating editing tasks.',
  'Boost your writing confidence by eliminating errors and plagiarism.',
  'Improve your written communication skills in all areas.',
];

const BenefitsList = () => {
  return (
    <ListContainer>
      {benefits.map((benefit, index) => (
        <ListItem key={index}>
          <CheckIcon>✔</CheckIcon>
          {benefit}
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default BenefitsList;
