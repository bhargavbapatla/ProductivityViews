import {
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Card } from '../types';

export const useKanbanDrag = (
  setCards: React.Dispatch<React.SetStateAction<Card[]>>,
  setActiveCard: React.Dispatch<React.SetStateAction<Card | null>>
) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px movement required to start drag
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Card') {
      setActiveCard(event.active.data.current.card);
      return;
    }
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === 'Card';
    const isOverACard = over.data.current?.type === 'Card';

    if (!isActiveACard) return;

    // Dropping a Card over another Card
    if (isActiveACard && isOverACard) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        const overIndex = cards.findIndex((t) => t.id === overId);

        if (cards[activeIndex].columnId !== cards[overIndex].columnId) {
          // Clone the cards array to avoid mutating state directly
          const newCards = [...cards];
          // Update the columnId of the active card
          newCards[activeIndex] = { 
            ...newCards[activeIndex], 
            columnId: newCards[overIndex].columnId 
          };
          
          return arrayMove(newCards, activeIndex, overIndex);
        }

        return arrayMove(cards, activeIndex, overIndex);
      });
    }

    // Dropping a Card over a Column
    const isOverAColumn = over.data.current?.type === 'Column';
    if (isActiveACard && isOverAColumn) {
      setCards((cards) => {
        const activeIndex = cards.findIndex((t) => t.id === activeId);
        
        if (cards[activeIndex].columnId !== overId) {
          return cards.map((card, index) => 
            index === activeIndex 
              ? { ...card, columnId: overId as string } 
              : card
          );
        }
        return cards;
      });
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;
    
    // Final reordering if needed (usually handled by onDragOver for fluidity, but good to ensure)
  }

  return {
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd
  };
};
