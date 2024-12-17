import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { convertAvailabilitiesToEvents } from '@/lib/date'; 
import { modifyIntervenantAvailability } from '@/lib/data';
import {IntervenantAvailability } from '@/lib/definitions';

interface CalendarProps {
    intervenantavailable: IntervenantAvailability & { lastModify?: string };
    intervenantid?: string;
    onLastModifyChange?: (date: string) => void;
}

export default function Calendar({ intervenantavailable, intervenantid , onLastModifyChange }: CalendarProps) {
    const calendarRef = useRef<any>(null);
    const firstCalendarRef = useRef<any>(null);
    const [defaultEvents, setDefaultEvents] = useState<any[]>([]);
    const [nonDefaultEvents, setNonDefaultEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDefaultCalendar, setIsDefaultCalendar] = useState(false);
    const [calendarKey, setCalendarKey] = useState(0);
    const [editFrom, setEditFrom] = useState('');
    const [editTo, setEditTo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [months, setMonths] = useState<Date[]>([]);


    const defaultWeek = { month: 7, week: 2 }; // Deuxième semaine d'août (mois 7)

    useEffect(() => {
        const allEvents = convertAvailabilitiesToEvents(intervenantavailable);
        const defaultEvents = allEvents.filter(event => event.isDefault);
        const nonDefaultEvents = allEvents.filter(event => !event.isDefault);
        setDefaultEvents(defaultEvents);
        setNonDefaultEvents(nonDefaultEvents);
    
        // Correction du décalage des mois
        const currentMonth = new Date();
        const monthsArray = [];
        for (let i = 0; i < 12; i++) {
            const month = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1);
            monthsArray.push(month);
        }
        setMonths(monthsArray);
        updateLastModify();
    }, [intervenantavailable]);

    const updateAvailabilityServer = async () => {
        if (!intervenantid) {
            console.error('No intervenant ID provided');
            return;
        }
        
        try {
            const update = await modifyIntervenantAvailability(intervenantid, intervenantavailable);
            console.log('Update successful:', update);
            // Optionnel: Afficher un message de succès
            console.log('Disponibilités mises à jour avec succès');
        } catch (error) {
            console.error('Error updating availability:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
            }
            // Optionnel: Afficher un message d'erreur à l'utilisateur
            setErrorMessage(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
        }
    };

    const getWeekNumber = (date: Date) => {
        const target = new Date(date.valueOf());
        const dayNumber = (date.getDay() + 6) % 7;
        target.setDate(target.getDate() - dayNumber + 3);
        const firstThursday = target.valueOf();
        target.setMonth(0, 1);
        if (target.getDay() !== 4) {
            target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    };

    const normalizeTime = (time: string , weekNum?: number ) => {
        const [hours, minutes] = time.split(':').map(Number);
        // Vérifier s'il existe déjà des événements avec cette heure
        const week = isDefaultCalendar ? 'default' : `S${weekNum}`;
        const existingFormat = intervenantavailable[week]?.some(entry => 
            entry.from.startsWith(hours.toString() + ':') || 
            entry.to.startsWith(hours.toString() + ':')
        );
    
        // Si un format existe déjà pour cette heure, l'utiliser
        if (existingFormat) {
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
        } else {
            // Sinon, utiliser le même format que les autres événements
            return hours < 10 ? 
                `${hours}:${minutes.toString().padStart(2, '0')}` : 
                `${hours}:${minutes.toString().padStart(2, '0')}`;
        }
    };

    const updateSecondCalendar = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const currentDate = calendarApi.getDate();
            const weekNum = getWeekNumber(currentDate);
            
            if (isDefaultCalendar) {
                // Si on est en mode calendrier par défaut, afficher uniquement les événements par défaut
                calendarApi.removeAllEvents();
                calendarApi.addEventSource(defaultEvents);
            } else {
                // Vérifier s'il y a des événements spécifiques pour cette semaine
                const eventsThisWeek = nonDefaultEvents.filter(event => {
                    const eventWeek = getWeekNumber(new Date(event.start));
                    return eventWeek === weekNum;
                });
    
                // Si pas d'événements cette semaine, utiliser les événements par défaut
                const events = eventsThisWeek.length > 0 ? eventsThisWeek : defaultEvents;
                
                // Mettre à jour le calendrier
                calendarApi.removeAllEvents();
                calendarApi.addEventSource(events);
            }
        }
    };

    const handleSelect = (selectInfo: any) => {
        const newEvent = {
            title: 'Disponible',
            start: selectInfo.startStr,
            end: selectInfo.endStr,
        };
    
        const startDate = new Date(selectInfo.startStr);
        const weekNum = getWeekNumber(new Date(startDate));
        const week = isDefaultCalendar ? 'default' : `S${weekNum}`;
        
        const day = startDate.toLocaleDateString('fr-FR', { weekday: 'long' });
        const from = normalizeTime(startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' } ) , weekNum);
        const endDate = new Date(selectInfo.endStr);
        const to = normalizeTime(endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), weekNum);
    
        if (!intervenantavailable[week]) {
            intervenantavailable[week] = [];
        }
    
        // Rechercher une entrée existante avec les mêmes horaires
        const existingEntryIndex = intervenantavailable[week].findIndex(entry => 
            normalizeTime(entry.from , weekNum) === from && normalizeTime(entry.to, weekNum) === to
        );
    
        if (existingEntryIndex !== -1) {
            const entry = intervenantavailable[week][existingEntryIndex];
            const days = entry.days.split(',').map(d => d.trim());
            
            if (!days.some(d => d.toLowerCase() === day.toLowerCase())) {
                days.push(day);
                entry.days = days.join(', ');
            }
        } else {
            intervenantavailable[week].push({
                days: day,
                from,
                to
            });
        }
    
        if (isDefaultCalendar) {
            setDefaultEvents(prevEvents => [...prevEvents, newEvent]);
        } else {
            setNonDefaultEvents(prevEvents => [...prevEvents, newEvent]);
        }
        updateSecondCalendar();
        updateLastModify();
        updateAvailabilityServer();
    };

    const handleEventClick = (clickInfo: any) => {
        setSelectedEvent(clickInfo.event);
        setEditFrom(clickInfo.event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
        setEditTo(clickInfo.event.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
        setIsDialogOpen(true);
        setErrorMessage('');
    };

    const handleDelete = () => {
        if (selectedEvent) {
            const startDate = selectedEvent.start;
            const weekNum = getWeekNumber(new Date(startDate));
            const week = isDefaultCalendar ? 'default' : `S${weekNum}`;
    
            // Format date strings
            const eventDay = new Date(startDate).toLocaleDateString('fr-FR', { weekday: 'long' });
            const eventFrom = new Date(startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            const eventTo = new Date(selectedEvent.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
            if (isDefaultCalendar && intervenantavailable.default) {
                // Trouver l'entrée correspondante en comparant uniquement les heures
                const entryIndex = intervenantavailable.default.findIndex(entry => {
                    const entryFromTime = entry.from.split(':').map(Number);
                    const entryToTime = entry.to.split(':').map(Number);
                    const eventFromTime = eventFrom.split(':').map(Number);
                    const eventToTime = eventTo.split(':').map(Number);
                    
                    return entryFromTime[0] === eventFromTime[0] && 
                           entryFromTime[1] === eventFromTime[1] && 
                           entryToTime[0] === eventToTime[0] && 
                           entryToTime[1] === eventToTime[1];
                });
    
                if (entryIndex !== -1) {
                    // Supprimer le jour spécifique
                    const entry = intervenantavailable.default[entryIndex];
                    const days = entry.days.split(',').map(d => d.trim());
                    const filteredDays = days.filter(d => d.toLowerCase() !== eventDay.toLowerCase());
                    
                    if (filteredDays.length === 0) {
                        // Si plus aucun jour, supprimer l'entrée complète
                        intervenantavailable.default.splice(entryIndex, 1);
                    } else {
                        // Sinon mettre à jour les jours restants
                        entry.days = filteredDays.join(', ');
                    }
    
                    // Mettre à jour l'affichage
                    setDefaultEvents(prevEvents => 
                        prevEvents.filter(event => 
                            new Date(event.start).toISOString() !== selectedEvent.start.toISOString()
                        )
                    );
                }
            } else {
                if (intervenantavailable[week]) {
                    // Trouver l'entrée qui correspond aux horaires
                    const entryIndex = intervenantavailable[week].findIndex(entry => {
                        const entryFromTime = entry.from.split(':').map(Number);
                        const entryToTime = entry.to.split(':').map(Number);
                        const eventFromTime = eventFrom.split(':').map(Number);
                        const eventToTime = eventTo.split(':').map(Number);
                        
                        return entryFromTime[0] === eventFromTime[0] && 
                               entryFromTime[1] === eventFromTime[1] && 
                               entryToTime[0] === eventToTime[0] && 
                               entryToTime[1] === eventToTime[1];
                    });
            
                    if (entryIndex !== -1) {
                        const entry = intervenantavailable[week][entryIndex];
                        const days = entry.days.split(',').map(d => d.trim());
                        
                        if (days.length > 1) {
                            // Si plusieurs jours, supprimer uniquement le jour concerné
                            const filteredDays = days.filter(d => 
                                d.toLowerCase() !== eventDay.toLowerCase()
                            );
                            entry.days = filteredDays.join(', ');
                        } else {
                            // Si un seul jour, supprimer l'entrée complète
                            intervenantavailable[week].splice(entryIndex, 1);
                        }
            
                        // Si plus d'entrées dans la semaine, supprimer la semaine
                        if (intervenantavailable[week].length === 0) {
                            delete intervenantavailable[week];
                        }
            
                        // Mettre à jour l'affichage du calendrier
                        setNonDefaultEvents(prevEvents => 
                            prevEvents.filter(event => 
                                new Date(event.start).toISOString() !== selectedEvent.start.toISOString()
                            )
                        );
                    }
                }
            }
            
            setIsDialogOpen(false);
            updateLastModify();
            updateAvailabilityServer();
        }
    };

    const handleEdit = () => {
        if (selectedEvent) {
            const startDate = selectedEvent.start;
            const weekNum = getWeekNumber(new Date(startDate));
            const week = isDefaultCalendar ? 'default' : `S${weekNum}`;
    
            const day = new Date(startDate).toLocaleDateString('fr-FR', { weekday: 'long' });
            const from = normalizeTime(new Date(startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) , weekNum);
            const to = normalizeTime(new Date(selectedEvent.end).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) , weekNum);
    
            // Normaliser les nouvelles heures
            const normalizedEditFrom = normalizeTime(editFrom,  weekNum);
            const normalizedEditTo = normalizeTime(editTo,  weekNum);
    
            // Vérification de la validité des dates
            const [editFromHours, editFromMinutes] = editFrom.split(':').map(Number);
            const [editToHours, editToMinutes] = editTo.split(':').map(Number);
            const newStartDate = new Date(startDate);
            newStartDate.setHours(editFromHours, editFromMinutes);
            const newEndDate = new Date(selectedEvent.end);
            newEndDate.setHours(editToHours, editToMinutes);
    
            if (newStartDate >= newEndDate) {
                setErrorMessage('La date de début doit être antérieure à la date de fin.');
                return;
            }
    
            if (isDefaultCalendar && intervenantavailable.default) {
                const entryIndex = intervenantavailable.default.findIndex(entry => {
                    const entryFromNorm = normalizeTime(entry.from , weekNum);
                    const entryToNorm = normalizeTime(entry.to , weekNum);
                    return entryFromNorm === from && entryToNorm === to;
                });
    
                if (entryIndex !== -1) {
                    intervenantavailable.default[entryIndex].from = normalizedEditFrom;
                    intervenantavailable.default[entryIndex].to = normalizedEditTo;
                    
                    setDefaultEvents(prevEvents => 
                        prevEvents.map(event => {
                            if (new Date(event.start).toISOString() === selectedEvent.start.toISOString()) {
                                return {
                                    ...event,
                                    start: `${event.start.split('T')[0]}T${normalizedEditFrom}`,
                                    end: `${event.end.split('T')[0]}T${normalizedEditTo}`
                                };
                            }
                            return event;
                        })
                    );
                }
            } else {
                if (intervenantavailable[week]) {
                    // Trouver l'entrée actuelle
                    const entryIndex = intervenantavailable[week].findIndex(entry => {
                        const entryFromNorm = normalizeTime(entry.from, weekNum);
                        const entryToNorm = normalizeTime(entry.to, weekNum);
                        const eventFromNorm = normalizeTime(from, weekNum);
                        const eventToNorm = normalizeTime(to, weekNum);
                        
                        return entryFromNorm === eventFromNorm && 
                               entryToNorm === eventToNorm;
                    });
            
                    // Vérifier si une entrée avec les nouveaux horaires existe déjà
                    const existingNewTimeIndex = intervenantavailable[week].findIndex(entry => {
                        const entryFromNorm = normalizeTime(entry.from, weekNum);
                        const entryToNorm = normalizeTime(entry.to, weekNum);
                        return entryFromNorm === normalizedEditFrom && 
                               entryToNorm === normalizedEditTo &&
                               entryIndex !== intervenantavailable[week].indexOf(entry); // Exclure l'entrée actuelle
                    });
            
                    if (entryIndex !== -1) {
                        const entry = intervenantavailable[week][entryIndex];
                        const days = entry.days.split(',').map(d => d.trim());
            
                        if (existingNewTimeIndex !== -1) {
                            // Si une entrée avec les nouveaux horaires existe
                            const existingEntry = intervenantavailable[week][existingNewTimeIndex];
                            const existingDays = existingEntry.days.split(',').map(d => d.trim());
            
                            // Retirer le jour de l'ancienne entrée
                            if (days.length > 1) {
                                const otherDays = days.filter(d => d.toLowerCase() !== day.toLowerCase());
                                entry.days = otherDays.join(', ');
                            } else {
                                intervenantavailable[week].splice(entryIndex, 1);
                            }
            
                            // Ajouter le jour à l'entrée existante si pas déjà présent
                            if (!existingDays.some(d => d.toLowerCase() === day.toLowerCase())) {
                                existingEntry.days = [...existingDays, day].join(', ');
                            }
                        } else {
                            // Logique existante si pas d'entrée avec les nouveaux horaires
                            if (days.length > 1) {
                                const otherDays = days.filter(d => d.toLowerCase() !== day.toLowerCase());
                                entry.days = otherDays.join(', ');
                                
                                intervenantavailable[week].push({
                                    days: day,
                                    from: normalizedEditFrom,
                                    to: normalizedEditTo
                                });
                            } else {
                                entry.from = normalizedEditFrom;
                                entry.to = normalizedEditTo;
                            }
                        }
            
                        // Mise à jour du calendrier
                        setNonDefaultEvents(prevEvents =>
                            prevEvents.map(event => {
                                if (new Date(event.start).toISOString() === selectedEvent.start.toISOString()) {
                                    const newStart = new Date(event.start);
                                    const newEnd = new Date(event.end);
                                    const [fromHours, fromMinutes] = normalizedEditFrom.split(':').map(Number);
                                    const [toHours, toMinutes] = normalizedEditTo.split(':').map(Number);
                                    
                                    newStart.setHours(fromHours, fromMinutes);
                                    newEnd.setHours(toHours, toMinutes);
                                    
                                    return {
                                        ...event,
                                        start: newStart.toISOString(),
                                        end: newEnd.toISOString()
                                    };
                                }
                                return event;
                            })
                        );
                    }
                }
            }
            setIsDialogOpen(false);
            updateLastModify();
            updateAvailabilityServer();
            }
    };

    const handleSwitchCalendar = () => {
        setIsDefaultCalendar(!isDefaultCalendar);
        setCalendarKey(prevKey => prevKey + 1);
        
        // Mise à jour uniquement du premier calendrier
        const firstCalendarApi = firstCalendarRef.current?.getApi();
        if (firstCalendarApi) {
            firstCalendarApi.removeAllEvents();
            if (!isDefaultCalendar) { // Notez le !isDefaultCalendar car l'état n'est pas encore mis à jour
                firstCalendarApi.addEventSource(defaultEvents);
            } else {
                firstCalendarApi.addEventSource(nonDefaultEvents);
            }
        }
    };

    const getDefaultWeekStart = () => {
        const year = new Date().getFullYear();
        const firstDayOfAugust = new Date(year, defaultWeek.month, 1);
        const firstDayOfWeek = firstDayOfAugust.getDay();
        const offset = (firstDayOfWeek <= 1) ? 1 - firstDayOfWeek : 8 - firstDayOfWeek;
        const firstMonday = new Date(firstDayOfAugust.setDate(firstDayOfAugust.getDate() + offset));
        return new Date(firstMonday.setDate(firstMonday.getDate() + (defaultWeek.week - 1) * 7));
    };

    const [selectedWeek, setSelectedWeek] = useState<number>(() => {
        const today = new Date();
        const currentWeek = getWeekNumber(today);
        return currentWeek;
    });

    const handleDateSelect = (selectInfo: any) => {
        const selectedDate = new Date(selectInfo.start);
        const weekNumber = getWeekNumber(selectedDate);
        setSelectedWeek(weekNumber);
    
        // Mettre à jour les deux calendriers
        const firstCalendarApi = firstCalendarRef.current?.getApi();
        const secondCalendarApi = calendarRef.current?.getApi();
    
        if (firstCalendarApi) {
            firstCalendarApi.gotoDate(selectedDate);
            firstCalendarApi.render(); // Forcer le rendu
        }
        if (secondCalendarApi) {
            secondCalendarApi.gotoDate(selectedDate);
        }
    };
    


    const getCombinedEvents = (selectedDate: Date) => {
        const weekNum = getWeekNumber(selectedDate);
        const weekKey = `S${weekNum}`;
        
        // Vérifier s'il y a des événements pour cette semaine spécifique
        const eventsThisWeek = nonDefaultEvents.filter(event => {
            const eventWeek = getWeekNumber(new Date(event.start));
            return eventWeek === weekNum;
        });
    
        // Retourner les événements de la semaine ou les événements par défaut
        return eventsThisWeek.length > 0 ? eventsThisWeek : defaultEvents;
    };
    

    const updateLastModify = () => {
        const newDate = new Date().toISOString();
        intervenantavailable.lastModify = newDate;
        if (onLastModifyChange) {
            onLastModifyChange(newDate);
        }
    };

    return (
        <div className="flex h-full px-10 space-x-8 mb-10">
        {/* Monthly View Section - Left Side avec scroll */}
        <div className="w-1/4 overflow-y-auto" style={{ maxHeight: 'calc(200vh )' }}>
            <div className="space-y-4">
                {months.map((month, index) => (
                    <div key={index} className="border p-4">
                        <h3 className="text-center font-medium">
                            {month.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                        </h3>
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={false}
            locale="fr"
            firstDay={1}
            weekends={false}
            events={nonDefaultEvents.map(event => ({
                start: event.start,
                end: event.end,
                display: 'background',
                backgroundColor: '#3B82F6',
                allDay: true
            }))}
            initialDate={month}
            height="auto"
            selectable={true}
            select={handleDateSelect}
            editable={false}
            dayCellDidMount={(info) => {
                const hasEvent = nonDefaultEvents.some(event => {
                    const eventDate = new Date(event.start);
                    return eventDate.toDateString() === info.date.toDateString();
                });
                if (hasEvent) {
                    info.el.style.backgroundColor = '#3B82F6';
                }
            }}
        />
    </div>
))}
</div>
            </div>
    
            {/* Main Calendars Section - Right Side */}
            <div className="flex-1 space-y-8">
                {/* First Calendar Section */}
                <div>
    <button onClick={handleSwitchCalendar} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        {isDefaultCalendar ? 'Retour au calendrier principal' : 'Configurer les disponibilités par défaut'}
    </button>
    <FullCalendar
    ref={firstCalendarRef}
    key={`first-calendar-${calendarKey}`} // Clé unique pour le premier calendrier
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="timeGridWeek"
    weekNumbers
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
    datesSet={(dateInfo) => {
        if (isDefaultCalendar) {
            const calendarApi = firstCalendarRef.current?.getApi();
            if (calendarApi) {
                calendarApi.removeAllEvents();
                calendarApi.addEventSource(defaultEvents);
            }
        }
    }}
/>
</div>
    
                {/* Second Calendar Section */}
                <div>
                <FullCalendar
    ref={calendarRef}
    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
    initialView="timeGridWeek"
    weekNumbers
    weekends={false}
    firstDay={1}
    headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek',
    }}
    locale="fr"
    events={nonDefaultEvents} // Commencer par afficher tous les événements
    height="auto"
    editable={false}
    allDaySlot={false}
    slotMinTime="07:00:00"
    slotMaxTime="21:00:00"
    datesSet={(dateInfo) => {
        const events = getCombinedEvents(dateInfo.start);
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.removeAllEvents();
            calendarApi.addEventSource(events);
        }
    }}
/>
                </div>
            </div>
    
            {/* Dialog */}
            {isDialogOpen && (
                <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-medium">Modifier la disponibilité</h2>
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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