import { format, parseISO } from "date-fns";

export default function Event({ event }: any) {
  let startDateTime = parseISO(event.start);
  let endDateTime = parseISO(event.end);

  return (
    <div className="bg-[#4756b8] rounded-lg pl-2 h-[100px] mb-2">
      <li className="flex gap-x-3 rounded-l-none p-2 items-center h-[100%] rounded-lg bg-[#FFE4C8]">
        <div className="flex-auto">
          <p className="text-[#0F4C81] capitalize font-medium">{event.title}</p>
          <p className="mt-0.5">
            <time dateTime={event.startDatetime}>
              {format(startDateTime, "h:mm a")}
            </time>{" "}
            -{" "}
            <time dateTime={event.endDatetime}>
              {format(endDateTime, "h:mm a")}
            </time>
          </p>
        </div>
      </li>
    </div>
  );
}
