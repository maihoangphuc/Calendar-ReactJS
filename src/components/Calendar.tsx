import uuid from "react-uuid";
import Modal from "./Modal";
import { useState, useRef, useContext } from "react";
import { EventContext } from "../context/EventContext";
import {
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";

export default function Calendar() {
  const { events, setEvents }: any = useContext(EventContext);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showInfoEventModal, setShowInfoEventModal] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: "",
    title: "",
    start: "",
    end: "",
    allDay: "",
  });

  const calendarRef: any = useRef(null);

  //event content
  const renderEventContent = (eventContent: EventContentArg) => {
    return (
      <>
        <div className="truncate bg-[#4756b8] outline-none rounded-sm pl-1 w-full h-[20px]">
          <span className="bg-[#FFE4C8] text-[#4756b8] capitalize flex rounded-l-none p-2 items-center w-[100%] h-[100%] rounded-sm">
            {eventContent.event.title}
          </span>
        </div>
      </>
    );
  };

  //event click
  const handleEventClick = (info: EventClickArg) => {
    setShowInfoEventModal(true);
    setSelectedEvent(info.event);
    setFormData({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      allDay: info.event.allDay,
    });
  };

  //date click
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setShowAddEventModal(true);
    setFormData({
      id: String(uuid()),
      title: "",
      start: selectInfo.start.toISOString(),
      end: selectInfo.end.toISOString(),
      allDay: selectInfo.allDay,
    });
  };

  //form data change
  const handleFormChange = (e: any) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      title: value,
    });
  };

  //add event
  const handleAddEvent = () => {
    const { id, title, start, end, allDay } = formData;
    if (title) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.unselect(); // clear date selection
      calendarApi.addEvent({
        id,
        title,
        start,
        end,
        allDay,
      });

      setShowAddEventModal(false);

      setEvents((prev: any) => {
        const newEvents = [...prev, formData];
        const jsonEvents = JSON.stringify(newEvents);
        localStorage.setItem("events", jsonEvents);
        return newEvents;
      });
    }
  };

  //delete event
  const handleDeleteEvent = () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this event: ${selectedEvent.title}?`
    );
    if (isConfirmed) {
      selectedEvent.remove(); // remove the clicked event

      const deleteEvent = events.filter(
        (event: any) => event.id !== selectedEvent.id
      );

      setSelectedEvent(null);
      setShowInfoEventModal(false);

      localStorage.setItem("events", JSON.stringify(deleteEvent));
      setEvents(deleteEvent); // remove the event from the state
    }
  };

  //update event
  const handleUpdateEvent = () => {
    const { id, title, start, end, allDay } = formData;

    const myData = events.map((data: any) => {
      if (data.id === id) {
        selectedEvent.setProp("id", id);
        selectedEvent.setProp("title", title);
        selectedEvent.setProp("start", start);
        selectedEvent.setProp("end", end);
        selectedEvent.setProp("allDay", allDay);

        setSelectedEvent(null);
        setShowInfoEventModal(false);
        return {
          ...data,
          id: selectedEvent.id,
          title: selectedEvent.title,
          start: selectedEvent.start.toISOString(),
          end: selectedEvent.end.toISOString(),
          allDay: selectedEvent.allDay,
        };
      }
      return data;
    });

    localStorage.setItem("events", JSON.stringify(myData));
    setEvents(myData);
  };

  //drop event
  const handleEventDrop = (event: any) => {
    const updatedEvents = events.map((item: any) => {
      if (item.id === event.event.id) {
        return {
          ...item,
          start: event.event.start.toISOString(),
          end: event.event.end.toISOString(),
        };
      }
      return item;
    });

    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  //resize event
  const handleEventResize = (info: any) => {
    const updatedEvent = {
      ...info.event.toPlainObject(),
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
    };

    const updatedEvents = events.map((event: any) => {
      if (event.id === updatedEvent.id) {
        return updatedEvent;
      } else {
        return event;
      }
    });

    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  return (
    <div className="py-5 px-6 w-full bg-[#fff] rounded-md">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        themeSystem="standard"
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        dayMaxEvents={true}
        weekends={true}
        locale={"en"}
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        select={handleDateSelect}
        droppable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        ref={calendarRef}
        headerToolbar={{
          start: "today prev next",
          center: "title",
          end: "dayGridMonth timeGridWeek timeGridDay",
        }}
      />
      {/* add event */}
      <Modal
        event="add"
        title="Add event"
        onClose={() => setShowAddEventModal(false)}
        showForm={showAddEventModal}
        handleAddEvent={handleAddEvent}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={handleFormChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="timeStart"
          >
            Time Start
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="timeStart"
            type="text"
            placeholder="Time Start"
            value={formData.start}
            onChange={handleFormChange}
            disabled={true}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="timeEnd"
          >
            Time End
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="timeEnd"
            type="text"
            placeholder="Time End"
            value={formData.end}
            onChange={handleFormChange}
            disabled={true}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="allDay"
          >
            All day:
          </label>
          <input
            id="allDay"
            type="checkbox"
            name="allDay"
            checked={formData.allDay}
            onChange={handleFormChange}
            disabled={true}
          />
        </div>
      </Modal>

      {/* info event */}
      <Modal
        event="info"
        title="Info event"
        onClose={() => setShowInfoEventModal(false)}
        showForm={showInfoEventModal}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={handleFormChange}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="timeStart"
          >
            Time Start
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="timeStart"
            type="text"
            placeholder="Time Start"
            value={formData.start}
            onChange={handleFormChange}
            disabled={true}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="timeEnd"
          >
            Time End
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="timeEnd"
            type="text"
            placeholder="Time End"
            value={formData.end}
            onChange={handleFormChange}
            disabled={true}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-bold mb-2"
            htmlFor="allDay"
          >
            All day:
          </label>
          <input
            id="allDay"
            type="checkbox"
            name="allDay"
            checked={formData.allDay}
            onChange={handleFormChange}
            disabled={true}
          />
        </div>
      </Modal>
    </div>
  );
}
