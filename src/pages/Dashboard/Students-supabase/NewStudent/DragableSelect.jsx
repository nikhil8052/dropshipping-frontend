// DraggableSelect.js
import { useState, useEffect } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

const animatedComponents = makeAnimated();

function DraggableSelect({ field, form, options }) {
    const [items, setItems] = useState(field.value);
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    useEffect(() => {
        setItems(field.value);
    }, [field.value]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item === active.id);
            const newIndex = items.findIndex((item) => item === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            form.setFieldValue(field.name, newItems);
        }
    };

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <Select
                    {...field}
                    isMulti
                    options={options}
                    components={{ ...animatedComponents, MultiValue: SortableItem }}
                    value={options.filter((option) => items.includes(option.value))}
                    onChange={(selectedOptions) => {
                        const value = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                        setItems(value);
                        form.setFieldValue(field.name, value);
                    }}
                />
            </SortableContext>
        </DndContext>
    );
}

export default DraggableSelect;
