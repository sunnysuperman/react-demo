import React from 'react';
import ReactDOM from 'react-dom/client';
import History from '@common/History';
import Router from './Router';

// 公共样式
import './css/common.scss';

// 监听页面改变
History.onChange((path) => {
  console.log('====current path', path);
});

// 入口
ReactDOM.createRoot(document.getElementById('root')).render(<Router />);
