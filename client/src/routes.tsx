import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Main from 'pages/Main';
import MeetRoom from 'pages/MeetRoom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/meet/:meetId',
    element: <MeetRoom />,
  },
]);
