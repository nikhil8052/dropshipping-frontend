import { addHours, isAfter, isBefore } from 'date-fns';
import GreenDot from '@icons/dot-green.svg';
import BlueDot from '@icons/dot-blue.svg';
const EventComponent = ({ event, title, onEventClick }) => {
    const now = new Date();
    const soon = addHours(now, 1);

    // Determine if the event is active or upcoming
    const isActiveEvent = (isAfter(now, event.start) && isBefore(now, event.end)) || isBefore(event.start, soon);
    const eventClass = isActiveEvent ? 'active-event' : 'future-event';

    return (
        <div onClick={onEventClick} className={`rbc-event ${eventClass}`}>
            <div className="rbc-event-content">
                <p>
                    <img className="me-2 mb-1" src={isActiveEvent ? GreenDot : BlueDot} alt="" /> {title}
                </p>
            </div>
        </div>
    );
};

export default EventComponent;
