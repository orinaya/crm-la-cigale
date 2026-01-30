import React, { useEffect, useState } from 'react';
import { repository } from '../../dal/repository';
import { Reservation } from '../../types/dal';
import { Button } from '../ui/Button';
import { Loader2, Trash2, Phone, Mail, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatPhoneNumber, groupReservationsByDate } from '../../utils/formatters';

export const ReservationList = ({ refreshTrigger }: { refreshTrigger: number }) => {
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

  const handleDelete = async (id: string) => {
    if (confirm("Confirmer la suppression ?")) {
      await repository.deleteReservation(id);
      fetchReservations();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-lacigale-accent" />
        <p className="text-gray-500">Chargement des réservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 border border-red-200 rounded-xl text-red-700">
        {error}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 mb-4">Le service est calme. Aucune réservation.</p>
      </div>
    );
  }

  const groupedReservations = groupReservationsByDate(reservations);

  return (
    <div className="space-y-6">
      {Array.from(groupedReservations.entries()).map(([date, resas]) => (
        <div key={date} className="space-y-3">
          {/* En-tête de date */}
          <div className="bg-gradient-to-r from-lacigale-accent to-lacigale-gold text-white px-6 py-3 rounded-xl shadow-md">
            <h2 className="font-mono font-bold text-lg">
              {format(parseISO(date), 'EEEE d MMMM yyyy', { locale: fr })}
            </h2>
          </div>

          {/* Cartes de réservations */}
          <div className="grid gap-3">
            {resas.map((resa) => (
              <div
                key={resa.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-200 hover:border-lacigale-accent/30"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Heure - TRÈS PROÉMINENTE */}
                  <div className="flex-shrink-0">
                    <div className="text-5xl font-mono font-bold text-lacigale-accent">
                      {resa.time}
                    </div>
                  </div>

                  {/* Infos client */}
                  <div className="flex-1 space-y-2">
                    <div className="font-bold text-xl text-gray-900">
                      {resa.firstname} {resa.lastname?.toUpperCase()}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {resa.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-lacigale-accent" />
                          <span className="font-mono">{formatPhoneNumber(resa.phone)}</span>
                        </div>
                      )}
                      {resa.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-lacigale-accent" />
                          <span>{resa.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guests + Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-lacigale-accent/10 text-lacigale-accent px-4 py-2 rounded-xl font-mono font-semibold">
                      <Users className="h-4 w-4" />
                      <span>{resa.guests}</span>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(resa.id)}
                      className="!p-2 hover:!bg-red-50 hover:!text-red-500 hover:!border-red-200"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
