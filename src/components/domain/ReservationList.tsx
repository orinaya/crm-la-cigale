import React, { useEffect, useState } from 'react';
import { repository } from '../../dal/repository';
import { Reservation } from '../../types/dal';
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
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-gray-500">Chargement des réservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
        <p className="text-gray-500 mb-4">Le service est calme. Aucune réservation.</p>
      </div>
    );
  }

  // Grouper les réservations par date
  const groupedByDate = groupReservationsByDate(reservations);
  
  // Trier les dates
  const sortedDates = Array.from(groupedByDate.keys()).sort();

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => {
        const dayReservations = groupedByDate.get(date) || [];
        // Trier par heure pour chaque jour
        const sortedReservations = dayReservations.sort((a, b) => a.time.localeCompare(b.time));
        
        return (
          <div key={date} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* En-tête de date */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">
                {format(parseISO(date), 'EEEE d MMMM yyyy', { locale: fr })}
              </h2>
            </div>

            {/* Liste des réservations du jour */}
            <div className="divide-y divide-gray-100">
              {sortedReservations.map((resa) => (
                <div key={resa.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-6">
                  {/* Heure (très mise en avant) */}
                  <div className="flex-shrink-0">
                    <div className="text-4xl font-bold text-gray-900">
                      {resa.time}
                    </div>
                  </div>

                  {/* Informations client */}
                  <div className="flex-1 space-y-2">
                    <div className="font-bold text-xl text-gray-900">
                      {resa.firstname} {resa.lastname?.toUpperCase()}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      {resa.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span className="font-mono">{formatPhoneNumber(resa.phone)}</span>
                        </div>
                      )}
                      
                      {resa.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{resa.email}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                          {resa.guests} pers.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <button 
                      onClick={() => handleDelete(resa.id)} 
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

};
