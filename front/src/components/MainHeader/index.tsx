import React, { useMemo, useState } from 'react';

import emojisList from '../../utils/emojis';
import Toggle from '../Toggle';

import { useTheme } from '../../hooks/theme';

import { 
  Container,
  Profile,
  Welcome,
  UserName,
     } from './styles';

const MainHeader: React.FC = () => {
  const { toggleTheme, theme } = useTheme();

  const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false);

  const handleChangeTheme = () => {
    setDarkTheme(!darkTheme);
    toggleTheme();
  }

  const emoji = useMemo( () => {
    const indice = Math.floor(Math.random() * emojisList.length);
    return emojisList[indice];
  }, []);

  return (
    <Container>
      <Toggle 
        labelLeft="Light"
        labelRight="Dark"
        checked={darkTheme}
        onChange={handleChangeTheme}
      />

      <Profile>
        <Welcome>Olá, {emoji}</Welcome>
        <UserName>Arthur Ulhôa</UserName>
      </Profile>
    </Container>
  );
}

export default MainHeader;