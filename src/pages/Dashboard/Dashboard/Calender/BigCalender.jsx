/* eslint-disable */
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import EventComponent from './CustomEvent';
import CustomHeader from './CustomHeader';
import CustomToolbar from './CustomToolbar';
import { isAfter, isBefore } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const locales = {
    'en-US': enUS
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const BigCalender = ({
    onEventClick,
    events,
    googleCalendar = false,
    handleGoogleCalendarClick,
    calendarHeight = 500
}) => {
    const eventStyleGetter = (event, start, end) => {
        const now = new Date();
        const style = {
            backgroundColor: isBefore(end, now) ? '#d6d6d6' : isAfter(start, now) ? '#7dba7d' : '#3174ad',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
    };

    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: calendarHeight }}
            views={['day', 'week', 'month']}
            step={60}
            showMultiDayTimes
            defaultDate={new Date()}
            defaultView="month"
            formats={{
                dayFormat: (date, culture, localizer) => localizer.format(date, 'EEE MMM dd', culture),
                weekdayFormat: (date, culture, localizer) => localizer.format(date, 'EEEE', culture)
            }}
            eventPropGetter={eventStyleGetter}
            components={{
                // eslint-disable-next-line
                month: {
                    event: ({ event, title }) => {
                        return <EventComponent event={event} title={title} onEventClick={() => onEventClick(event)} />;
                    }
                },
                header: CustomHeader,
                toolbar: (props) => (
                    <CustomToolbar
                        {...props}
                        googleCalendar={googleCalendar}
                        handleGoogleCalendarClick={handleGoogleCalendarClick}
                    />
                )
            }}
        />
    );
};

export default BigCalender;
