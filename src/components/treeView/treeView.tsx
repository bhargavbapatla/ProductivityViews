import React, { useState } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    DropAnimation
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TreeNode from './treeNode';
import type { TreeNodeData } from '../../types';
import './treeView.css';
import { findNode, findParentNode, removeNode, insertNode } from '../../utils/treeUtils';
import { Modal } from '../common/Modal';

const findNodeLevel = (nodes: TreeNodeData[], id: string, currentLevel: number = 65): number | null => {
    for (const node of nodes) {
        if (node.id === id) return currentLevel;
        if (node.children) {
            const found = findNodeLevel(node.children, id, currentLevel + 1);
            if (found) return found;
        }
    }
    return null;
};

export const TreeView: React.FC = () => {
    // Requirement: Initial mock data
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // -- Modal Handlers --

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

    const handleInlineEdit = (id: string, newName: string) => {
        const recursiveEdit = (nodes: TreeNodeData[]): TreeNodeData[] => {
            return nodes.map((node) => {
                if (node.id === id) return { ...node, name: newName };
                return node.children ? { ...node, children: recursiveEdit(node.children) } : node;
            });
        };
        setTreeData(recursiveEdit(treeData));
    };


    // -- DnD Handlers --

    const handleDragStart = (event: DragStartEvent) => {
        const id = event.active.id as string;
        setActiveId(id);
        setActiveDragLevel(findNodeLevel(treeData, id));
    };

    const handleDragOver = (event: DragOverEvent) => {
        // Optional: Implement complex logic for expanding nodes on hover
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        setActiveDragLevel(null);

        if (!over) return;
        if (active.id === over.id) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the node being dragged and the node it was dropped over
        const activeNode = findNode(treeData, activeId);
        const overNode = findNode(treeData, overId);

        if (!activeNode || !overNode) return;

        // Find their parents
        const activeParent = findParentNode(treeData, activeId);
        const overParent = findParentNode(treeData, overId);

        // Requirement: Restrict drag & drop to same hierarchy level (siblings only)
        if (activeParent?.id !== overParent?.id) {
            return;
        }

        // Reordering within the same parent
        // If root level (activeParent is null), we are reordering roots
        const nodes = activeParent ? activeParent.children! : treeData;
        
        const oldIndex = nodes.findIndex(n => n.id === activeId);
        const newIndex = nodes.findIndex(n => n.id === overId);

        if (activeParent) {
            // Update child list of parent
            const newChildren = arrayMove(nodes, oldIndex, newIndex);
            const updateChildren = (currentNodes: TreeNodeData[]): TreeNodeData[] => {
                return currentNodes.map(node => {
                    if (node.id === activeParent.id) {
                        return { ...node, children: newChildren };
                    }
                    if (node.children) {
                        return { ...node, children: updateChildren(node.children) };
                    }
                    return node;
                });
            };
            setTreeData(updateChildren(treeData));
        } else {
            // Update root list
            setTreeData(arrayMove(treeData, oldIndex, newIndex));
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="tree-container">
                <SortableContext 
                    items={treeData.map(n => n.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="tree-list tree-root">
                        {treeData.map((node) => (
                            <TreeNode
                                key={node.id}
                                node={node}
                                levelCode={65}
                                onAdd={openAddModal}
                                onDelete={openDeleteModal}
                                onEdit={handleInlineEdit}
                                onLoadChildren={handleLoadChildren}
                                activeDragLevel={activeDragLevel}
                            />
                        ))}
                    </ul>
                </SortableContext>
                
                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <div className="node-item" style={{ background: 'white', border: '1px solid #ccc', borderRadius: '8px', padding: '8px 12px' }}>
                           {findNode(treeData, activeId)?.name || 'Drag Item'}
                        </div>
                    ) : null}
                </DragOverlay>

                {/* Add Node Modal */}
                <Modal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    title="Add New Node"
                    onSubmit={confirmAddNode}
                    submitLabel="Add"
                >
                    <p>Enter the name for the new node:</p>
                    <input 
                        type="text" 
                        className="modal-input" 
                        value={newNodeName}
                        onChange={(e) => setNewNodeName(e.target.value)}
                        placeholder="Node Name"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && confirmAddNode()}
                    />
                </Modal>

                {/* Delete Node Modal */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Delete Node"
                    onSubmit={confirmDeleteNode}
                    submitLabel="Delete"
                    isDestructive
                >
                    <p>Are you sure you want to delete this node? This action cannot be undone.</p>
                </Modal>

            </div>
        </DndContext>
    );
};
