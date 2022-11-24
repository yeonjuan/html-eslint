export default function debounce(func, delayMs) {
  let timer = null;
  return function call(...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      func(...args);
    }, delayMs);
  };
}
