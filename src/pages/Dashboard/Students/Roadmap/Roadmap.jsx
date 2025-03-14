import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    MouseSensor
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import coursesPointer from '@icons/courses_pointer.svg';
const Roadmap = ({ coursesModal }) => {
    // State to manage the courses array
    const [courses, setCourses] = useState(coursesModal.data || []);
    // Sensors to handle different input methods
    const sensors = useSensors(useSensor(PointerSensor), useSensor(MouseSensor), useSensor(KeyboardSensor));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = courses.findIndex((course) => course.id === active.id);
            const newIndex = courses.findIndex((course) => course.id === over.id);
            const newCourses = arrayMove(courses, oldIndex, newIndex);
            setCourses(newCourses); // Update the state with the new courses array
        }
    };
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={courses} strategy={verticalListSortingStrategy}>
                <div className="course-wrapper">
                    {courses?.map((course, index) => (
                        <DraggableCourse keyIndex={index} key={course.id} id={course.id} course={course} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};
const DraggableCourse = ({ id, course, keyIndex }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    // Style transformations and drag handle styling
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        backgroundColor: '#fff', // white background
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)', // subtle shadow
        borderRadius: '8px', // rounded corners
        padding: '10px 20px', // padding around text
        marginBottom: '10px', // space between items
        display: 'flex',
        alignItems: 'center',
        cursor: 'grab' // cursor change when hovering
    };
    // Define status color based on course progress
    const statusColors = {
        Completed: 'green',
        OnGoing: 'orange',
        NotStarted: 'grey'
    };
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <div style={{ marginRight: '20px' }}>
                <img src={coursesPointer} alt="" />
            </div>{' '}
            {/* Unicode characters as drag handle */}
            <div style={{ flex: 1 }}>
                <strong>Course {keyIndex + 1}</strong>
                <div style={{ color: statusColors[course.progress.replace('Progress : ', '')] }}>
                    {' '}
                    <span
                        style={{
                            color: 'rgba(128, 128, 128, 1)'
                        }}
                    >
                        {course.title}
                    </span>{' '}
                    <span
                        style={{
                            color:
                                course.progress === 'Completed'
                                    ? ' rgba(64, 197, 158, 1)'
                                    : course.progress === 'OnGoing'
                                      ? 'rgba(1, 158, 216, 1)'
                                      : 'rgba(0, 0, 0, 1)'
                        }}
                    >
                        {' '}
                        (Progress: {course.progress})
                    </span>
                </div>
            </div>
        </div>
    );
};
export default Roadmap;
