import React, { useRef } from 'react';
import clsx from 'clsx';

import { Layout } from 'antd';
import { useToolStore } from 'store';
import CanvasCursor from 'atoms/Cursor';
import LeftBar from 'organisms/LeftBar';

import { ToolVariant } from 'tools/interface';

import { useActions } from './useActions';
import styles from './styles.module.css';

const { Footer, Content, Sider } = Layout;

export const MeetRoom: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toolName, color, lineWidth } = useToolStore(state => ({
    toolName: state.toolName,
    color: state.color,
    lineWidth: state.size,
  }));

  const { mouseMoveHandler, mousePos, mouseHandler } = useActions(canvasRef.current);

  return (
    <Layout>
      <Sider style={{ backgroundColor: '#64768b' }}>
        <LeftBar />
      </Sider>
      <Layout>
        <Content>
          {mousePos.isCanvas && toolName != ToolVariant.CURSOR && (
            <CanvasCursor lineWidth={lineWidth} color={color} mousePos={mousePos} />
          )}
          <canvas
            ref={canvasRef}
            className={clsx(styles.canvas, { [styles.cursorDefault]: toolName === ToolVariant.CURSOR })}
            height={document.body.getBoundingClientRect().height - 67}
            width={document.body.getBoundingClientRect().width - 200}
            onMouseMove={mouseMoveHandler}
            onMouseEnter={() => mouseHandler(true)}
            onMouseLeave={() => mouseHandler(false)}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2023 Created by Magic</Footer>
      </Layout>
    </Layout>
  );
};
