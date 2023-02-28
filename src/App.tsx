import TimePicker from "./components/TimePicker";
import Calendar from "./components/Calendar";

function App() {
  return (
    <div className="w-[100%] h-[100%] bg-[#e4fcfc]">
      <div className="w-[90%] m-auto py-[20px]">
        <div className="flex sm:flex-col lg:flex-row gap-x-5 gap-y-5">
          <div className="sm:w-[100%] lg:w-[30%]">
            <TimePicker />
          </div>
          <div className="sm:w-[100%] lg:w-[70%]">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
