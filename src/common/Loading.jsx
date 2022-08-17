import React from 'react';

export default class Loading extends React.Component {
  componentDidMount() {
    // 组件加载loading，同时避免网络较好的情况下，loading闪屏
    window.__showLoadingLater();
  }
  render() {
    return null;
  }
}
