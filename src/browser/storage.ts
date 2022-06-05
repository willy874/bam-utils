export type StorageGetter = (value: string | null) => string;

export type StorageSetter = (value: string) => string;

export class StorageManager {
  private readonly storage: Storage;
  private instance: Record<string, string> = {};
  private lifecycle: Record<string, number> = {};
  private getter?: StorageGetter;
  private setter?: StorageSetter;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  init(data: string[] | Record<string, string>) {
    if (Array.isArray(data)) {
      data.forEach((key) => {
        const value = this.getItem(key);
        if (value || value === "") {
          this.instance[key] = value;
        }
      });
    } else {
      for (const key in data) {
        const value = this.getItem(key);
        if (value || value === "") {
          this.instance[key] = value;
        } else {
          this.setItem(key, data[key]);
        }
      }
    }
    return this;
  }

  getInstance() {
    return Object.assign({}, this.instance);
  }

  forEach(callback: (value: string, key: string) => void) {
    Object.keys(this.instance).forEach((key) => {
      callback(this.instance[key], key);
    });
  }

  useProxy(getter: StorageGetter, setter: StorageSetter) {
    this.getter = getter;
    this.setter = setter;
    return this;
  }

  getItem(key: string) {
    const value = this.storage.getItem(key);
    if (Date.now() > this.lifecycle[key]) {
      this.removeItem(key);
      return null;
    }
    return this.getter ? this.getter(value) : value;
  }

  setItem(key: string, value: string, life?: number) {
    if (this.setter) {
      this.instance[key] = this.setter(value);
    } else {
      this.instance[key] = value;
    }
    if (life) {
      this.lifecycle[key] = Date.now() + life;
    }
    this.storage.setItem(key, this.instance[key]);
    return this;
  }

  extendLifecycle(key: string, life: number) {
    this.lifecycle[key] = this.lifecycle[key] + life;
    return this;
  }

  clear() {
    this.instance = {};
    this.lifecycle = {};
    this.storage.clear();
    return this;
  }

  removeItem(key: string) {
    delete this.instance[key];
    delete this.lifecycle[key];
    this.storage.removeItem(key);
    return this;
  }
}
