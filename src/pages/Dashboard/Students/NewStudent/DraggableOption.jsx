import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { components } from 'react-select';
import { Row, Col } from 'react-bootstrap';

const DraggableOption = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.data.value });

    const style = {
        padding: '8px 16px',
        borderBottom: '1px solid rgba(233, 234, 240, 1)',
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <components.Option {...props}>
            <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <Row className="align-items-center">
                    <Col xs="auto">
                        <div style={{ cursor: 'grab' }}>
                            <img src={props.data.icon} alt="" />
                        </div>
                    </Col>
                    <Col>
                        <span>{`${props.data.id}. ${props.data.label}`}</span>
                    </Col>
                    <Col xs="auto">
                        <div onClick={() => props.removeValue(props.data)}>
                            <img height={25} src={props.data.crossIcon} alt="" />
                        </div>
                    </Col>
                </Row>
            </div>
        </components.Option>
    );
};

export default DraggableOption;
