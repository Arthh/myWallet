import styled from 'styled-components';

export const Container = styled.div`
  grid-area: AS;

  color: ${props => props.theme.colors.white};
  background-color: ${props => props.theme.colors.secondary};

  padding-left: 20px;

  border-right: 1px solid ${props => props.theme.colors.gray};

`

export const Header = styled.header`
  height: 70px;

  display: flex;
  align-items: center;
`;

export const LogoImg = styled.img`
  height: 40px;
  width: 40px;
`;

export const Tittle = styled.h3`
  color: ${props => props.theme.colors.white};
  margin-left: 10px;
`;

export const MenuContainer = styled.nav`
  display: flex;
  flex-direction: column;

  margin-top: 50px;
`;

export const MenuItemLink = styled.a`
  color: ${props => props.theme.colors.info};
  text-decoration: none;

  display:flex;
  align-items: center;

  margin: 7px 0;

  transition: opacity .3s;

  &:hover {
    opacity: .7;
  }

  > svg {
    font-size: 18px;
    margin-right: 5px;
  }

`;

export const MenuItemButton = styled.button`
  font-size: 16px;
  color: ${props => props.theme.colors.info};

  border: none;
  background: none;

  display:flex;
  align-items: center;
  margin: 7px 0;

  transition: opacity .3s;

  &:hover {
    opacity: .7;
  }

  > svg {
    font-size: 18px;
    margin-right: 5px;
  }

`;
