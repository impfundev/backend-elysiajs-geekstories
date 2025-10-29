import {
  EntityTarget,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  ObjectLiteral,
} from "typeorm";
import { AppDataSource } from "../config/database";

export async function getList({
  query,
  entity,
  relations,
  select,
  order,
}: {
  query: Record<string, string>;
  entity: EntityTarget<ObjectLiteral>;
  relations?: FindOptionsRelations<ObjectLiteral>;
  select?: FindOptionsSelect<ObjectLiteral>;
  order?: FindOptionsOrder<ObjectLiteral>;
}) {
  const repository = AppDataSource.getRepository(entity);
  const draw = query.draw || "1";
  const offset = parseInt(query.start || "0", 10);
  const limit = parseInt(query.length || "10", 10);
  const search = query.search;

  const [records, total] = await repository.findAndCount({
    relations,
    select,
    skip: offset,
    take: limit,
    order,
  });

  let filtered = records;
  if (search) {
    filtered = records.filter((row) => {
      const str = JSON.stringify(row).toLowerCase();
      return str.includes(search);
    });
  }
  return { draw, recordsTotal: total, recordsFiltered: total, data: filtered };
}
