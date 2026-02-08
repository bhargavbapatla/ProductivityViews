import React from 'react';
import {
    DndContext,
    closestCorners,
    DragOverlay,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import type {
    DropAnimation
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TreeNode from './treeNode';
import './treeView.css';
import { findNode } from '../../utils/treeUtils';
import { Modal } from '../common/Modal';
import { useTreeData } from './hooks/useTreeData';
import { useTreeDrag } from './hooks/useTreeDrag';

export const TreeView: React.FC = () => {
    const {
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
        newNodeName,
        setNewNodeName,
        openAddModal,
        confirmAddNode,
        openDeleteModal,
        confirmDeleteNode,
        handleEditNode,
        handleLoadChildren
    } = useTreeData();

    const {
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    } = useTreeDrag({
        treeData,
        setTreeData,
        setActiveId,
        setActiveDragLevel
    });

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
                                onEdit={handleEditNode}
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
