import React from 'react';

import { Container } from './styles';

interface ISelectInputProps {
  options: {
    value: string | number;
    label: string | number;
  }[],
  onChange(event: React.ChangeEvent<HTMLSelectElement>): void | undefined;
  defaultValue?: number;
}

const SelectInput: React.FC<ISelectInputProps> = ({ options, onChange, defaultValue }) => {
  return (
    <Container>
      <select onChange={onChange} defaultValue={defaultValue} >
      {
        options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))
      }
      </select>
    </Container>
  );
}

export default SelectInput;