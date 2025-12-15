import { Chip } from "@heroui/react";
import {
    House,
    MessageCircle,
    LayoutGrid,
    CheckSquare,
    Users,
    Clock,
    BarChart3,
    Gift,
    Receipt,
    PlusCircle,
} from "lucide-react";

import { type SidebarItem } from "../shared/Sidebar";

/**
 * Please check the https://heroui.com/docs/guide/routing to have a seamless router integration
 */
const items: SidebarItem[] = [
    {
        key: "home",
        href: "#",
        icon: House,
        title: "Home",
    },
    {
        key: "chat",
        href: "#",
        icon: MessageCircle,
        title: "Chat",
    },
    {
        key: "projects",
        href: "#",
        icon: LayoutGrid,
        title: "Projects",
        endContent: (
            <PlusCircle className="text-default-500" width={24} />
        ),
    },
    {
        key: "tasks",
        href: "#",
        icon: CheckSquare,
        title: "Tasks",
        endContent: (
            <PlusCircle className="text-default-500" width={24} />
        ),
    },
    {
        key: "team",
        href: "#",
        icon: Users,
        title: "Team",
    },
    {
        key: "tracker",
        href: "#",
        icon: Clock,
        title: "Tracker",
        endContent: (
            <Chip
                classNames={{
                    base: "bg-foreground",
                    content: "text-default-50",
                }}
                size="sm"
                variant="flat"
            >
                New
            </Chip>
        ),
    },
    {
        key: "analytics",
        href: "#",
        icon: BarChart3,
        title: "Analytics",
    },
    {
        key: "perks",
        href: "#",
        icon: Gift,
        title: "Perks",
        endContent: (
            <Chip
                classNames={{
                    base: "bg-foreground",
                    content: "text-default-50",
                }}
                size="sm"
                variant="flat"
            >
                3
            </Chip>
        ),
    },
    {
        key: "expenses",
        href: "#",
        icon: Receipt,
        title: "Expenses",
    },
];

export default items;
