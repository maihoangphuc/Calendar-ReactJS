import { useState, useEffect, createContext } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: string;
}

interface GlobalContextType {
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

const EventContext = createContext<GlobalContextType | undefined>(undefined);

function EventProvider({ children }: any) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const listEvents = localStorage.getItem("events");
    if (listEvents) {
      setEvents(JSON.parse(listEvents));
    }
  }, []);

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export { EventContext, EventProvider };
