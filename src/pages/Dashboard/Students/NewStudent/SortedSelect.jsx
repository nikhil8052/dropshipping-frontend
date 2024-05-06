// import React, { useState } from 'react';
// import Select, { components } from 'react-select';
// import makeAnimated from 'react-select/animated';
// import {
//     DndContext,
//     closestCenter,
//     KeyboardSensor,
//     PointerSensor,
//     useSensor,
//     useSensors,
//     MouseSensor
// } from '@dnd-kit/core';
// import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const animatedComponents = makeAnimated();

// // const SortableMultiValue = (props) => {
// //     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.data.value });

// //     const style = {
// //         ...props.innerProps.style,
// //         transform: CSS.Transform.toString(transform),
// //         transition
// //     };

// //     return (
// //         <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
// //             <components.MultiValue {...props} innerProps={{ ...props.innerProps, style }} />
// //         </div>
// //     );
// // };

// const SortableMultiValue = (props) => {
//     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
//         id: `draggable-item-${props.data.value}`
//     });

//     const style = {
//         ...props.innerProps.style,
//         transform: CSS.Transform.toString(transform),
//         transition
//     };

//     // We need to apply the setNodeRef, ...attributes, and ...listeners to the container element that we want to be draggable.
//     return (
//         <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//             <components.MultiValueContainer {...props}>{props.children}</components.MultiValueContainer>
//         </div>
//     );
// };

// // In your SortableSelect component, make sure the `id` you provide to `useSortable` matches the one you created in SortableMultiValue

// const SortableSelect = ({ options, value, onChange }) => {
//     const [items, setItems] = useState(value || []);

//     const sensors = useSensors(useSensor(PointerSensor), useSensor(MouseSensor), useSensor(KeyboardSensor));

//     const handleDragEnd = (event) => {
//         const { active, over } = event;
//         if (over && active.id !== over.id) {
//             const oldIndex = items.findIndex((item) => item.value === active.id);
//             const newIndex = items.findIndex((item) => item.value === over.id);
//             const newItems = arrayMove(items, oldIndex, newIndex);
//             setItems(newItems);
//             onChange(newItems.map((item) => item.value));
//         }
//     };

//     return (
//         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//             <SortableContext items={items} strategy={verticalListSortingStrategy}>
//                 <Select
//                     isMulti
//                     options={options}
//                     value={items}
//                     onChange={(selectedItems) => {
//                         setItems(selectedItems || []);
//                         onChange(selectedItems.map((item) => item.value));
//                     }}
//                     components={{ MultiValue: SortableMultiValue, ...animatedComponents }}
//                     closeMenuOnSelect={false}
//                 />
//             </SortableContext>
//         </DndContext>
//     );
// };

// export default SortableSelect;
