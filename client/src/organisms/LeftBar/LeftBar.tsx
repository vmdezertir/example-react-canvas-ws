import React, { useCallback } from 'react';

import { Button, Space, Slider, Typography } from 'antd';

import ToolBar from 'molecules/ToolBar';
import ColorInput from 'atoms/ColorInput';
import { useCanvasStore, useToolStore } from 'store';

import styles from './styles.module.css';

const PRESET_COLORS = [
  '#000000',
  '#00000005',
  '#F5222D',
  '#FA8C16',
  '#FADB14',
  '#8BBB11',
  '#52C41A',
  '#13A8A8',
  '#1677FF',
  '#2F54EB',
  '#722ED1',
  '#EB2F96',
  '#F5222D4D',
  '#FA8C164D',
  '#FADB144D',
  '#8BBB114D',
  '#52C41A4D',
  '#13A8A84D',
  '#1677FF4D',
  '#2F54EB4D',
  '#722ED14D',
  '#EB2F964D',
];

export const LeftBar = () => {
  const canvas = useCanvasStore(state => state.canvasRef);
  const { color, setColor, setLineWidth } = useToolStore(state => ({
    color: state.color,
    setColor: state.setColor,
    setLineWidth: state.setSize,
  }));

  const clearHandler = useCallback(() => {
    if (!canvas) {
      return;
    }

    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvas]);

  const onSliderHandler = useCallback((val: number) => setLineWidth(val), [setLineWidth]);

  return (
    <div className={styles.wrapper}>
      <Space className={styles.main} direction="vertical">
        <ColorInput onChange={setColor} presetColors={PRESET_COLORS} title={'Brush color'} value={color} />
        <Typography.Text className={styles.title}>Tools</Typography.Text>
        <ToolBar />
        <Typography.Text className={styles.title}>Tool size</Typography.Text>
        <Slider
          defaultValue={1}
          max={20}
          min={1}
          onChange={onSliderHandler}
          railStyle={{ backgroundColor: '#A19999' }}
        />
      </Space>
      <Space className={styles.footer} direction="vertical">
        <Button size={'large'} block>
          Save image
        </Button>
        <Button onClick={clearHandler} size={'large'} block>
          Clear
        </Button>
      </Space>
    </div>
  );
};
