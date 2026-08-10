import { ExternalActivityType } from '../db/models/index.js';
import { notFound, badRequest } from '../utils/error.js';

function dto(t) {
  const j = t.toJSON();
  return { id: j.id, name: j.name, name_en: j.name_en, name_cs: j.name_cs, name_it: j.name_it, created_at: j.createdAt, updated_at: j.updatedAt };
}

export async function listExternalTypes(userId) {
  const types = await ExternalActivityType.findAll({ where: { userId }, order: [['name', 'ASC']] });
  return types.map(dto);
}

export async function createExternalType(userId, data) {
  if (!data.name || !String(data.name).trim()) throw badRequest('External activity type name is required', 'VALIDATION');
  const type = await ExternalActivityType.create({ name: String(data.name).trim(), userId });
  return dto(type);
}

export async function updateExternalType(userId, id, data) {
  const type = await ExternalActivityType.findOne({ where: { id, userId } });
  if (!type) throw notFound('External activity type not found');
  if (data.name !== undefined) type.name = String(data.name).trim();
  await type.save();
  return dto(type);
}

export async function deleteExternalType(userId, id) {
  const type = await ExternalActivityType.findOne({ where: { id, userId } });
  if (!type) throw notFound('External activity type not found');
  await type.destroy();
  return { success: true };
}