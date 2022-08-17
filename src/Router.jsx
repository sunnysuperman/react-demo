import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from '@common/Loading';

const Home = lazy(() => import('@comp/home'));
const User = lazy(() => import('@comp/user'));
const Activity = lazy(() => import('@comp/activity'));

export default () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/user" exact element={<User />} />
            <Route path="/activity" exact element={<Activity />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </React.StrictMode>
  );
};
