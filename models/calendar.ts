import { model, Schema } from "mongoose";
import { Event } from "../google";

interface ICalendar {
  calendarId: String;
  creator: String;
  events: Array<Event>;
}

const CalendarSchema = new Schema({
  calendarId: { required: true, type: String },
  creator: { required: true, type: String },
  events: { required: false, default: [], type: Array<Event> },
});

const Calendar = model<ICalendar>("calendar", CalendarSchema);

export default Calendar;
