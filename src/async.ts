type AsyncFunction<T> = (...args: T[]) => Promise<T>;

export function asyncAction<T = unknown>(
  funcs: AsyncFunction<T>[],
  initData: T
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    (async function () {
      let data = initData;
      for (let index = 0; index < funcs.length; index++) {
        const func = funcs[index];
        if (typeof func === "function") {
          try {
            data = await func(data);
          } catch (error) {
            reject(error);
          }
        }
      }
      resolve(data);
    })();
  });
}
