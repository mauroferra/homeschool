import { ExternalActivityType } from '../db/models/index.js';
import { notFound, badRequest } from '../utils/error.js';

function dto(t) {
  const j = t.toJSON();
  return { id: j.id, name: j.name, name_en: j.nameEn, name_cs: j.nameCs, name_it: j.nameIt, created_at: j.createdAt, updated_at: j.updatedAt };
}

export async function listExternalTypes(userId) {
  const types = await ExternalActivityType.findAll({ where: { userId }, order: [['name', 'ASC']] });
  return types.map(dto);
}

export async function createExternalType(userId, data) {
  if (!data.name || !String(data.name).trim()) throw badRequest('External activity type name is required', 'VALIDATION');
  const type = await ExternalActivityType.create({
    name: String(data.name).trim(),
    nameEn: data.name_en,
    nameCs: data.name_cs,
    nameIt: data.name_it,
    userId,
  });
  return dto(type);
}

export async function updateExternalType(userId, id, data) {
  const type = await ExternalActivityType.findOne({ where: { id, userId } });
  if (!type) throw notFound('External activity type not found');
  if (data.name !== undefined) type.name = String(data.name).trim();
  if (data.name_en !== undefined) type.nameEn = data.name_en;
  if (data.name_cs !== undefined) type.nameCs = data.name_cs;
  if (data.name_it !== undefined) type.nameIt = data.name_it;
  await type.save();
  return dto(type);
}

export async function deleteExternalType(userId, id) {
  const type = await ExternalActivityType.findOne({ where: { id, userId } });
  if (!type) throw notFound('External activity type not found');
  await type.destroy();
  return { success: true };
}