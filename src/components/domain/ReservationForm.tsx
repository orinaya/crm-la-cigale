import React, { useState } from 'react';
import { repository } from '../../dal/repository';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const ReservationForm = ({ onClose, onSuccess }: Props) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    guests: 2
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await repository.createReservation(formData);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || "Erreur inconnue");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-lacigale-accent/5 to-lacigale-gold/5">
          <h2 className="text-2xl font-mono font-bold text-gray-900">Nouvelle Réservation</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/80 rounded-xl transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs font-mono font-semibold text-lacigale-accent uppercase tracking-wider">Client</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                required
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />
              <Input
                label="Nom"
                required
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
            </div>
            <Input
              label="Téléphone"
              placeholder="06 12 34..."
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-mono font-semibold text-lacigale-accent uppercase tracking-wider">Service</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <Input
                label="Heure"
                type="time"
                step="900"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <Input
              label="Couverts"
              type="number"
              min={1}
              required
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
            />
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-lacigale-bg to-white">
          <Button
            variant="primary"
            className="w-full h-12 text-base font-semibold"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Confirmer la réservation"}
          </Button>
        </div>
      </div>
    </div>
  );
};
