export interface TreeNodeData {
  id: string;
  name: string;
  children?: TreeNodeData[];
  isLoaded?: boolean;
}