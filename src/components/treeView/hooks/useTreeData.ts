import { useState } from 'react';
import type { TreeNodeData } from '../../../types';
import { removeNode } from '../../../utils/treeUtils';

export const useTreeData = () => {
    const [treeData, setTreeData] = useState<TreeNodeData[]>([
        { 
            id: '1', 
            name: 'Root Level', 
            children: [
                { id: '2', name: 'Child 1', children: [], isLoaded: true },
                { id: '3', name: 'Child 2', children: [], isLoaded: false, hasChildren: true }
            ], 
            isLoaded: true 
        }
    ]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeDragLevel, setActiveDragLevel] = useState<number | null>(null);

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [newNodeName, setNewNodeName] = useState('');

    const openAddModal = (parentId: string) => {
        setSelectedNodeId(parentId);
        setNewNodeName('');
        setIsAddModalOpen(true);
    };

    const confirmAddNode = () => {
        if (!selectedNodeId || !newNodeName.trim()) return;
        
        const recursiveAdd = (nodes: TreeNodeData[]): TreeNodeData[] => {
            return nodes.map((node) => {
                if (node.id === selectedNodeId) {
                    return {
                        ...node,
                        children: [...(node.children || []), { id: Date.now().toString(), name: newNodeName, children: [], isLoaded: true }]
                    };
                }
                return node.children ? { ...node, children: recursiveAdd(node.children) } : node;
            });
        };
        setTreeData(recursiveAdd(treeData));
        setIsAddModalOpen(false);
    };

    const openDeleteModal = (id: string) => {
        setSelectedNodeId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteNode = () => {
        if (!selectedNodeId) return;
        setTreeData(removeNode(treeData, selectedNodeId));
        setIsDeleteModalOpen(false);
        setSelectedNodeId(null);
    };

    const handleEditNode = (id: string, newName: string) => {
        const recursiveEdit = (nodes: TreeNodeData[]): TreeNodeData[] => {
            return nodes.map((node) => {
                if (node.id === id) {
                    return { ...node, name: newName };
                }
                return node.children ? { ...node, children: recursiveEdit(node.children) } : node;
            });
        };
        setTreeData(recursiveEdit(treeData));
    };

    const handleLoadChildren = async (id: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newChildren: TreeNodeData[] = [
            { id: Date.now().toString() + '-1', name: 'Lazy Child 1', children: [], isLoaded: true },
            { id: Date.now().toString() + '-2', name: 'Lazy Child 2', children: [], isLoaded: true }
        ];

        const updateNode = (nodes: TreeNodeData[]): TreeNodeData[] => {
            return nodes.map(node => {
                if (node.id === id) {
                    return { ...node, children: newChildren, isLoaded: true };
                }
                if (node.children) {
                    return { ...node, children: updateNode(node.children) };
                }
                return node;
            });
        };
        
        setTreeData(prev => updateNode(prev));
    };

    return {
        treeData,
        setTreeData,
        activeId,
        setActiveId,
        activeDragLevel,
        setActiveDragLevel,
        isAddModalOpen,
        setIsAddModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        selectedNodeId,
        newNodeName,
        setNewNodeName,
        openAddModal,
        confirmAddNode,
        openDeleteModal,
        confirmDeleteNode,
        handleEditNode,
        handleLoadChildren
    };
};
