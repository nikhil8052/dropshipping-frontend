import { useState } from 'react';
import Select from 'react-select';
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import DraggableOption from './DraggableOption';

const CustomSelect = ({ options, onChange }) => {
    const [items, setItems] = useState(options);
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.value === active.id);
            const newIndex = items.findIndex((item) => item.value === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            // Call onChange if you're managing state outside or if options need to be updated elsewhere
            onChange(newItems);
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((item) => item.value)}>
                <Select options={items} components={{ Option: DraggableOption }} isMulti />
            </SortableContext>
        </DndContext>
    );
};

export default CustomSelect;
