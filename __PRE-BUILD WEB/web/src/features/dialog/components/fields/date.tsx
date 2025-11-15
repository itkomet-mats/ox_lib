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
  const YELLOW = '#5df542';

  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required, min: props.row.min, max: props.row.max },
  });

  const commonProps = {
    name: controller.field.name,
    ref: controller.field.ref,
    onBlur: controller.field.onBlur,
    label: props.row.label,
    description: props.row.description,
    placeholder: props.row.format,
    disabled: props.row.disabled,
    inputFormat: props.row.format, // keep for mantine v5
    withAsterisk: props.row.required,
    clearable: props.row.clearable,
    icon: props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />,
    minDate: props.row.min ? new Date(props.row.min) : undefined,
    maxDate: props.row.max ? new Date(props.row.max) : undefined,
    styles: {
      input: {
 
        color: '#ffffff',
    background: '#2a2a2a',
    border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: 8,
        fontWeight: 500,
        fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        transition: 'border-color .12s ease-out, box-shadow .12s ease-out',
        '::placeholder': { color: 'rgba(255,255,255,0.60)' },
        '&:hover': { borderColor: 'rgba(255,255,255,0.35)' },
        '&:focus, &:focus-within': {
          outline: 'none',
          boxShadow: `0 0 0 2px rgba(0,0,0,0.55), 0 0 0 4px #5df54250`,
          borderColor: '#5df542c0',
        },
      },
      label: {
        color: '#ffffff',
        fontWeight: 600,
        marginBottom: 5,
        textShadow: '0 1px 2px rgba(0,0,0,.85)',
        fontFamily: '"Inter", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
      },
      description: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 13,
        marginBottom: 8,
      },
      dropdown: {
    background: '#2a2a2a',
    border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: 8,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        color: '#fff',
      },
      month: {
        color: '#fff',
      },
      calendarHeader: {
        color: '#fff',
        button: { color: '#fff' },
      },
      weekday: {
        color: 'rgba(255,255,255,0.75)',
      },
      day: {
        color: '#ffffff',
        '&[data-today]': {
          outline: `1px solid rgba(255,255,255,0.35)`,
          outlineOffset: 2,
        },
        '&[data-selected]': {
          backgroundColor: YELLOW,
          color: '#2a2a2a',
        },
        '&[data-in-range]': {
          backgroundColor: '#5df54225',
          color: '#ffffff',
        },
        '&[data-first-in-range]': {
          backgroundColor: '#5df54245',
          color: '#2a2a2a',
        },
        '&[data-last-in-range]': {
          backgroundColor: '#5df54245',
          color: '#2a2a2a',
        },
        '&[data-hovered]': {
          backgroundColor: 'rgba(255,255,255,0.12)',
        },
        '&[data-disabled]': {
          color: 'rgba(255,255,255,0.35)',
        },
        '&[data-outside]': {
          color: 'rgba(255,255,255,0.35)',
        },
      },
    } as const,
  };

  return (
    <>
      {props.row.type === 'date' && (
        <DatePicker
          value={controller.field.value ? new Date(controller.field.value) : controller.field.value}
          onChange={(date) => controller.field.onChange(date ? date.getTime() : null)}
          {...commonProps}
        />
      )}

      {props.row.type === 'date-range' && (
        <DateRangePicker
          value={
            controller.field.value
              ? controller.field.value[0]
                ? controller.field.value.map((d: number | Date | null) =>
                    d ? new Date(d as number) : null
                  )
                : controller.field.value
              : controller.field.value
          }
          onChange={(dates) =>
            controller.field.onChange(
              dates.map((d: Date | null) => (d ? d.getTime() : null))
            )
          }
          {...commonProps}
        />
      )}
    </>
  );
};

export default DateField;
