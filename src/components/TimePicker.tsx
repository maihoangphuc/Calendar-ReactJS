import Event from "./Event";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { EventContext } from "../context/EventContext";
import { useState, useContext } from "react";
import { classNames } from "../utils/class";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
} from "date-fns";

export default function TimePicker() {
  const { events }: any = useContext(EventContext);
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let colStartClasses = [
    "",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
  ];

  let days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  let selectedDayEvents = events.filter((event: any) =>
    isSameDay(parseISO(event.start), selectedDay)
  );

  return (
    <div className="py-6 px-6 bg-[#fff] rounded-md">
      <div className="max-w-md mx-auto">
        <div className="md:grid md:divide-y md:divide-gray-200">
          <section>
            <div className="flex justify-center w-[100%] items-center">
              <button
                type="button"
                onClick={previousMonth}
                className="flex flex-none pr-4 items-center justify-center text-[#5684ae] hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>

              <h2 className="font-[600] text-[#0F4C81] text-[18px]">
                {format(firstDayCurrentMonth, "MMMM yyyy")}
              </h2>

              <button
                onClick={nextMonth}
                type="button"
                className="flex flex-none pl-4 items-center justify-center text-[#5684ae] hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-5 text-xs leading-6 text-center text-[#9CA3AF]">
              <div>SUN</div>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "py-1.5"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={classNames(
                      isEqual(day, selectedDay) && "text-white",
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "text-[#5684AE]",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-[#737373]",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-400",
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "bg-[#5684AE]",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-[#202d45]",
                      !isEqual(day, selectedDay) && "hover:bg-gray-200",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d")}
                    </time>
                  </button>

                  <div className="w-1 h-1 mx-auto mt-1">
                    {events.some((event: any) =>
                      isSameDay(parseISO(event.start), day)
                    ) && (
                      <div className="w-1 h-1 rounded-full bg-[#5684AE]"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-2">
            <div className="flex justify-between items-center mt-4">
              <h2 className="font-[600] text-[20px] text-[#0F4C81]">
                Upcoming Events
              </h2>
              <button className="px-3 py-1 rounded-full text-[#fff] text-[14px] bg-[#5684ae]">
                View All
              </button>
            </div>
            <h6 className="text-[gray] mt-2">
              <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                {format(selectedDay, "MMM dd, yyy")}
              </time>
            </h6>

            <ol className="mt-4 pr-4 overflow-y-scroll overflow-x-hidden h-[200px] min-h-[30px] text-sm leading-6 text-gray-500">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event: any) => (
                  <Event event={event} key={event.id} />
                ))
              ) : (
                <p>No events for today.</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
