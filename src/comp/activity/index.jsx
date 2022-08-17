import React from 'react';
import Page from '@common/Page';

// 函数式组件
export default Page(({ history }) => {
  return (
    <div className="comp-activity">
      <div className="title">活动中心</div>
      <a
        onClick={() => {
          history.push('/');
        }}
      >
        返回首页
      </a>
    </div>
  );
});
