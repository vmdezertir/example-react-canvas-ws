import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';

import { Layout, message, Modal, Spin } from 'antd';

import { useToolStore } from 'store';
import CanvasCursor from 'atoms/Cursor';
import LeftBar from 'organisms/LeftBar';
import UserNameModal from 'organisms/UserModal';
import { ToolVariant } from 'tools/interface';

import { useActions } from './useActions';
import styles from './styles.module.css';

const { Footer, Content, Sider } = Layout;

export const MeetRoom: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { meetId = '' } = useParams();
  const [sync, setOpenSync] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [toolName, color, lineWidth] = useToolStore(state => [state.toolName, state.color, state.size]);
  const {
    mouseDownHandler,
    mouseMoveHandler,
    mousePos,
    mouseHandler,
    connect,
    getImageMutation,
    checkMeetMutation,
    navigateToMain,
    submitUserModal,
  } = useActions({
    canvasRef,
    messageApi,
    setReady,
  });

  useEffect(() => setOpenSync(getImageMutation.isLoading), [getImageMutation.isLoading]);

  useEffect(() => checkMeetMutation.mutate(meetId), [meetId]);

  useEffect(() => {
    if (ready) {
      connect();
      getImageMutation.mutate(meetId);
    }
  }, [ready]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}
      <Sider style={{ backgroundColor: '#64768b' }}>
        <LeftBar />
      </Sider>
      <Layout>
        <Content className={styles.content}>
          {mousePos.isCanvas && toolName != ToolVariant.CURSOR && (
            <CanvasCursor lineWidth={lineWidth} color={color} mousePos={mousePos} />
          )}
          <canvas
            ref={canvasRef}
            className={clsx(styles.canvas, { [styles.cursorDefault]: toolName === ToolVariant.CURSOR })}
            height={700}
            width={1200}
            onMouseUp={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseEnter={() => mouseHandler(true)}
            onMouseLeave={() => mouseHandler(false)}
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2023 Created by Magic</Footer>
      </Layout>
      <UserNameModal
        submitHandler={submitUserModal}
        closable={false}
        maskClosable={false}
        keyboard={false}
        closeHandler={navigateToMain}
      />
      <Modal
        centered
        open={sync}
        closable={false}
        maskClosable={false}
        keyboard={false}
        modalRender={() => (
          <Spin tip="Synchronization" size="large" className={styles.spin}>
            <div className="content" />
          </Spin>
        )}
      />
    </Layout>
  );
};
