import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
} from '@dnd-kit/core';
import type {
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { findNode, findParentNode, findNodeLevel } from '../../../utils/treeUtils';
import type { TreeNodeData } from '../../../types';

interface UseTreeDragProps {
    treeData: TreeNodeData[];
    setTreeData: React.Dispatch<React.SetStateAction<TreeNodeData[]>>;
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
    setActiveDragLevel: React.Dispatch<React.SetStateAction<number | null>>;
}

export const useTreeDrag = ({
    treeData,
    setTreeData,
    setActiveId,
    setActiveDragLevel
}: UseTreeDragProps) => {
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

    const handleDragStart = (event: DragStartEvent) => {
        const id = event.active.id as string;
        setActiveId(id);
        setActiveDragLevel(findNodeLevel(treeData, id));
    };

    const handleDragOver = (_event: DragOverEvent) => {
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

    return {
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd
    };
};
