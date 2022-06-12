type AsyncFunction = (...args: any[]) => Promise<any> | any;

export function asyncAction<T extends AsyncFunction>(
  funcs: T[],
  initData: Parameters<AsyncFunction>[0]
): Promise<any> {
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
