import React from 'react';

import { Button, Form, Input, Typography, Divider, Space, Row, Layout } from 'antd';
const { Title, Paragraph } = Typography;

import styles from './styles.module.css';

export const Main: React.FC = () => {
  return (
    <Layout className="container">
      <div className={styles.wrapper}>
        <Row align="middle" justify="center">
          <div>
            <Title>Take ideas from better to best</Title>
            <Paragraph className="lead">
              It's your team's visual platform to connect, collaborate, and create — together.
            </Paragraph>
            <Button type="primary">Create new room</Button>
          </div>
          <Divider orientation="center">Or enter the code provided by meeting organiser</Divider>
          <Form layout="inline">
            <Space.Compact style={{ width: '300px' }}>
              <Input defaultValue="Code" />
              <Button type="primary">Join</Button>
            </Space.Compact>
          </Form>
        </Row>
      </div>
    </Layout>
  );
};
