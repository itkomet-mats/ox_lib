import { Textarea } from '@mantine/core';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ITextarea } from '../../../../typings/dialog';
import React from 'react';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  register: UseFormRegisterReturn;
  row: ITextarea;
  index: number;
}

const TextareaField: React.FC<Props> = (props) => {
  return (
    <Textarea
      {...props.register}
      defaultValue={props.row.default}
      label={props.row.label}
      description={props.row.description}
      icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
      placeholder={props.row.placeholder}
      disabled={props.row.disabled}
      withAsterisk={props.row.required}
      autosize={props.row.autosize}
      minRows={props.row.min}
      maxRows={props.row.max}
      styles={{
      input: {
             background: '#5df54250',
    border: '1px solid #5df542',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 500,
        '::placeholder': {
          color: '#ffffff',
        },
      },
      label: {
        color: 'white',
        fontWeight: 600,
        marginBottom: 5,
      },
      description: {
        color: '#ffffff',
        fontSize: 13,
        marginBottom: 8,
      },
    }}
    />
  );
};

export default TextareaField;
