import React from 'react';
import { ColorPicker, Typography, ColorPickerProps } from 'antd';

const { Text } = Typography;

import styles from './styles.module.css';

export interface IProps extends ColorPickerProps {
  title: string;
  presetColors: string[];
}

export const ColorInput: React.FC<IProps> = ({ title, presetColors, ...props }) => {
  return (
    <div>
      <Text className={styles.label}>{title}</Text>
      <ColorPicker
        className={styles.colorPicker}
        presets={[
          {
            label: 'Recommended',
            colors: presetColors,
          },
        ]}
        allowClear
        {...props}
      >
        <span className={styles.color} style={{ backgroundColor: props.value as string }}></span>
      </ColorPicker>
    </div>
  );
};
