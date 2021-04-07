import React from 'react';
import { ThemeProvider } from 'styled-components';

import { useTheme } from './hooks/theme';

import Routes from './routes';

import GlobalStyles from './styles/GlobalStyles';


const App: React.FC = () => {
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Routes />
    </ThemeProvider>
  );
}

export default App;