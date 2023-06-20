import React, { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Form, Input, Typography, Divider, Space, Row, Layout } from 'antd';
const { Title, Paragraph } = Typography;
import { useUserStore } from 'store';

import UserNameModal from 'organisms/UserModal';

import styles from './styles.module.css';

export const Main: React.FC = () => {
  const [meetId, setMeetId] = useState<string>('');

  const navigate = useNavigate();
  const openModal = useUserStore(state => state.openModal);

  const createMeetHandler = useCallback(() => {
    const newId = Date.now();
    navigate(`/meet/${meetId || newId}`);
  }, [navigate, meetId]);

  const meetIdChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeetId(e.target.value);
  };

  return (
    <Layout className="container">
      <div className={styles.wrapper}>
        <Row align="middle" justify="center">
          <div>
            <Title>Take ideas from better to best</Title>
            <Paragraph className="lead">
              It's your team's visual platform to connect, collaborate, and create — together.
            </Paragraph>
            <Button onClick={openModal} type="primary">
              Create new room
            </Button>
          </div>
          <Divider orientation="center">Or enter the code provided by meeting organiser</Divider>
          <Form layout="inline">
            <Space.Compact style={{ width: '300px' }}>
              <Input onChange={meetIdChangeHandler} placeholder="Code" />
              <Button type="primary" disabled={!meetId} onClick={openModal}>
                Join
              </Button>
            </Space.Compact>
          </Form>
        </Row>
      </div>
      <UserNameModal submitHandler={createMeetHandler} />
    </Layout>
  );
};
