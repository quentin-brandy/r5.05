import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

interface Availability {
    days: string;
    from: string;
    to: string;
}

interface Intervenantavailability {
    [week: string]: Availability[];
}

export default function Calendar({ intervenantavailable }: { intervenantavailable: Intervenantavailability }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        console.log(intervenantavailable);
        const parseAvailability = (availability: Availability[], week: string) => {
            const daysMap: { [key: string]: number } = {
                'lundi': 1,
                'mardi': 2,
                'mercredi': 3,
                'jeudi': 4,
                'vendredi': 5,
                'samedi': 6,
                'dimanche': 0
            };

            return availability.flatMap(({ days, from, to }) => {
                return days.split(', ').map(day => {
                    const dayNumber = daysMap[day];
                    return {
                        title: `Available ${from} - ${to}`,
                        startRecur: week === 'default' ? '2023-01-01' : `2023-W${week}`,
                        endRecur: week === 'default' ? '2023-12-31' : `2023-W${week}`,
                        daysOfWeek: [dayNumber],
                        startTime: from,
                        endTime: to
                    };
                });
            });
        };

        const allEvents = Object.entries(intervenantavailable).flatMap(([week, availability]) => {
            return parseAvailability(availability, week);
        });

        // Remove duplicate events for default week
        const uniqueEvents = allEvents.filter((event, index, self) =>
            index === self.findIndex((e) => (
                e.title === event.title && e.startTime === event.startTime && e.endTime === event.endTime && e.daysOfWeek[0] === event.daysOfWeek[0]
            ))
        );

        setEvents(uniqueEvents);
    }, [intervenantavailable]);


    const handleSelect = (selectInfo: any) => {
        const calendarApi = selectInfo.view.calendar;
    
        calendarApi.unselect(); // clear date selection
    
            const newEvent = {
               title: 'Available',
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            };
    
            setEvents([...events, newEvent]);
    
            // Calculate the week number based on the start date
            const startDate = new Date(selectInfo.startStr);
            const week = Math.ceil((((startDate.getTime() - new Date(startDate.getFullYear(), 0, 1).getTime()) / 86400000) - startDate.getDay() + 1) / 7).toString();
    
            const day = startDate.toLocaleDateString('fr-FR', { weekday: 'long' });
            const from = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const endDate = new Date(selectInfo.endStr);
            const to = endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
            if (!intervenantavailable[week]) {
                intervenantavailable[week] = [];
            }
    
            intervenantavailable[week].push({
                days: day,
                from,
                to
            });
    
            console.log(intervenantavailable);
    };

    return (
        <>
        <div className='flex flex-col h-full px-10'>
            <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            weekNumbers={true}
            firstDay={1}
            headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek'
            }}
            buttonText={{
            today: 'Aujourd\'hui'
            }}
            locale="fr"
            events={events}
            selectable={true}
            select={handleSelect}
            height="auto"
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            />
    </div>
<div className="grid grid-cols-4 gap-2 mt-4">

</div>
</>
    );
}
