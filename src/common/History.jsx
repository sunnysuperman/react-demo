const gListeners = [];

const LISTENER_COMPARATOR = (item1, item2) => {
  return item2.priority - item1.priority;
};
const onChange = (listener, priority) => {
  gListeners.push({ listener, priority: priority || 0 });
  gListeners.sort(LISTENER_COMPARATOR);
};
const triggerChange = () => {
  if (gListeners.length === 0) {
    return;
  }
  const path = window.location.pathname;
  // for HashRouter
  // const path = window.location.hash.substring(1);
  gListeners.forEach((item) => {
    item.listener(path);
  });
};
const api = (navigate) => {
  return {
    back: () => {
      navigate(-1);
    },
    push: (path) => {
      if (/^http:\/\/|^https:\/\//.test(path)) {
        window.location.href = path;
        return;
      }
      if (!path.startsWith('/')) {
        path = `/${path}`;
      }
      navigate(path);
    },
    onChange,
  };
};

export default { onChange, triggerChange, api };
