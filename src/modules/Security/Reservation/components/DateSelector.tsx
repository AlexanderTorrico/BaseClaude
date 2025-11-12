import React from 'react';
import { Button, ButtonGroup, Input, Label } from 'reactstrap';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  onPreviousDay,
  onNextDay,
  onToday
}) => {
  // Formatear fecha para mostrar
  const formatDisplayDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (selected.getTime() === today.getTime()) {
      return 'Hoy';
    } else if (selected.getTime() === tomorrow.getTime()) {
      return 'Mañana';
    } else if (selected.getTime() === yesterday.getTime()) {
      return 'Ayer';
    }

    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate === today;
  };

  return (
    <div className="d-flex align-items-center gap-3 flex-wrap">
      <div className="d-flex align-items-center gap-2">
        <Calendar size={20} className="text-muted" />
        <h5 className="mb-0 text-capitalize">{formatDisplayDate(selectedDate)}</h5>
      </div>

      <ButtonGroup>
        <Button
          color="primary"
          outline
          size="sm"
          onClick={onPreviousDay}
          title="Día anterior"
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          color="primary"
          outline
          size="sm"
          onClick={onToday}
          disabled={isToday()}
          title="Ir a hoy"
        >
          Hoy
        </Button>
        <Button
          color="primary"
          outline
          size="sm"
          onClick={onNextDay}
          title="Día siguiente"
        >
          <ChevronRight size={16} />
        </Button>
      </ButtonGroup>

      <div className="d-flex align-items-center gap-2">
        <Label for="date-picker" className="mb-0 small text-muted">
          Ir a fecha:
        </Label>
        <Input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          bsSize="sm"
          style={{ width: '150px' }}
        />
      </div>
    </div>
  );
};

export default DateSelector;
