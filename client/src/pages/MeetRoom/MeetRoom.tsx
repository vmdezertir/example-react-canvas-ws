import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { Layout, message } from 'antd';

import { useToolStore, useUserStore } from 'store';
import CanvasCursor from 'atoms/Cursor';
import LeftBar from 'organisms/LeftBar';
import UserNameModal from 'organisms/UserModal';
import { ToolVariant } from 'tools/interface';

import { useActions } from './useActions';
import styles from './styles.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const { Footer, Content, Sider } = Layout;

export const MeetRoom: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { meetId = '' } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const { toolName, color, size: lineWidth } = useToolStore(state => state);
  const { userName, openModal, closeModal } = useUserStore(state => state);
  const { mouseDownHandler, mouseMoveHandler, mousePos, mouseHandler, connect } = useActions({
    canvas: canvasRef.current,
    userName,
    messageApi,
  });

  const { data, refetch } = useQuery({
    queryKey: ['printscreen', meetId],
    queryFn: () => axios.get(`http://localhost:8080/api/meet/image/${meetId}`).then(res => res.data),
    enabled: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (canvasRef.current && data) {
      const { width, height } = canvasRef.current;
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.src = data;
      img.onload = async () => {
        ctx?.clearRect(0, 0, width, height);
        ctx?.drawImage(img, 0, 0, width, height);
        ctx?.stroke();
      };
    }
  }, [data, canvasRef.current]);

  const navigateToMain = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!userName) {
      openModal();
    }
  }, [userName, openModal, closeModal]);

  useEffect(() => {
    if (userName) {
      connect();
      refetch();
    }
  }, [userName, connect]);

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
        submitHandler={closeModal}
        closable={false}
        maskClosable={false}
        keyboard={false}
        closeHandler={navigateToMain}
      />
    </Layout>
  );
};
