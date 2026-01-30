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
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-gray-500 mt-4">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-lg text-red-700">{error}</div>;
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
    <div className="space-y-4">
      {/* Date Navigation */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
        >
          ← Jour précédent
        </button>

        <h2 className="text-xl font-bold text-gray-900">
          {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </h2>

        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
        >
          Jour suivant →
        </button>
      </div>

      {/* Planning Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {timeSlots.map(time => {
          const resasAtTime = getReservationsAtTime(time);
          const hasReservations = resasAtTime.length > 0;

          return (
            <div
              key={time}
              className={`border-b border-gray-100 flex ${hasReservations ? 'bg-gray-50' : ''}`}
            >
              {/* Time Column */}
              <div className="w-24 flex-shrink-0 p-3 border-r border-gray-200 bg-gray-50">
                <span className="font-semibold text-gray-700">{time}</span>
              </div>

              {/* Reservations Column */}
              <div className="flex-1 p-3">
                {hasReservations ? (
                  <div className="flex flex-wrap gap-2">
                    {resasAtTime.map((resa, index) => {
                      const colors = [
                        'bg-pink-100 border-pink-300',
                        'bg-blue-100 border-blue-300',
                        'bg-purple-100 border-purple-300',
                        'bg-green-100 border-green-300',
                        'bg-yellow-100 border-yellow-300'
                      ];
                      return (
                      <div
                        key={resa.id}
                        className={`inline-flex items-center gap-2 px-3 py-2 ${colors[index % colors.length]} border rounded-lg`}
                      >
                        <span className="font-bold text-gray-900">
                          {resa.firstname} {resa.lastname?.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm font-semibold text-green-700">
                          {resa.guests} pers.
                        </span>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-xs font-mono text-gray-600">
                          {formatPhoneNumber(resa.phone)}
                        </span>
                      </div>
                    )})}
                  </div>
                ) : (
                  <span className="text-gray-300 text-sm">Disponible</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
