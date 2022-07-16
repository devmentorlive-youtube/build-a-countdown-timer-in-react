import { useState, useEffect } from "react";
import Image from "next/image";
import { addMinutes } from "date-fns";
import useInterval from "@rooks/use-interval";

export default function Homepage() {
  const [duration, setDuration] = useState(0);
  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full flex items-center justify-evenly">
          {duration ? (
            <Timer {...{ duration, started: duration > 0 }} />
          ) : (
            [10, 15, 30, 60].map((minutes) => (
              <div key={minutes}>
                <button
                  onClick={() => setDuration(minutes)}
                  className="py-4 px-8 text-[80px] border rounded-full bg-blue-500 border-blue-400 text-white shadow">
                  {minutes}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Timer({ duration = 0, started = false }) {
  const [endAt, setEndAt] = useState(undefined);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!started || endAt) return;
    start();
    setEndAt(addMinutes(new Date(), duration));
  }, [started]);

  const { start, stop } = useInterval(() => setTick((prev) => prev + 1), 100);

  const template = `00:00:00:00`;
  const padding = (n) => (n.toString().length > 1 ? n : `0${n}`);

  const timer = () => {
    if (!endAt) return template;
    const milli = endAt.getTime() - new Date().getTime();
    if (milli < 0) return template;
    const seconds = Math.floor((milli / 1000) % 60);
    const minutes = Math.floor(milli / 1000 / 60);
    const hours = Math.floor(milli / 1000 / 60 / 60);
    return `${padding(hours)}:${padding(minutes)}:${padding(seconds)}:${padding(
      milli % 60
    )}`;
  };

  const display = timer();

  return (
    <div className="text-[200px] font-bold font-mono">
      {display === template ? (
        <Image src="/tada.gif" height={300} width={300} />
      ) : (
        <div>{display}</div>
      )}
    </div>
  );
}
