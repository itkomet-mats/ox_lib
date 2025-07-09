import { Checkbox } from '@mantine/core';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const CheckboxField: React.FC<Props> = (props) => {
  return (
    <Checkbox
      {...props.register}
      sx={{ display: 'flex' }}
      required={props.row.required}
      label={props.row.label}
    styles={{
      input: {
      background: 'rgba(255, 255, 255, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backgroundImage: 'url(/src/blur.png)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay',
      color: 'white',
      },
      label: {
        color: 'white',
      },
      description: {
        color: 'white',
      },
    }}
      defaultChecked={props.row.checked}
      disabled={props.row.disabled}
    />
  );
};

export default CheckboxField;
