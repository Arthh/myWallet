import React, { useState } from 'react';

import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Logo, Form, FormTitle} from './styles';

import { useAuth } from '../../hooks/auth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>(' ');
  const [password, setPassword] = useState<string>(' ');

  const { signIn } = useAuth();
  
  return (
    <Container>
      <Logo>
        <img src={logoImg} alt="Minha Carteira" />
        <h2>Minha Carteira</h2>
      </Logo>

      <Form onSubmit={() => signIn(email, password)}>
        <FormTitle>
          <h1>Entrar </h1>
        </FormTitle>

        <Input
          placeholder="e-mail"
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input 
         placeholder="senha"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit"> Acessar </Button>
        
      </Form>

    </Container>
  );
}

export default SignIn;