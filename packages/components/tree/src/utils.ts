import { type TreeModel } from './tree-model.js';

export function modelToList<T>(model?: TreeModel<T>): T[] {
  return model?.dataNodes || [];
}
