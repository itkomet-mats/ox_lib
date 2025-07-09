import { IDateInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { DatePicker, DateRangePicker } from '@mantine/dates';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: IDateInput;
  index: number;
  control: Control<FormValues>;
}

const DateField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required, min: props.row.min, max: props.row.max },
  });

  return (
    <>
      {props.row.type === 'date' && (
        <DatePicker
          value={controller.field.value ? new Date(controller.field.value) : controller.field.value}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          // Workaround to use timestamp instead of Date object in values
          onChange={(date) => controller.field.onChange(date ? date.getTime() : null)}
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          inputFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
           styles={{
      input: {
        background: 'rgba(255, 255, 255, 0.3)',
        backgroundImage: 'url(/src/blur.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
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
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        marginBottom: 8,
      },
      dropdown: {
        backgroundColor: 'rgb(29, 29, 29)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
      },
      day: {
        color: 'white',
        '&[data-selected]': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&[data-hovered]': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    }}
        />
      )}
      {props.row.type === 'date-range' && (
        <DateRangePicker
          value={
            controller.field.value
              ? controller.field.value[0]
                ? controller.field.value.map((date: Date) => new Date(date))
                : controller.field.value
              : controller.field.value
          }
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={(dates) =>
            controller.field.onChange(dates.map((date: Date | null) => (date ? date.getTime() : null)))
          }
          label={props.row.label}
          description={props.row.description}
          placeholder={props.row.format}
          disabled={props.row.disabled}
          inputFormat={props.row.format}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          icon={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
          minDate={props.row.min ? new Date(props.row.min) : undefined}
          maxDate={props.row.max ? new Date(props.row.max) : undefined}
           styles={{
      input: {
        background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
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
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        marginBottom: 8,
      },
      dropdown: {
        backgroundColor: 'rgb(29, 29, 29)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '8px',
      },
      day: {
        color: 'white',
        '&[data-selected]': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&[data-hovered]': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    }}
        />
      )}
    </>
  );
};

export default DateField;
