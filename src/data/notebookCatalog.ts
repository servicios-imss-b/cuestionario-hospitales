import catalogRows from './notebook-clues.json';
import { Clues, Entity } from '../types/questionnaire';

interface NotebookCluesRow {
  clues_imb: string;
  entidad: string;
  nombre_de_la_unidad: string;
  nombre_region: string;
}

const rows = catalogRows as NotebookCluesRow[];

export const normalizeCatalogText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const entityIdForName = (name: string): string =>
  normalizeCatalogText(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const MEXICAN_ENTITIES: Entity[] = Array.from(new Set(rows.map((row) => row.entidad)))
  .sort((first, second) => first.localeCompare(second, 'es-MX'))
  .map((name) => ({ id: entityIdForName(name), name }));

export const SAMPLE_CLUES: Clues[] = rows.map((row) => ({
  clues: row.clues_imb,
  entityId: entityIdForName(row.entidad),
  name: row.nombre_de_la_unidad,
  tipo: 'Hospital',
  region: row.nombre_region || undefined,
}));

export function getRegionsForEntity(entityId: string): string[] {
  return Array.from(new Set(
    SAMPLE_CLUES
      .filter((item) => item.entityId === entityId && item.region)
      .map((item) => item.region as string)
  )).sort((first, second) => first.localeCompare(second, 'es-MX'));
}

export function searchClues(entityId: string, searchTerm: string): Clues[] {
  if (!entityId) return [];
  const entityClues = SAMPLE_CLUES.filter((item) => item.entityId === entityId);
  if (!searchTerm.trim()) return entityClues;

  const term = normalizeCatalogText(searchTerm.trim());
  return entityClues.filter(
    (item) =>
      normalizeCatalogText(item.clues).includes(term) ||
      normalizeCatalogText(item.name).includes(term) ||
      normalizeCatalogText(item.tipo).includes(term)
  );
}

export function buildCustomClues(entityId: string, customCode: string, customName: string): Clues {
  return {
    clues: customCode.toUpperCase().trim(),
    entityId,
    name: customName.trim(),
    tipo: 'Establecimiento Médico Capturado',
    region: 'No asignada',
  };
}

export function buildRegionalClues(entityId: string, region: string): Clues {
  const regionId = normalizeCatalogText(region).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    clues: `REG-${entityId}-${regionId}`.toUpperCase(),
    entityId,
    name: region,
    tipo: 'Región de Coordinación',
    region,
  };
}