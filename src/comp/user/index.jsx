import React from 'react';
import Page from '@common/Page';

export default Page(({ history }) => {
  return (
    <div className="comp-user">
      <div className="title">个人中心</div>
      <div className="nick">你的昵称是：张三</div>
      <a
        onClick={() => {
          history.back();
        }}
      >
        返回
      </a>
      <br />
      <a
        onClick={() => {
          history.push('/');
        }}
      >
        返回首页
      </a>
      <br />
      <a
        onClick={() => {
          history.push('/activity');
        }}
      >
        活动中心
      </a>
    </div>
  );
});
