import React, { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { Button, Form, Input, Typography, Divider, Space, Row, Layout } from 'antd';
const { Title, Paragraph } = Typography;

import { useUserStore } from 'store';
import UserNameModal from 'organisms/UserModal';

import styles from './styles.module.css';

const { REACT_APP_API_PATH: API_PATH } = process.env;

const createMeet = async () => {
  const response = await axios.post(`${API_PATH}/meet`);
  return response.data;
};
const joinMeet = async (meetId: string) => {
  const response = await axios.get(`${API_PATH}/meet/${meetId}`);
  return response.data;
};

enum EMode {
  CREATE = 'CREATE',
  JOIN = 'Join',
}

export const Main: React.FC = () => {
  const [meetId, setMeetId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [mode, setMode] = useState<EMode>(EMode.CREATE);
  const navigate = useNavigate();
  const [userName, openModal, closeModal] = useUserStore(state => [state.userName, state.openModal, state.closeModal]);

  const createMeetMutation = useMutation(createMeet, {
    onSuccess: data => {
      navigate(`/meet/${data.meetId}`);
    },
  });

  const checkMeetMutation = useMutation(joinMeet, {
    mutationKey: ['checkMeet', meetId],
    onSuccess: data => {
      setMode(EMode.JOIN);
      if (userName) {
        closeModal();
        navigate(`/meet/${data.meetId}`);
      } else {
        openModal();
      }
    },
    onError: ({ response }) => {
      setError(response.data.msg);
    },
  });

  const meetIdChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeetId(e.target.value);
    error && setError('');
  };

  const createMeetHandler = useCallback(() => createMeetMutation.mutate(), [createMeetMutation]);

  const startJoinMeetHandler = useCallback(() => checkMeetMutation.mutate(meetId), [checkMeetMutation, meetId]);

  const startCreateMeetHandler = useCallback(() => {
    setMode(EMode.CREATE);
    userName ? createMeetHandler() : openModal();
  }, [userName, createMeetHandler, openModal]);

  const goToMeetHandler = useCallback(() => {
    mode === EMode.CREATE ? createMeetHandler() : navigate(`/meet/${meetId}`);
  }, [mode, createMeetHandler, meetId]);

  return (
    <Layout className="container">
      <div className={styles.wrapper}>
        <Row align="middle" justify="center">
          <div>
            <Title>Take ideas from better to best</Title>
            <Paragraph className="lead">
              It's your team's visual platform to connect, collaborate, and create — together.
            </Paragraph>
            <Button onClick={startCreateMeetHandler} type="primary">
              Create new room
            </Button>
          </div>
          <Divider orientation="center">Or enter the code provided by meeting organiser</Divider>
          <Form layout="inline">
            <Space.Compact style={{ width: '300px' }}>
              <Form.Item label="Fail" validateStatus={error ? 'error' : undefined} help={error}>
                <Input onChange={meetIdChangeHandler} placeholder="Code" />
              </Form.Item>
              <Button
                type="primary"
                disabled={!meetId}
                onClick={startJoinMeetHandler}
                loading={checkMeetMutation.isLoading}
              >
                Join
              </Button>
            </Space.Compact>
          </Form>
        </Row>
      </div>
      <UserNameModal submitHandler={goToMeetHandler} />
    </Layout>
  );
};
