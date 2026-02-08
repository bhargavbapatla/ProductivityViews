import type { TreeNodeData } from '../types';

export const findNode = (nodes: TreeNodeData[], id: string): TreeNodeData | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

export const findParentNode = (nodes: TreeNodeData[], id: string): TreeNodeData | null => {
  for (const node of nodes) {
    if (node.children && node.children.some(child => child.id === id)) return node;
    if (node.children) {
      const found = findParentNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const removeNode = (nodes: TreeNodeData[], id: string): TreeNodeData[] => {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: node.children ? removeNode(node.children, id) : []
    }));
};

export const insertNode = (nodes: TreeNodeData[], parentId: string | null, newNode: TreeNodeData, index: number): TreeNodeData[] => {
  if (parentId === null) {
    const newNodes = [...nodes];
    newNodes.splice(index, 0, newNode);
    return newNodes;
  }
  return nodes.map(node => {
    if (node.id === parentId) {
      const newChildren = [...(node.children || [])];
      newChildren.splice(index, 0, newNode);
      return { ...node, children: newChildren };
    }
    if (node.children) {
      return { ...node, children: insertNode(node.children, parentId, newNode, index) };
    }
    return node;
  });
};

export const findNodeLevel = (nodes: TreeNodeData[], id: string, currentLevel: number = 65): number | null => {
  for (const node of nodes) {
      if (node.id === id) return currentLevel;
      if (node.children) {
          const found = findNodeLevel(node.children, id, currentLevel + 1);
          if (found) return found;
      }
  }
  return null;
};