import { Box, Slider, Text } from '@mantine/core';
import { ISlider } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';

interface Props {
  row: ISlider;
  index: number;
  control: Control<FormValues>;
}

const SliderField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    defaultValue: props.row.default || props.row.min || 0,
  });

  return (
    <Box>
      <Text sx={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{props.row.label}</Text>
      <Slider
        mb={10}
        value={controller.field.value}
        name={controller.field.name}
        ref={controller.field.ref}
        onBlur={controller.field.onBlur}
        onChange={controller.field.onChange}
        defaultValue={props.row.default || props.row.min || 0}
        min={props.row.min}
        max={props.row.max}
        step={props.row.step}
        disabled={props.row.disabled}
       marks={[
      { value: props.row.min || 0, label: props.row.min || 0 },
      { value: props.row.max || 100, label: props.row.max || 100 },
    ]}
    styles={{
      thumb: {
        border: '1px solid yellow',
        backgroundColor: 'rgb(224, 255, 141)',
      },
      track: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      },
      bar: {
        backgroundColor: 'rgb(224, 255, 141, 0.5)',
      },
      markLabel: {
        color: 'white',
      },
    }}
      />
    </Box>
  );
};

export default SliderField;
