export const getUniqId = () => {
  return performance.now().toString(36).replace(/\./, '');
}