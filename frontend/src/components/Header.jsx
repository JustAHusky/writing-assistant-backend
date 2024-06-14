import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';// Adjust the path if necessary

const HeaderContainer = styled.header`
  width: 100%;
  padding: 10px 0;
  background-color: #e8f4d9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  border-color: #000000;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #2e7d32;
  display: flex;
  align-items: center;
`;

const LoginButton = styled(Link)`
  padding: 10px 20px;
  background-color: #fff;
  border: 1px solid #000000;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  &:hover {
    background-color: #f0f0f0;
  }
  margin-right: 40px;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        <Link to="homepage">
          <img src={logo} alt="Logo" style={{ marginRight: '10px', height: '250px' }} /> {/* Increased size */}
        </Link>
      </Logo>
      <LoginButton to="/">Login / Signout</LoginButton>
    </HeaderContainer>
  );
};

export default Header;
