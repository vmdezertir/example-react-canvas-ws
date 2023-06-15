import React, { ReactNode } from 'react';
import { Radio } from 'antd';

import { ToolVariant } from 'tools/interface';

export interface IProps {
  title: string | ReactNode;
  value: ToolVariant;
}

export const ToolOption: React.FC<IProps> = ({ title, value }) => {
  return <Radio.Button value={value}>{title}</Radio.Button>;
};
