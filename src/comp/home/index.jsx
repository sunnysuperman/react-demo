import React from 'react';
import { Config, Page, ComponentDidMount } from '@common/index';

import './css/home.scss';

// 主页
export default Page(({ history }) => {
  ComponentDidMount(() => {
    console.log('====Config', Config);
    console.log('====准备调用接口', Config.api);
  });

  return (
    <div className="comp-home">
      <div className="title">Demo项目</div>
      <img className="img" src={require('./img/logo.svg')} />
      <a
        onClick={() => {
          history.push('/user');
        }}
      >
        个人中心
      </a>
    </div>
  );
});
