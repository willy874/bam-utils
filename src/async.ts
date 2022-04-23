type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

export function asyncAction(
  funcs: AsyncFunction[],
  initData?: unknown
): Promise<unknown> {
  return new Promise((resolve, reject) => {
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
