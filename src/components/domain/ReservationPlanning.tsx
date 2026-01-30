import React, { useEffect, useState } from 'react';
import { repository } from '../../dal/repository';
import { Reservation } from '../../types/dal';
import { Loader2 } from 'lucide-react';
import { format, parseISO, startOfDay, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatPhoneNumber } from '../../utils/formatters';

export const ReservationPlanning = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchReservations = async () => {
    setLoading(true);
    const result = await repository.getReservations();
    if (result.success) {
      setReservations(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-lacigale-accent" />
        <p className="text-gray-500 mt-4">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-xl text-red-700">{error}</div>;
  }

  // Filter reservations for selected date
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const dayReservations = reservations.filter(r => r.date === dateString);

  // Generate time slots (11:00 to 23:00)
  const timeSlots = Array.from({ length: 25 }, (_, i) => {
    const hour = 11 + Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const getReservationsAtTime = (time: string) => {
    return dayReservations.filter(r => r.time === time);
  };

  return (
    <div className="space-y-5">
      {/* Date Navigation */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-100 shadow-md flex items-center justify-between">
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          className="px-5 py-2.5 bg-white hover:bg-lacigale-accent/10 border border-gray-200 hover:border-lacigale-accent/30 rounded-xl font-medium transition-all duration-200"
        >
          ← Jour précédent
        </button>

        <h2 className="text-2xl font-mono font-bold text-gray-900">
          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </h2>

        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="px-5 py-2.5 bg-white hover:bg-lacigale-accent/10 border border-gray-200 hover:border-lacigale-accent/30 rounded-xl font-medium transition-all duration-200"
        >
          Jour suivant →
        </button>
      </div>

      {/* Planning Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        {timeSlots.map(time => {
          const resasAtTime = getReservationsAtTime(time);
          const hasReservations = resasAtTime.length > 0;

          return (
            <div
              key={time}
              className={`border-b border-gray-50 flex transition-colors ${hasReservations ? 'bg-gradient-to-r from-lacigale-accent/5 to-lacigale-gold/5' : 'hover:bg-gray-50/50'
                }`}
            >
              {/* Time Column */}
              <div className="w-28 flex-shrink-0 p-4 border-r border-gray-100 bg-white/50">
                <span className="font-mono font-bold text-gray-900">{time}</span>
              </div>

              {/* Reservations Column */}
              <div className="flex-1 p-4">
                {hasReservations ? (
                  <div className="flex flex-wrap gap-2">
                    {resasAtTime.map(resa => (
                      <div
                        key={resa.id}
                        className="inline-flex items-center gap-3 px-4 py-2.5 bg-white border border-lacigale-accent/30 rounded-xl shadow-sm hover:shadow-md transition-all"
                      >
                        <span className="font-bold text-gray-900">
                          {resa.firstname} {resa.lastname?.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm font-mono font-semibold text-lacigale-accent">
                          {resa.guests} pers.
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-xs font-mono text-gray-600">
                          {formatPhoneNumber(resa.phone)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-300 text-sm font-mono">Disponible</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
