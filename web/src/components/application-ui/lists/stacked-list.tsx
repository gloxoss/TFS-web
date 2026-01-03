import Image from "next/image";
import { cn } from "@/lib/utils";

interface ListItem {
  id: string | number;
  name: string;
  email: string;
  role: string;
  imageUrl: string;
  lastSeen?: string;
  lastSeenDateTime?: string;
  isOnline?: boolean;
}

interface StackedListProps {
  items?: ListItem[];
  className?: string; // For customization (e.g. background color)
}

const defaultItems: ListItem[] = [
  {
    id: 1,
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 2,
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    id: 3,
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    isOnline: true,
  },
];

export default function StackedList({ items = defaultItems, className }: StackedListProps) {
  return (
    <ul role="list" className={cn("divide-y divide-gray-800", className)}>
      {items.map((person) => (
        <li key={person.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <Image alt="" src={person.imageUrl} width={48} height={48} className="size-12 flex-none rounded-full bg-gray-800" sizes="48px" />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-white">{person.name}</p>
              <p className="mt-1 truncate text-xs/5 text-gray-400">{person.email}</p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm/6 text-white">{person.role}</p>
            {person.lastSeen ? (
              <p className="mt-1 text-xs/5 text-gray-400">
                Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
              </p>
            ) : (
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className={cn("flex-none rounded-full p-1", person.isOnline ? "bg-emerald-500/20" : "bg-gray-500/20")}>
                  <div className={cn("size-1.5 rounded-full", person.isOnline ? "bg-emerald-500" : "bg-gray-500")} />
                </div>
                <p className="text-xs/5 text-gray-400">{person.isOnline ? 'Online' : 'Offline'}</p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
