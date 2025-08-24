import {BookingItem} from './booking-item.model';

export interface PreparedItem {
  id: string,
  bookingelement: string,
  explainingText: string,
  isEditing: boolean,
}
