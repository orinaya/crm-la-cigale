import React, { useEffect, useState } from 'react';
import { repository } from '../../dal/repository';
import { Reservation } from '../../types/dal';
import { Loader2, Users, Phone } from 'lucide-react';
import { formatPhoneNumber } from '../../utils/formatters';

type KanbanColumn = {
  id: string;
  title: string;
  timeRange: string;
  reservations: Reservation[];
};

export const ReservationKanban = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Group by time slots (Midi / Soir)
  const columns: KanbanColumn[] = [
    {
      id: 'morning',
      title: 'Déjeuner',
      timeRange: '11:30 - 14:30',
      reservations: reservations.filter(r => r.time >= '11:30' && r.time <= '14:30')
    },
    {
      id: 'afternoon',
      title: 'Entre-deux',
      timeRange: '14:31 - 18:59',
      reservations: reservations.filter(r => r.time > '14:30' && r.time < '19:00')
    },
    {
      id: 'evening',
      title: 'Dîner',
      timeRange: '19:00 - 23:00',
      reservations: reservations.filter(r => r.time >= '19:00' && r.time <= '23:00')
    }
  ];

  const columnColors: Record<string, string> = {
    morning: 'bg-pink-50 border-pink-200',
    afternoon: 'bg-blue-50 border-blue-200',
    evening: 'bg-purple-50 border-purple-200'
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(column => (
        <div key={column.id} className={`flex-shrink-0 w-80 rounded-lg border ${columnColors[column.id]}`}>
          <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
            <h3 className="font-bold text-gray-900">{column.title}</h3>
            <p className="text-xs text-gray-500">{column.timeRange}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
              {column.reservations.length} résa(s)
            </span>
          </div>

          <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {column.reservations.map(resa => (
              <div key={resa.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-bold text-gray-900">{resa.time}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    <Users className="h-3 w-3" />
                    {resa.guests}
                  </span>
                </div>

                <h4 className="font-semibold text-gray-900">
                  {resa.firstname} {resa.lastname?.toUpperCase()}
                </h4>

                <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                  <Phone className="h-3 w-3" />
                  <span className="font-mono">{formatPhoneNumber(resa.phone)}</span>
                </div>
              </div>
            ))}

            {column.reservations.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">Aucune réservation</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
