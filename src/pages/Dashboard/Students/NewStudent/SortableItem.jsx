// SortableItem.js
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ children, ...props }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: props.data.value
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: 1000
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}
