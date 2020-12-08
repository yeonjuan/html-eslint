const queryParamsState = {
  get() {
    try {
      const decoded = decodeURIComponent(
        escape(atob(location.hash.replace("#", "")))
      );
      return JSON.parse(decoded);
    } catch {}
    return {};
  },
  set(state) {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    location.hash = encoded;
  },
};

export default queryParamsState;
