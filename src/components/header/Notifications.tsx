"use client";

import { useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Bell, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const categories = ["All", "Unread", "Agent", "ROI", "CRM", "System"] as const;
type Category = (typeof categories)[number];

const initialNotifications = [
  { id: 1, title: "Sales Agent: New Lead Created", description: "Mike Johnson from Johnson Construction has been added as a Hot Lead. Deal value: $8,400/year.", time: "10 min ago", category: "Agent", unread: true, border: "border-[#5B7CFF]" },
  { id: 2, title: "AI Review Approved", description: "You approved 4 actions from your voice note. CRM updated, meeting scheduled, and 2 tasks created.", time: "25 min ago", category: "Agent", unread: true, border: "border-[#0BCB93]" },
  { id: 3, title: "Meeting Reminder: Johnson Construction", description: "Your meeting with Mike Johnson starts in 1 hour at 2:00 PM ET.", time: "10 min ago", category: "CRM", unread: true, border: "border-[#5B7CFF]" },
  { id: 4, title: "5 Tasks Overdue", description: "You have 5 tasks past their due date. Check your task list to review and reschedule.", time: "2 hours ago", category: "System", unread: true, border: "border-[#F5A000]" },
  { id: 5, title: "Monthly ROI Report Ready", description: "Your team saved 142 hours this month. Your latest ROI report is ready to review.", time: "3 hours ago", category: "ROI", unread: false, border: "border-[#CD4ACF]" },
  { id: 6, title: "CRM Sync Complete", description: "All contacts and deals have been successfully synced with your CRM.", time: "4 hours ago", category: "CRM", unread: false, border: "border-[#0BCB93]" },
];

export default function Notifications({ buttonClassName, onOpen }: { buttonClassName: string; onOpen: () => void }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [category, setCategory] = useState<Category>("All");
  const listRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((item) => item.unread).length;
  const visibleNotifications = notifications.filter((item) => category === "All" || (category === "Unread" ? item.unread : item.category === category));

  function changeCategory(next: Category) {
    setCategory(next);
    listRef.current?.scrollTo({ top: 0 });
  }

  return (
    <Dialog onOpenChange={(open) => { if (open) onOpen(); }}>
      <DialogTrigger asChild>
        <button type="button" className={cn(buttonClassName, "relative w-10")} aria-label={`Notifications, ${unreadCount} unread`}>
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && <span aria-hidden="true" className="absolute right-2 top-1.5 h-1.5 w-1.5 rounded-full bg-[#FF626B] ring-2 ring-[#F7F8FF]" />}
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="z-[60] bg-[#202840]/15 backdrop-blur-[5px]" />
        <DialogPrimitive.Content className="fixed right-3 top-[86px] z-[70] flex max-h-[calc(100dvh-100px)] w-[calc(100vw-24px)] max-w-[450px] flex-col rounded-[14px] bg-white p-5 text-[#171C35] shadow-[0_16px_60px_rgba(40,49,84,0.14)] outline-none sm:right-5" aria-describedby="notifications-description">
          <div className="flex items-start justify-between gap-3 border-b border-[#EEF0FA] pb-3 pr-6">
            <div>
              <DialogTitle className="text-base font-medium leading-6">Notifications</DialogTitle>
              <DialogDescription id="notifications-description" className="mt-0.5 text-xs text-[#929AC0]" aria-live="polite">{unreadCount} unread notifications</DialogDescription>
            </div>
            <Button type="button" variant="ghost" disabled={unreadCount === 0} onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))} className="h-6 shrink-0 px-0 text-[11px] font-medium text-[#5B7CFF] hover:bg-transparent hover:text-[#3F60EB]">Mark All Read</Button>
          </div>
          <DialogClose aria-label="Close notifications" className="absolute right-4 top-5 flex h-6 w-6 cursor-pointer items-center justify-center rounded text-[#939DC1] hover:bg-[#F5F6FF] focus-visible:outline-2 focus-visible:outline-[#5B7CFF]"><ChevronDown className="h-4 w-4" /></DialogClose>
          <div role="group" aria-label="Filter notifications" className="mr-5 mt-3 grid grid-cols-[0.7fr_1.3fr_1fr_0.7fr_0.8fr_1fr] gap-0.5 bg-[#F5F6FF] p-1">
            {categories.map((tab) => <button type="button" key={tab} aria-pressed={category === tab} onClick={() => changeCategory(tab)} className={cn("min-w-0 cursor-pointer rounded px-1 py-1.5 text-[10px] transition-colors focus-visible:outline-2 focus-visible:outline-[#5B7CFF]", category === tab ? "bg-[#5B7CFF] text-white" : "text-[#939DC1] hover:bg-[#E9EDFF]")}>{tab === "Unread" ? `Unread (${unreadCount})` : tab}</button>)}
          </div>
          <div ref={listRef} tabIndex={0} aria-label={`${category} notifications`} className="mt-3 min-h-0 max-h-[270px] overflow-y-auto overscroll-contain pr-5 [scrollbar-width:thin] [scrollbar-color:#5B7CFF_#F2F4FC] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#F2F4FC] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#5B7CFF]">
            <ul className="space-y-3">
              {visibleNotifications.map((notification) => <li key={notification.id} className={cn("relative bg-[#F5F6FF] py-2 pl-3 pr-7", !notification.unread && "bg-[#F9FAFE]")}>
                <span aria-hidden="true" className={cn("absolute left-0 top-2 h-5 border-l-[3px]", notification.border)} />
                <button type="button" aria-label={`${notification.title}${notification.unread ? ", mark as read" : ", read"}`} onClick={() => setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, unread: false } : item))} className="block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[#5B7CFF]">
                  <div className="flex items-start justify-between gap-1.5"><span className={cn("text-xs leading-4", notification.unread ? "font-medium text-[#252B43]" : "text-[#69728E]")}>{notification.title}</span><span className="shrink-0 pt-0.5 text-[9px] text-[#939DC1]">{notification.time}</span></div>
                  <p className="mt-1 text-[10px] leading-[14px] text-[#929AC0]">{notification.description}</p>
                </button>
                <Button type="button" variant="ghost" size="icon" aria-label={`Delete notification: ${notification.title}`} onClick={() => setNotifications((items) => items.filter((item) => item.id !== notification.id))} className="absolute right-0.5 top-1 h-6 w-6 text-[#FF626B] hover:bg-red-50 hover:text-red-500"><Trash2 className="size-3.5" strokeWidth={1.5} /></Button>
              </li>)}
            </ul>
            {visibleNotifications.length === 0 && <p className="py-10 text-center text-xs text-[#929AC0]">{category === "Unread" ? "You're all caught up!" : "No notifications in this category."}</p>}
          </div>
          <button type="button" aria-label="Scroll notifications to top" onClick={() => listRef.current?.scrollTo({ top: 0, behavior: "smooth" })} className="ml-auto mt-1 flex h-4 w-4 cursor-pointer items-center justify-center text-[#939DC1] hover:text-[#5B7CFF]"><ChevronUp className="h-4 w-4" /></button>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
