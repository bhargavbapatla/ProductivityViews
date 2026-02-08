export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
  color: string; // Header background color
};

export type Card = {
  id: Id;
  columnId: Id;
  content: string;
};
export interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  deleteCard: (id: Id) => void;
  updateCardTitle: (id: Id, newTitle: string) => void;
  createCard: (columnId: Id) => void;
}