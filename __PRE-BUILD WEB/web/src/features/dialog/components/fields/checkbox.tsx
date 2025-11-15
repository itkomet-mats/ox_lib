import { Checkbox } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const CheckboxField: React.FC<Props> = (props) => {
  const YELLOW = '#1d1d1dff';

  return (
    <Checkbox
      {...props.register}
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      }}
      size="md"
      radius="sm"
      required={props.row.required}
      label={props.row.label}
      defaultChecked={props.row.checked}
      disabled={props.row.disabled}
      styles={{
        root: {
          // extra spacing between box and label
          gap: 10,
        },
        input: {
          width: 20,
          height: 20,
             background: '#2a2a2a30',
    border: '1px solid rgba(255, 255, 255, 0.4)',

          '&:hover': {
            borderColor: '#5df542',
          },

          // checked state -> brand yellow + glow
          '&:checked': {
            backgroundColor: '#23551aff',
            borderColor: '#23551aff',
            // boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
          },

          // focus ring (keyboard)
          '&:focus-visible': {
            outline: 'none',
            boxShadow:
              '0 0 0 2px rgba(0,0,0,0.55), 0 0 0 4px rgba(255,252,104,0.55)',
          },

          // disabled
          '&:disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',


          },
        },
        icon: {
          // the checkmark color
          color: '#2a2a2a',

          
        },
        label: {
          color: '#ffffff',
          fontWeight: 600,
          // textShadow: '0 1px 2px rgba(0,0,0,.85)',
          userSelect: 'none',
        },
        description: {
          color: '#ffffff',
          opacity: 0.85,
        },
      }}
    />
  );
};

export default CheckboxField;
