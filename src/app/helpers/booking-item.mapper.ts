import {ResponseBookedItem} from '../models/response-booked-item';
import {BookingItem} from '../models/booking-item.model';

const pad = (n: number) => String(n).padStart(2, '0');

function formatDateYYYYMMDD(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function formatTimeHHmmss(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function toDto(model: BookingItem): ResponseBookedItem {
  return {
    id: model.id,
    date: formatDateYYYYMMDD(model.date),
    starttime: formatTimeHHmmss(model.startTime),
    endtime: formatTimeHHmmss(model.endTime),
    bookingelement: model.bookingelement,
    explainingtext: model.explainingText,
  };
}

export function fromDto(dto: ResponseBookedItem): BookingItem {
  const [y, m, d] = dto.date.split('-').map(Number);

  const parseTime = (t: string): { h: number; min: number; s: number } => {
    const parts = t.split(':').map(Number);
    return { h: parts[0] ?? 0, min: parts[1] ?? 0, s: parts[2] ?? 0 };
    // toleriert 'HH:mm' oder 'HH:mm:ss'
  };

  const st = parseTime(dto.starttime);
  const et = parseTime(dto.endtime);

  const date = new Date(y, (m ?? 1) - 1, d ?? 1);

  return {
    id: dto.id,
    date,
    startTime: new Date(y, (m ?? 1) - 1, d ?? 1, st.h, st.min, st.s),
    endTime: new Date(y, (m ?? 1) - 1, d ?? 1, et.h, et.min, et.s),
    bookingelement: dto.bookingelement,
    explainingText: dto.explainingtext,
  };
}
