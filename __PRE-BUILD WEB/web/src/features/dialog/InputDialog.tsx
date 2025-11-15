import { Button, Group, Modal, Stack, createStyles } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

// brand + backgrounds
const BRAND = {
primary: '#5df542',
  error: '#ff5a5aff',
  info: '#5df542',
} as const;

const BACKGROUNDS: Record<string, string> = {
  error: '#420000ff',
  success: '#2b2e00ff',
  info: '#072e00ff',
  default: '#072e00ff', // fallback
};

const CORNER = { size: 18, thickness: 2 } as const;

const useStyles = createStyles(() => ({
  modal: {
    width: 500,
    padding: 20,
    borderRadius: 0,
    color: '#ffffff',
    fontFamily: 'Roboto',
    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },

  title: {
    textAlign: 'left',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: 22,
    width: '100%',
  },

  body: {
    color: '#ffffff',
    fontWeight: 400,
    fontSize: 16,
  },

  // corner pieces
  corner: {
    position: 'absolute',
    width: CORNER.size,
    height: CORNER.size,
    pointerEvents: 'none',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTop: `${CORNER.thickness}px solid`,
    borderLeft: `${CORNER.thickness}px solid`,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTop: `${CORNER.thickness}px solid`,
    borderRight: `${CORNER.thickness}px solid`,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottom: `${CORNER.thickness}px solid`,
    borderLeft: `${CORNER.thickness}px solid`,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottom: `${CORNER.thickness}px solid`,
    borderRight: `${CORNER.thickness}px solid`,
  },
}));

export type FormValues = {
  test: {
    value: any;
  }[];
};

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();
  const { classes, cx } = useStyles();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(
        index,
        {
          value:
            row.type !== 'checkbox'
              ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
                ? row.default === true
                  ? new Date().getTime()
                  : Array.isArray(row.default)
                  ? row.default.map((date) => new Date(date).getTime())
                  : row.default && new Date(row.default).getTime()
                : row.default
              : row.checked,
        } || { value: null }
      );
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];
      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  // static style for background & corners
  const bgColor = BACKGROUNDS.default;
  const cornerColor = BRAND.info;

  return (
    <Modal
      opened={visible}
      onClose={handleClose}
      centered
      closeOnEscape={fields.options?.allowCancel !== false}
      closeOnClickOutside={false}
      size="xs"
      classNames={{
        modal: classes.modal,
        title: classes.title,
        body: classes.body,
      }}
      sx={{
        '.mantine-Modal-modal': {
          background: bgColor,
        },
      }}
      title={fields.heading}
      withCloseButton={false}
      overlayOpacity={0.5}
      transition="fade"
      exitTransitionDuration={150}
    >
      {/* corner-only borders */}
      <span className={cx(classes.corner, classes.topLeft)} style={{ borderColor: cornerColor }} />
      <span className={cx(classes.corner, classes.topRight)} style={{ borderColor: cornerColor }} />
      <span className={cx(classes.corner, classes.bottomLeft)} style={{ borderColor: cornerColor }} />
      <span className={cx(classes.corner, classes.bottomRight)} style={{ borderColor: cornerColor }} />

      <form onSubmit={onSubmit}>
        <Stack>
          {fieldForm.fields.map((item, index) => {
            const row = fields.rows[index];
            return (
              <React.Fragment key={item.id}>
                {row.type === 'input' && (
                  <InputField
                    register={form.register(`test.${index}.value`, { required: row.required })}
                    row={row}
                    index={index}
                  />
                )}
                {row.type === 'checkbox' && (
                  <CheckboxField
                    register={form.register(`test.${index}.value`, { required: row.required })}
                    row={row}
                    index={index}
                  />
                )}
                {(row.type === 'select' || row.type === 'multi-select') && (
                  <SelectField row={row} index={index} control={form.control} />
                )}
                {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                {row.type === 'date' || row.type === 'date-range' ? (
                  <DateField control={form.control} row={row} index={index} />
                ) : null}
                {row.type === 'textarea' && (
                  <TextareaField
                    register={form.register(`test.${index}.value`, { required: row.required })}
                    row={row}
                    index={index}
                  />
                )}
              </React.Fragment>
            );
          })}
          <Group position="right" spacing={10}>
            <Button
              uppercase
              variant="default"
              onClick={() => handleClose()}
              mr={3}
              disabled={fields.options?.allowCancel === false}
            >
              {locale.ui.cancel}
            </Button>
            <Button uppercase variant="light" type="submit">
              {locale.ui.confirm}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default InputDialog;
