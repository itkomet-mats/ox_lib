import { MultiSelect, Select } from '@mantine/core';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ISelect;
  index: number;
  control: Control<FormValues>;
}

const SelectField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  return (
    <>
      {props.row.type === 'select' ? (
        <Select
          data={props.row.options}
          value={controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={controller.field.onChange}
          disabled={props.row.disabled}
          label={props.row.label}
          description={props.row.description}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          searchable={props.row.searchable}
          icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
           styles={{
    input: {
    background: '#5df54250',
    border: '1px solid #5df542',
    borderRadius: '8px',
    color: 'white',
    fontWeight: 500,
      '::placeholder': {
        color: '#ffffff80',
      },
    },
    label: {
      color: 'white',
      fontWeight: 600,
      marginBottom: 5,
    },
    description: {
      color: 'white',
      fontSize: 13,
      marginBottom: 8,
    },
    dropdown: {
         background: '#072e00ff',
    border: '1px solid #5df542',
      borderRadius: '8px',
    },
  }}
        />
      ) : (
        <>
          {props.row.type === 'multi-select' && (
            <MultiSelect
              data={props.row.options}
              value={controller.field.value}
              name={controller.field.name}
              ref={controller.field.ref}
              onBlur={controller.field.onBlur}
              onChange={controller.field.onChange}
              disabled={props.row.disabled}
              label={props.row.label}
              description={props.row.description}
              withAsterisk={props.row.required}
              clearable={props.row.clearable}
              searchable={props.row.searchable}
              maxSelectedValues={props.row.maxSelectedValues}
              icon={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
              styles={{
    input: {
       background: 'rgba(255, 255, 255, 0.3)',
      backgroundImage: 'url(/src/blur.png)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      borderRadius: 12,
      color: 'white',
      fontWeight: 500,
      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.5)',
      },
    },
    label: {
      color: 'white',
      fontWeight: 600,
      marginBottom: 5,
    },
    description: {
      color: 'rgb(255, 255, 255)',
      fontSize: 13,
      marginBottom: 8,
    },
    dropdown: {
     background: 'rgba(255, 255, 255, 0.3)',
      backgroundImage: 'url(/src/blur.png)',
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
      backgroundPosition: 'center',
      backgroundBlendMode: 'overlay',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: 10,
    },
    item: {
      color: 'white',
      '&[data-selected]': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&[data-hovered]': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      },
    },
  }}
              
            />
          )}
        </>
      )}
    </>
  );
};

export default SelectField;
