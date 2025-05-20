export interface BasicMapper<Entity, Database> {
  toEntity(data: Database): Entity;
  toDatabase(data: Entity, type: 'update' | 'create');
}