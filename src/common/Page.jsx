import React from 'react';
import { useNavigate } from 'react-router-dom';
import History from '@common/History';
import ComponentDidMount from '@common/ComponentDidMount';

export default (Component) => {
  const Wrapper = (props) => {
    // 生成history api
    const history = History.api(useNavigate());
    // 组件加载完成事件
    ComponentDidMount(() => {
      // 关闭loading
      window.__onLoaded();
      // 触发页面切换事件
      History.triggerChange();
    });

    return <Component history={history} {...props} />;
  };

  return Wrapper;
};
