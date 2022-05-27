export function asyncDebonce<PS extends any[], R>(
  fn: (...args: PS) => Promise<R>,
  interval: number
): (...args: PS) => Promise<R> {
  let timer: any = undefined;
  return function (this: any, ...args: PS) {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(fn.apply(this, args)), interval);
    });
  };
}
