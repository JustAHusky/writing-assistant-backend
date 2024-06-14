import React from 'react';
import styled from 'styled-components';
import FeatureList from '../components/FeatureList';
import BenefitsList from '../components/BenefitsList';


const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const ColouredTitle = styled.h2`
  color: #0AD776;
  font-size: 30px;
  margin-top: 0;
`;

function HomePage() {
  return (
    <AppContainer>
      <Title>The ultimate writing aid:</Title>
      <ColouredTitle>Improve your writing skills today!</ColouredTitle>
      <FeatureList />
      <BenefitsList />
    </AppContainer>
  );
}

export default HomePage;
