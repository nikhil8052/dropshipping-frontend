import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableItem({ id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '8px 12px',
    margin: '4px 0',
    border: '1px solid #ccc',
    borderRadius: '8px',
    background: '#f9f9f9',
    cursor: 'grab',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      Item {id}
    </li>
  );
}