import React, { useState , useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Intervenants } from '@/lib/definitions';
export default function Calendar (intervenant) {
    console.log(intervenant);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (intervenant.availability) {
            const initialEvents = intervenant.default.flatMap((avail) => {
                const days = avail.days.split(', ');
                return days.map((day) => ({
                    id: `${avail.id}-${day}`,
                    title: `disponible`,
                    start: `${day}T${avail.from}`,
                    end: `${day}T${avail.to}`,
                    allDay: false,
                }));
            });
            setEvents(initialEvents);
        }
    }, [intervenant]);
    if (intervenant.default) {
        const defaultAvailability = intervenant.default[0];
        const days = defaultAvailability.days.split(', ');
        const fromTime = defaultAvailability.from;
        const toTime = defaultAvailability.to;

        const additionalEvents = days.map((day, index) => ({
        id: `default-${index}`,
        title: `${intervenant.firstname} ${intervenant.lastname} - Default Availability`,
        start: `${day}T${fromTime}`,
        end: `${day}T${toTime}`,
        allDay: false,
        }));

        setEvents((prevEvents) => [...prevEvents, ...additionalEvents]);
    }


    const handleSelect = (selectInfo) => {
        let title = prompt('Enter Event Title');
        let calendarApi = selectInfo.view.calendar;

        calendarApi.unselect(); // clear date selection

        if (title) {
            setEvents([
                ...events,
                {
                    id: String(events.length + 1),
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                    allDay: selectInfo.allDay,
                },
            ]);
        }
    };

    return (
        <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            selectable={true}
            selectMirror={true}
            events={events}
            select={handleSelect}
        />
    );
};