import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { Layout } from 'antd';
import { useToolStore, useUserStore } from 'store';
import CanvasCursor from 'atoms/Cursor';
import LeftBar from 'organisms/LeftBar';
import UserNameModal from 'organisms/UserModal';
import { ToolVariant } from 'tools/interface';

import { useActions } from './useActions';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

const { Footer, Content, Sider } = Layout;

export const MeetRoom: React.FC = () => {
  const socket = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const { toolName, color, lineWidth } = useToolStore(state => ({
    toolName: state.toolName,
    color: state.color,
    lineWidth: state.size,
  }));
  const { userName, openModal, closeModal } = useUserStore(state => ({
    userName: state.userName,
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));
  const { mouseMoveHandler, mousePos, mouseHandler, connect } = useActions(canvasRef.current, socket.current);

  const navigateToMain = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!userName) {
      openModal();
    }
  }, [userName, openModal, closeModal]);

  useEffect(() => {
    if (!!userName) {
      connect();
    }
  }, [userName, connect]);

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
      <UserNameModal
        submitHandler={closeModal}
        closable={false}
        maskClosable={false}
        keyboard={false}
        closeHandler={navigateToMain}
      />
    </Layout>
  );
};
