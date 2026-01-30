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
        <Loader2 className="h-8 w-8 animate-spin text-lacigale-accent" />
        <p className="text-gray-500 mt-4">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 p-4 rounded-xl text-red-700">{error}</div>;
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

  return (
    <div className="flex gap-5 overflow-x-auto pb-4">
      {columns.map(column => (
        <div key={column.id} className="flex-shrink-0 w-80 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-md">
          <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-lacigale-accent/5 to-lacigale-gold/5 rounded-t-2xl">
            <h3 className="font-mono font-bold text-lg text-gray-900">{column.title}</h3>
            <p className="text-xs text-gray-500 mt-1 font-mono">{column.timeRange}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-lacigale-accent/10 text-lacigale-accent text-xs font-mono font-semibold rounded-lg border border-lacigale-accent/20">
              {column.reservations.length} résa(s)
            </span>
          </div>

          <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {column.reservations.map(resa => (
              <div key={resa.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-lacigale-accent/30 transition-all duration-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-2xl font-mono font-bold text-lacigale-accent">{resa.time}</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-lacigale-accent/10 text-lacigale-accent rounded-lg text-xs font-mono font-semibold">
                    <Users className="h-3.5 w-3.5" />
                    {resa.guests}
                  </span>
                </div>

                <h4 className="font-bold text-base text-gray-900">
                  {resa.firstname} {resa.lastname?.toUpperCase()}
                </h4>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600">
                  <Phone className="h-3.5 w-3.5 text-lacigale-accent" />
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
