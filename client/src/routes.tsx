import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Main from 'pages/Main';
import MeetRoom from 'pages/MeetRoom';
import NotFound from 'pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <NotFound />,
    children: [
      { path: '', element: <Main /> },
      { path: '/meet/:meetId', element: <MeetRoom /> },
    ],
  },
]);
