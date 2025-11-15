import { NumberInput } from '@mantine/core';
import { INumber } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: INumber;
  index: number;
  control: Control<FormValues>;
}

const NumberField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default,
    rules: { required: props.row.required, min: props.row.min, max: props.row.max },
  });

  return (
    <NumberInput
      value={controller.field.value}
      name={controller.field.name}
      ref={controller.field.ref}
      onBlur={controller.field.onBlur}
      onChange={controller.field.onChange}
      label={props.row.label}
      description={props.row.description}
      defaultValue={props.row.default}
      min={props.row.min}
      max={props.row.max}
      step={props.row.step}
      precision={props.row.precision}
      disabled={props.row.disabled}
      icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
      withAsterisk={props.row.required}
      styles={{
        input: {
              background: '#5df54250',
    border: '1px solid #5df542',
          borderRadius: '8px',
          color: '#ffffff',
          fontWeight: 500,
          '::placeholder': {
            color: '#ffffff',
          },
        },
        label: {
          color: '#ffffff',
          fontWeight: 600,
          marginBottom: 5,
        },
        description: {
          color: '#ffffff',
          fontSize: 13,
          marginBottom: 8,
        },
        icon: {
          color: '#ffffff',
        }
      }}
    />
  );
};

export default NumberField;
