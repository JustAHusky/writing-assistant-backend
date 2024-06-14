import React from 'react';
import styled from 'styled-components';
import FeatureCard from './FeatureCard';
import { Link } from 'react-router-dom';

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  margin-top: 20px;
  justify-content: center;
`;

const features = [
  {
    title: 'Grammar Checker',
    description: 'The app will highlight the errors in your writing and suggest some corrections for grammar, spelling, and punctuation errors. The app will highlight the errors and suggest some corrections.',
    color: 'red',
    route: '/grammar-checker',
  },
  {
    title: 'Text Completion',
    description: 'The app will give you writing suggestions to complete sentences and paragraphs seamlessly by picking up where you left off and complete the input text with generated sentences.',
    color: 'green',
    route: '/text-completion',
  },
  {
    title: 'Plagiarism Checker',
    description: 'The app will analyze the text and compare it with other documents on the internet to avoid plagiarism and then provide a percentage of how much of the text matches other documents, as well as links to those documents.',
    color: 'purple',
    route: '/plagiarism-checker',
  },
  {
    title: 'Paraphraser',
    description: 'The app will rewrite complete sentences in a number of ways to improve your writing and gain a new perspective and then provide several paraphrased versions of the text, allowing you to choose the one that best fits your needs.',
    color: 'orange',
    route: '/paraphraser',
  },
];

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const ScaledFeatureCard = styled(FeatureCard)`
  transform: scale(2);
`;

function FeatureList() {
  return (
    <FeaturesContainer>
      {features.map((feature, index) => (
        <StyledLink key={index} to={feature.route}>
          <ScaledFeatureCard feature={feature} />
        </StyledLink>
      ))}
    </FeaturesContainer>
  );
}

export default FeatureList;
