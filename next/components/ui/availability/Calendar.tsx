import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { convertAvailabilitiesToEvents } from '../../../lib/date'; // Importez la fonction depuis date.ts

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
    const [errorMessage, setErrorMessage] = useState('');

    const defaultWeek = { month: 7, week: 2 }; // Deuxième semaine d'août (mois 7)

    useEffect(() => {
        const allEvents = convertAvailabilitiesToEvents(intervenantavailable);
        const defaultEvents = allEvents.filter(event => event.isDefault);
        const nonDefaultEvents = allEvents.filter(event => !event.isDefault);
        setDefaultEvents(defaultEvents);
        setNonDefaultEvents(nonDefaultEvents);
    }, [intervenantavailable]);

    const updateAvailabilityServer = async () => {
        console.log('Updated intervenantavailable:', intervenantavailable);
        // try {
        //     const response = await fetch('/api/intervenants/update-availability', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(intervenantavailable),
        //     });

        //     if (!response.ok) {
        //         throw new Error('Échec de la mise à jour des disponibilités');
        //     }

        //     console.log('Disponibilités mises à jour avec succès');
        // } catch (error) {
        //     console.error('Erreur lors de la mise à jour des disponibilités :', error);
        // }
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
            updateAvailabilityServer();
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