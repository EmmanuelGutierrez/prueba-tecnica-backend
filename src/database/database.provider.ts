import { Injectable } from '@nestjs/common';
import { Database, ModelType } from './database';

@Injectable()
export class DatabaseProvider {
  constructor(private readonly model: keyof typeof Database) {}

  find({
    populateFields,
    query,
    // order = 'id',
    // orderBy = 'ASC',
    // limit = 3,
    // skip = 4,
  }: {
    query?: Partial<ModelType<typeof this.model>>;
    populateFields?: {
      model: keyof typeof Database;
      localField: string;
      foreignField: string;
      fieldName?: string;
    }[];
    // limit?: number;
    // skip?: number;
    // order?: string;
    // orderBy?: 'ASC' | 'DESC';
  }) {
    const result = Database[this.model].filter((data) => {
      for (const key in query) {
        if (data[key] !== query[key]) return false;
      }
      return true;
    });
    // result.sort((a, b) =>
    //   a[order] > b[order]
    //     ? orderBy === 'ASC'
    //       ? 1
    //       : -1
    //     : orderBy === 'DESC'
    //       ? -1
    //       : 1,
    // );
    // result.slice(skip, skip + limit);
    if (populateFields) {
      const populateResult = result.map((data) => {
        const populatedItem = { ...data };
        populateFields.forEach((populateField) => {
          const relatedItems = Database[populateField.model].find(
            (relatedItem) =>
              relatedItem[populateField.foreignField] ===
              populatedItem[populateField.localField],
          );
          populatedItem[populateField.fieldName ?? populateField.model] =
            relatedItems;
        });
        return populatedItem;
      });
      return populateResult;
    }

    return result;
  }

  findOneById(id: string) {
    return Database[this.model].find((data) => data.id === id);
  }

  findOne(query: Partial<ModelType<typeof this.model>>) {
    return Database[this.model].find((data) => {
      for (const key in query) {
        if (data[key] !== query[key]) return false;
      }
      return true;
    });
  }

  deleteById(id: string) {
    const index = Database[this.model].findIndex(
      (data: ModelType<typeof this.model>) => data.id === id,
    );
    if (index !== -1) {
      Database[this.model].splice(index, 1);
      return true;
    }
    return false;
  }
  create(newData: ModelType<typeof this.model>) {
    (Database[this.model] as unknown as ModelType<typeof this.model>[]).push(
      newData,
    );
    return newData;
  }
  updateById(id: string, newData: Partial<ModelType<typeof this.model>>) {
    const oldData = Database[this.model].find((data) => data.id === id);
    if (oldData) {
      Object.assign(oldData, newData);
    }
    return oldData;
  }
}
