import React, { useMemo, useCallback, ReactNode } from 'react';

import { Button, Tooltip, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaintBrush, faHandPointer, faCircle, faSquare, faEraser, faMinus } from '@fortawesome/free-solid-svg-icons';

import { ToolVariant } from 'tools/interface';
import { useToolStore } from 'store';

type TToolOption = {
  tooltipLabel: string;
  title: string | ReactNode;
  value: ToolVariant;
};

export const ToolBar = () => {
  const { toolName, setToolName } = useToolStore(state => ({
    toolName: state.toolName,
    setToolName: state.setToolName,
  }));

  const list = useMemo<TToolOption[]>(
    () => [
      {
        tooltipLabel: 'Cursor',
        title: <FontAwesomeIcon icon={faHandPointer} />,
        value: ToolVariant.CURSOR,
      },
      {
        tooltipLabel: 'Brush',
        title: <FontAwesomeIcon icon={faPaintBrush} />,
        value: ToolVariant.BRUSH,
      },
      {
        tooltipLabel: 'Line',
        title: <FontAwesomeIcon icon={faMinus} />,
        value: ToolVariant.LINE,
      },
      // {
      //   tooltipLabel: 'Pencil',
      //   title: <FontAwesomeIcon icon={faPencil} />,
      //   value: ToolVariant.PENCIL,
      // },
      {
        tooltipLabel: 'Circle',
        title: <FontAwesomeIcon icon={faCircle} />,
        value: ToolVariant.CIRCLE,
      },
      {
        tooltipLabel: 'Square',
        title: <FontAwesomeIcon icon={faSquare} />,
        value: ToolVariant.SQUARE,
      },
      {
        tooltipLabel: 'Eraser',
        title: <FontAwesomeIcon icon={faEraser} />,
        value: ToolVariant.ERASER,
      },
    ],
    [],
  );

  const radioChangeHandler = useCallback((value: ToolVariant) => setToolName(value), [setToolName]);

  return (
    <Space wrap>
      {list.map(({ tooltipLabel, title, value }) => (
        <Tooltip key={value} title={tooltipLabel}>
          <Button
            icon={title}
            onClick={() => radioChangeHandler(value)}
            type={toolName === value ? 'primary' : undefined}
          />
        </Tooltip>
      ))}
    </Space>
  );
};
