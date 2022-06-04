type MappingActionsGetList<T> = () => Promise<T[]>;
type MappingActionsGetById<T> = (id: string | number) => Promise<T>;
type MappingActionsCreate<T> = (id: string | number) => Promise<T>;
type MappingActionsUpdate<T> = (id: string | number, value: T) => Promise<void>;
type MappingActionsDelete = (id: string | number) => Promise<void>;

interface CollectionOptions<T> {
  primaryKey: string;
  getList: MappingActionsGetList<T> | null;
  getById: MappingActionsGetById<T> | null;
  create: MappingActionsCreate<T> | null;
  update: MappingActionsUpdate<T> | null;
  delete: MappingActionsDelete | null;
}

export class Collection<T extends { [key: string]: any }> {
  private instance: Record<string | number, T>;
  private options: CollectionOptions<T> = {
    primaryKey: "id",
    getList: null,
    getById: null,
    create: null,
    update: null,
    delete: null,
  };

  constructor(
    instance: Record<string | number, T>,
    options?: Partial<CollectionOptions<T>>
  ) {
    this.instance = instance;
    this.setOption(options);
  }

  toList() {
    return Object.values(this.instance);
  }

  setModel(value: T) {
    const id = value[this.options.primaryKey];
    const model = this.instance[id];
    if (model) {
      Object.assign(model, value);
    } else {
      this.instance[id] = value;
    }
    return this.instance[id];
  }

  async fetchModel() {
    const model: T[] = [];
    if (this.options.getList) {
      const list = await this.options.getList();
      model.push(...list);
    }
    return model.map((m) => this.setModel(m[this.options.primaryKey]));
  }

  async fetchModelById(id: string | number) {
    if (this.options.getById) {
      const model = await this.options.getById(id);
      this.setModel(model);
    }
    return this.instance[id];
  }

  async createModel(value: T) {
    const id = value[this.options.primaryKey];
    if (this.options.create) {
      const model = await this.options.create(id);
      this.setModel(model);
    }
    return this.instance[id];
  }

  async updateModel(value: T) {
    const id = value[this.options.primaryKey];
    if (Object.prototype.hasOwnProperty.call(this.instance, id)) {
      if (this.options.update) {
        await this.options.update(id, value);
        this.setModel(value);
      }
      return this.instance[id];
    }
  }

  async removeModel(id: string | number) {
    if (Object.prototype.hasOwnProperty.call(this.instance, id)) {
      if (this.options.delete) {
        await this.options.delete(id);
        delete this.instance[id];
      }
    }
  }

  clear() {
    this.instance = {};
    return this;
  }

  setOption(options?: Partial<CollectionOptions<T>>) {
    Object.assign(this.options, options);
    return this;
  }
}
