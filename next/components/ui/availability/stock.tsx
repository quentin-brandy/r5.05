import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import convertAvailabilitiesToEvents from '../../../lib/date'; // Importez la fonction depuis date.ts

interface Availability {
    days: string;
    from: string;
    to: string;
}

interface Intervenantavailability {
    [week: string]: Availability[];
}

export default function Calendar({ intervenantavailable }: { intervenantavailable: Intervenantavailability }) {
    const [defaultEvents, setDefaultEvents] = useState<any[]>([]);
    const [nonDefaultEvents, setNonDefaultEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDefaultCalendar, setIsDefaultCalendar] = useState(false);
    const [calendarKey, setCalendarKey] = useState(0);
    const [editFrom, setEditFrom] = useState('');
    const [editTo, setEditTo] = useState('');

    const defaultWeek = { month: 7, week: 2 }; // Deuxième semaine d'août (mois 7)

    useEffect(() => {
        const allEvents = convertAvailabilitiesToEvents(intervenantavailable);
        const defaultEvents = allEvents.filter((event: any) => event.isDefault);
        const nonDefaultEvents = allEvents.filter((event: any) => !event.isDefault);
        setDefaultEvents(defaultEvents);
        setNonDefaultEvents(nonDefaultEvents);
    }, [intervenantavailable]);

    const updateAvailabilityServer = async () => {
        try {
            const response = await fetch('/api/intervenants/update-availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(intervenantavailable),
            });

            if (!response.ok) {
                throw new Error('Échec de la mise à jour des disponibilités');
            }

            console.log('Disponibilités mises à jour avec succès');
        } catch (error) {
            console.error('Erreur lors de la mise à jour des disponibilités :', error);
        }
    };

    const normalizeTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };
    
    const handleSelect = (selectInfo: any) => {
        const newEvent = {
            title: 'Disponible',
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        };

        const startDate = new Date(selectInfo.startStr);
        const week = isDefaultCalendar
            ? 'default'
            : Math.ceil(((startDate.getTime() - new Date(startDate.getFullYear(), 0, 1).getTime()) / 86400000 - startDate.getDay() + 1) / 7).toString();

        const day = startDate.toLocaleDateString('fr-FR', { weekday: 'long' });
        const from = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const endDate = new Date(selectInfo.endStr);
        const to = endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        if (!intervenantavailable[week]) {
            intervenantavailable[week] = [];
        }

        const existingEntry = intervenantavailable[week].find(entry => 
            normalizeTime(entry.from) === from && normalizeTime(entry.to) === to
        );

        if (existingEntry) {
            existingEntry.days += `, ${day}`;
        } else {
            intervenantavailable[week].push({ days: day, from, to });
        }

        if (isDefaultCalendar) {
            setDefaultEvents(prevEvents => [...prevEvents, newEvent]);
        } else {
            setNonDefaultEvents(prevEvents => [...prevEvents, newEvent]);
        }
        updateAvailabilityServer();
    };

    const handleEventClick = (clickInfo: any) => {
        setSelectedEvent(clickInfo.event);
        setEditFrom(clickInfo.event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
        setEditTo(clickInfo.event.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
        setIsDialogOpen(true);
    };

    const handleDelete = () => {
        if (selectedEvent) {
            if (isDefaultCalendar) {
                setDefaultEvents(defaultEvents.filter(event => event.start !== selectedEvent.startStr));
            } else {
                setNonDefaultEvents(nonDefaultEvents.filter(event => event.start !== selectedEvent.startStr));
            }
            setIsDialogOpen(false);
        }
    };

    const handleEdit = () => {
        if (selectedEvent) {
            const updatedEvents = (isDefaultCalendar ? defaultEvents : nonDefaultEvents).map(event =>
                event.start === selectedEvent.startStr
                    ? {
                          ...event,
                          start: `${event.start.split('T')[0]}T${editFrom}`,
                          end: `${event.end.split('T')[0]}T${editTo}`,
                      }
                    : event
            );
            if (isDefaultCalendar) {
                setDefaultEvents(updatedEvents);
            } else {
                setNonDefaultEvents(updatedEvents);
            }
            setIsDialogOpen(false);
        }
    };

    const handleSwitchCalendar = () => {
        setIsDefaultCalendar(!isDefaultCalendar);
        setCalendarKey(prevKey => prevKey + 1);
    };

    const getDefaultWeekStart = () => {
        const year = new Date().getFullYear();
        const firstDayOfAugust = new Date(year, defaultWeek.month, 1);
        const firstDayOfWeek = firstDayOfAugust.getDay();
        const offset = (firstDayOfWeek <= 1) ? 1 - firstDayOfWeek : 8 - firstDayOfWeek;
        const firstMonday = new Date(firstDayOfAugust.setDate(firstDayOfAugust.getDate() + offset));
        return new Date(firstMonday.setDate(firstMonday.getDate() + (defaultWeek.week - 1) * 7));
    };

    return (
        <div className="flex flex-col h-full px-10">
            <button onClick={handleSwitchCalendar} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
                {isDefaultCalendar ? 'Retour au calendrier principal' : 'Configurer les disponibilités par défaut'}
            </button>
            <FullCalendar
                key={calendarKey}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                weekNumbers
                // onClick={handleSelect}
                weekends={false}
                firstDay={1}
                headerToolbar={
                    isDefaultCalendar
                        ? false
                        : {
                              left: 'prev,next today',
                              center: 'title',
                              right: 'timeGridWeek',
                          }
                }
                locale="fr"
                events={isDefaultCalendar ? defaultEvents : nonDefaultEvents}
                initialDate={isDefaultCalendar ? getDefaultWeekStart().toISOString().split('T')[0] : undefined}
                selectable
                select={handleSelect}
                eventClick={handleEventClick}
                height="auto"
                allDaySlot={false}
                slotMinTime="07:00:00"
                slotMaxTime="21:00:00"
            />
            {isDialogOpen && (
                <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-medium">Modifier la disponibilité</h2>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">De</label>
                            <input
                                type="time"
                                value={editFrom}
                                onChange={(e) => setEditFrom(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">À</label>
                            <input
                                type="time"
                                value={editTo}
                                onChange={(e) => setEditTo(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
                            <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded">Modifier</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}