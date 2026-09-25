"use client";

import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const meetings = [
  {
    title: "Johnson Construction - Deal Review",
    time: "2:00pm",
    duration: "30min",
    border: "border-[#0BCB93]",
  },
  {
    title: "Green Tech - Budget Meeting",
    time: "4:00pm",
    duration: "45min",
    border: "border-[#5B7CFF]",
  },
  {
    title: "Smith & Co. - Project Kickoff",
    time: "3:00pm",
    duration: "1hr",
    border: "border-[#D94BDB]",
  },
  {
    title: "Creative Designs - Client Presentation",
    time: "5:00pm",
    duration: "1hr 30min",
    border: "border-[#0BCB93]",
  },
];

export default function UpcomingMeeting() {
  return (
    <Card className="min-w-0 gap-0 rounded-xl border-0 bg-white p-5 shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#EFF1FA] pb-3">
        <h2 className="text-base font-medium text-[#171C35]">
          Upcoming Meetings
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto gap-1 p-0 text-[10px] font-normal text-[#597AFF] hover:bg-transparent"
            >
              View Calendar
              <ChevronRight className="size-3" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Meeting calendar</DialogTitle>
              <DialogDescription>
                Today’s sample meeting schedule.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {[...meetings]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((meeting) => (
                  <div
                    key={meeting.title}
                    className={`border-l-[3px] pl-3 ${meeting.border}`}
                  >
                    <p className="text-sm font-medium">{meeting.title}</p>
                    <p className="mt-1 text-xs text-[#929AC0]">
                      {meeting.time} · {meeting.duration}
                    </p>
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="mt-4 space-y-3">
        {meetings.map((meeting) => (
          <li
            key={meeting.title}
            className={`rounded-xs border-l-[4px] py-0.5 pl-2 ${meeting.border}`}
          >
            <p className="text-[11px] font-medium leading-4 text-[#171C35]">
              {meeting.title}
            </p>
            <p className="mt-1 text-[11px] text-[#929AC0]">
              {meeting.time}
              <span className="px-3">·</span>
              {meeting.duration}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
