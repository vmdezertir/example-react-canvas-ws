import React from 'react';
import { Typography } from 'antd';

import styles from './styles.module.css';

export interface IProps {
  lineWidth: number;
  color: string;
  mousePos: {
    x: number;
    y: number;
  };
}

export const Cursor: React.FC<IProps> = ({ lineWidth, mousePos, color }) => {
  return (
    <span
      className={styles.cursor}
      style={{
        width: `${lineWidth}px`,
        height: `${lineWidth}px`,
        top: mousePos.y - lineWidth / 2,
        left: mousePos.x - lineWidth / 2,
        backgroundColor: color,
      }}
    ></span>
  );
};
