import { useEffect, useState } from 'react';
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
import { Col, Row } from 'react-bootstrap';
const RoadMapList = ({ coursesList, setCoursesMap }) => {
    const [courses, setCourses] = useState(coursesList || []);
    const sensors = useSensors(useSensor(PointerSensor), useSensor(MouseSensor), useSensor(KeyboardSensor));
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = courses.findIndex((course) => course.id === active.id);
            const newIndex = courses.findIndex((course) => course.id === over.id);
            const newCourses = arrayMove(courses, oldIndex, newIndex);

            setCourses(newCourses);
            setCoursesMap(newCourses.map((el) => el.id));
        }
    };

    useEffect(() => {
        if (coursesList?.length > 0) {
            setCourses(coursesList);
        } else {
            setCourses([]);
        }
    }, [coursesList?.length]);
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
const DraggableCourse = ({ id, course, keyIndex, key }) => {
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

    return (
        <div key={key} ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <div
                style={{
                    padding: '8px 16px'
                }}
            >
                <Row className="align-items-center">
                    <Col xs="auto">
                        <div style={{ cursor: 'grab' }}>
                            <img src={coursesPointer} alt="" />
                        </div>
                    </Col>
                    <Col>
                        <span>{`${keyIndex + 1}. ${course.label || course.title}`}</span>
                    </Col>
                </Row>
            </div>
        </div>
    );
};
export default RoadMapList;
