import {BookingItem} from './booking-item.model';

export interface PreparedItem {
  id: string,
  name: string,
  bookingelement: string,
  explainingText: string,
  isEditing: boolean,
}
