"use client";

import { useState } from "react";
import SidebarShell from "@/components/layout/sidebar-shell";
import HeroSplitWithImage from "@/components/marketing/hero-split-with-image";
import FeatureGrid from "@/components/marketing/feature-grid";
import PricingTable from "@/components/marketing/pricing-table";
import SettingsForm from "@/components/forms/settings-form";
import Footer from "@/components/marketing/footer";
import Testimonials from "@/components/marketing/testimonials";
import CtaCentered from "@/components/marketing/cta-centered";
import StatsSimple from "@/components/marketing/stats-simple";
import FaqCentered from "@/components/marketing/faq-centered";
import StackedList from "@/components/application-ui/lists/stacked-list";
import Table from "@/components/application-ui/lists/table";
import DescriptionList from "@/components/application-ui/data-display/description-list";
import Modal from "@/components/application-ui/overlays/modal";
import Badge from "@/components/application-ui/elements/badge";
import Button from "@/components/application-ui/elements/button";
import Avatar from "@/components/application-ui/elements/avatar";
import Tabs from "@/components/application-ui/navigation/tabs";
import Alert from "@/components/application-ui/feedback/alert";
import Input from "@/components/application-ui/forms/input";
import Textarea from "@/components/application-ui/forms/textarea";
import Select from "@/components/application-ui/forms/select";
import Toggle from "@/components/application-ui/forms/toggle";
import Checkbox from "@/components/application-ui/forms/checkbox";
import Dropdown from "@/components/application-ui/elements/dropdown";
import Pagination from "@/components/application-ui/navigation/pagination";
import Breadcrumbs from "@/components/application-ui/navigation/breadcrumbs";
import EmptyState from "@/components/application-ui/feedback/empty-state";
import SlideOver from "@/components/application-ui/overlays/slide-over";
import Divider from "@/components/application-ui/layout/divider";
import Steps, { Step } from "@/components/application-ui/navigation/steps";
import RadioGroup from "@/components/application-ui/forms/radio-group";
import ActionPanel from "@/components/application-ui/forms/action-panel";
import ButtonGroup from "@/components/application-ui/elements/button-group";
import PageHeading from "@/components/application-ui/headings/page-heading";
import Notification, { NotificationType } from "@/components/application-ui/feedback/notification";
import CommandPalette from "@/components/application-ui/navigation/command-palette";
import SignInCard from "@/components/application-ui/forms/auth/sign-in-card";
import GridList from "@/components/application-ui/lists/grid-list";
import Feed from "@/components/application-ui/lists/feed";

import RichSelect from "@/components/application-ui/forms/rich-select";
import DropdownMenu from "@/components/application-ui/elements/dropdown-menu";
import FilterDropdown from "@/components/application-ui/elements/filter-dropdown";

import { Zap, Shield, Globe, BarChart, Settings, User, LogOut, Plus, MapPin, Calendar, Terminal, Check, ThumbsUp, Edit, Trash, Archive, Copy, Move } from "lucide-react";
import Link from "next/link";


export default function PlaygroundPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [isCmdOpen, setIsCmdOpen] = useState(false);
    const [notification, setNotification] = useState<{ show: boolean, title: string, type: NotificationType }>({
        show: false,
        title: "",
        type: 'success'
    });

    // Forms state
    const [toggleEnabled, setToggleEnabled] = useState(false);
    const people = [
        { id: 1, name: 'Wade Cooper' },
        { id: 2, name: 'Arlene Mccoy' },
        { id: 3, name: 'Devon Webb' },
        { id: 4, name: 'Tom Cook' },
    ]
    const [selectedPerson, setSelectedPerson] = useState(people[0]);

    // Rich Select State
    const richOptions = [
        { id: 1, name: 'Wade Cooper', avatar: 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', secondaryText: '@wade' },
        { id: 2, name: 'Arlene Mccoy', avatar: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', secondaryText: '@arlene' },
        { id: 3, name: 'Tom Cook', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', secondaryText: '@tom' },
    ];
    const [selectedRich, setSelectedRich] = useState(richOptions[0]);

    // Filter State
    const [filters, setFilters] = useState([
        { value: 'new', label: 'New', checked: true },
        { value: 'active', label: 'Active', checked: false },
        { value: 'suspended', label: 'Suspended', checked: false },
    ]);

    const handleFilterChange = (value: string, checked: boolean) => {
        setFilters(filters.map(f => f.value === value ? { ...f, checked } : f));
    }


    const notificationMethods = [
        { id: 'email', title: 'Email', description: 'Get notified by email' },
        { id: 'sms', title: 'Phone (SMS)', description: 'Get notified by text message' },
        { id: 'push', title: 'Push notification', description: 'Get notified by push notification' },
    ];
    const [selectedNotif, setSelectedNotif] = useState(notificationMethods[0]);

    const [steps, setSteps] = useState<Step[]>([
        { id: '01', name: 'Job details', href: '#', status: 'complete' },
        { id: '02', name: 'Application form', href: '#', status: 'current' },
        { id: '03', name: 'Preview', href: '#', status: 'upcoming' },
    ]);

    const subOptions = [
        { id: 'years', label: 'Years' },
        { id: 'months', label: 'Months' },
        { id: 'days', label: 'Days' },
    ];
    const [subDuration, setSubDuration] = useState('months');


    // Command Palette Items
    const commandItems = [
        { id: 1, name: 'Add new file', shortcut: 'N', icon: Plus, onClick: () => showNotification('File added', 'success') },
        { id: 2, name: 'View settings', shortcut: 'S', icon: Settings, onClick: () => console.log('Settings') },
        { id: 3, name: 'Go to Playground', icon: Terminal, url: '/en/playground' },
    ];

    const showNotification = (title: string, type: NotificationType) => {
        setNotification({ show: true, title, type });
    };

    // Grid List Data
    const projects = [
        { id: 1, title: 'Graph API', initials: 'GA', href: '#', members: 16, color: 'bg-pink-600' },
        { id: 2, title: 'Component Design', initials: 'CD', href: '#', members: 12, color: 'bg-purple-600' },
        { id: 3, title: 'Templates', initials: 'T', href: '#', members: 16, color: 'bg-yellow-500' },
        { id: 4, title: 'React Components', initials: 'RC', href: '#', members: 8, color: 'bg-green-500' },
    ];

    // Feed Data
    const feedItems = [
        {
            id: 1,
            content: <>Applied to <Link href="#" className="font-medium text-gray-900 dark:text-white">Front End Developer</Link></>,
            date: 'Sep 20',
            icon: User,
            iconColor: 'bg-gray-400',
        },
        {
            id: 2,
            content: <>Advanced to phone screening by <Link href="#" className="font-medium text-gray-900 dark:text-white">Bethany Blake</Link></>,
            date: 'Sep 22',
            icon: ThumbsUp,
            iconColor: 'bg-blue-500',
        },
        {
            id: 3,
            content: <>Completed phone screening with <Link href="#" className="font-medium text-gray-900 dark:text-white">Martha Gardner</Link></>,
            date: 'Sep 28',
            icon: Check,
            iconColor: 'bg-green-500',
        },
        {
            id: 4,
            content: <>Advanced to interview by <Link href="#" className="font-medium text-gray-900 dark:text-white">Bethany Blake</Link></>,
            date: 'Sep 30',
            icon: ThumbsUp,
            iconColor: 'bg-blue-500',
        },
    ];

    return (
        <SidebarShell>
            {/* Notification Toast */}
            <Notification
                show={notification.show}
                setShow={(s) => setNotification({ ...notification, show: s })}
                title={notification.title}
                type={notification.type}
                message="This is a dynamic notification message."
            />

            {/* Command Palette */}
            <CommandPalette open={isCmdOpen} setOpen={setIsCmdOpen} navigation={commandItems} />

            <div className="space-y-16 pb-20">

                {/* Page Heading Demo */}
                <div className="px-4">
                    <PageHeading
                        title="Playground"
                        meta={[
                            { text: 'Full-time', icon: User },
                            { text: 'Remote', icon: MapPin },
                            { text: 'January 2024', icon: Calendar }
                        ]}
                        actions={[
                            { label: 'Edit', onClick: () => console.log('Edit') },
                            { label: 'Publish', primary: true, icon: Check, onClick: () => showNotification('Published successfully', 'success') }
                        ]}
                    />
                    <Divider className="my-8" />
                </div>

                {/* Section 1: Hero */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Hero Split With Image</div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <HeroSplitWithImage
                            title="Welcome to the Playground"
                            description="This page demonstrates all the components migrated from TailwindPlus. We now have global Commands, Notifications, and standardized Headings."
                            badge="Version 2.0"
                            badgeLink={{ label: "View Guide", href: "/logging" }}
                        />
                    </div>
                </div>

                {/* Complex Interactions */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Filters & Menus</div>
                    <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900 flex flex-col md:flex-row gap-8 items-start justify-center">
                        <div className="w-full max-w-xs">
                            <RichSelect
                                label="Assigned to"
                                options={richOptions}
                                value={selectedRich}
                                onChange={setSelectedRich}
                            />
                        </div>
                        <div className="flex gap-4 items-center mt-8">
                            <div className="text-sm text-gray-500">Filters:</div>
                            <FilterDropdown
                                label="Status"
                                options={filters}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="flex gap-4 items-center mt-8">
                            <div className="text-sm text-gray-500">Action Menu:</div>
                            <DropdownMenu
                                label="Options"
                                sections={[
                                    { id: 1, items: [{ label: 'Edit', icon: Edit }, { label: 'Duplicate', icon: Copy }] },
                                    { id: 2, items: [{ label: 'Archive', icon: Archive }, { label: 'Move', icon: Move }] },
                                    { id: 3, items: [{ label: 'Delete', icon: Trash, onClick: () => showNotification('Deleted!', 'error') }] },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* Authentication & Lists */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Sign In */}
                    <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                        <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Sign In Card</div>
                        <div className="flex justify-center bg-gray-50 dark:bg-black rounded-xl p-4">
                            <SignInCard
                                logoUrl="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                onSubmit={(e) => { e.preventDefault(); showNotification("Logged in!", "success") }}
                            />
                        </div>
                    </div>

                    {/* Feed */}
                    <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                        <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Feed</div>
                        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                            <Feed items={feedItems} />
                        </div>
                    </div>
                </div>

                {/* Grid Lists */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Grid List</div>
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-black">
                        <GridList items={projects} />
                    </div>
                </div>

                {/* Overlays & Triggers */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700 text-center">
                    <div className="mb-4 text-sm font-mono text-gray-500">Global UI Triggers</div>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
                        <Button variant="outline" onClick={() => setIsSlideOverOpen(true)}>Open Slide-over</Button>
                        <Button variant="secondary" onClick={() => setIsCmdOpen(true)}>
                            <Terminal className="mr-2 h-4 w-4" />
                            Open Command Palette
                        </Button>
                        <Button variant="ghost" onClick={() => showNotification("Hello World", "info")}>Show Notification</Button>
                    </div>

                    <Modal
                        open={isModalOpen}
                        setOpen={setIsModalOpen}
                        title="Migration Successful"
                        description="You have successfully clicked the modal trigger button."
                        primaryAction={{ label: "Awesome", onClick: () => setIsModalOpen(false) }}
                    />

                    <SlideOver open={isSlideOverOpen} setOpen={setIsSlideOverOpen} title="Slide-over Panel">
                        <div className="space-y-4">
                            <p className="text-gray-500 dark:text-gray-400">Content goes here...</p>
                            <Input label="Name" placeholder="Your name" />
                            <Textarea label="Notes" />
                            <Button className="w-full" onClick={() => setIsSlideOverOpen(false)}>Save</Button>
                        </div>
                    </SlideOver>
                </div>

                {/* Forms & Interaction */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Forms & Interaction</div>
                    <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">

                        {/* Steps Demo */}
                        <div className="mb-10">
                            <Label className="mb-4 block text-sm font-medium text-gray-700 dark:text-gray-300">Form Progress</Label>
                            <Steps steps={steps} onStepClick={(s) => console.log(s)} />
                        </div>

                        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
                            <div className="space-y-6">
                                <Input label="Email" placeholder="you@example.com" helpText="We'll never share your email." />
                                <Select label="Assign to" options={people} value={selectedPerson} onChange={setSelectedPerson} />
                                <Textarea label="Bio" placeholder="Tell us about yourself..." />
                            </div>

                            <div className="space-y-8">
                                <RadioGroup label="Notifications" options={notificationMethods} value={selectedNotif} onChange={setSelectedNotif} />

                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">View Duration</Label>
                                    <ButtonGroup items={subOptions} value={subDuration} onChange={setSubDuration} />
                                </div>
                            </div>

                            <div className="col-span-full flex items-center justify-between gap-8 border-t border-gray-200 pt-6 dark:border-gray-700">
                                <Toggle label="Email notifications" description="Get emails about your account activity." checked={toggleEnabled} onChange={setToggleEnabled} />
                                <div className="space-y-4">
                                    <Checkbox label="I agree to terms" id="terms" />
                                    <Checkbox label="Subscribe to newsletter" id="newsletter" defaultChecked />
                                </div>
                                <div className="w-full max-w-xs">
                                    <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Dropdown Menu</Label>
                                    <Dropdown items={[
                                        { label: 'Account settings', icon: Settings, href: '#' },
                                        { label: 'Support', icon: User, href: '#' },
                                        { label: 'Sign out', icon: LogOut, onClick: () => console.log('Sign out') },
                                    ]} label="User Menu" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Panel */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Action Panel</div>
                    <ActionPanel
                        title="Manage Subscription"
                        description="You are currently on the Pro plan. Upgrade to Enterprise to unlock more features."
                        action={{ label: "Upgrade Plan", onClick: () => console.log("Upgrade") }}
                    />
                </div>

                {/* New App UI Components */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Stacked List */}
                    <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                        <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Stacked List + Pagination</div>
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-900 p-4 dark:border-gray-800">
                            <StackedList />
                            <div className="mt-4 rounded-b-lg bg-gray-50 dark:bg-gray-800">
                                <Pagination currentPage={1} totalPages={10} />
                            </div>
                        </div>
                    </div>

                    {/* Description List */}
                    <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                        <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Description List</div>
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-900 p-4 dark:border-gray-800">
                            <DescriptionList />
                        </div>
                    </div>
                </div>

                {/* Section 2: Stats (Placed high for impact) */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Stats</div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <StatsSimple />
                    </div>
                </div>

                {/* Section 3: Features */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Feature Grid</div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <FeatureGrid
                            title="Powerful Features"
                            subtitle="Everything you need"
                            features={[
                                { name: 'Instant Deployment', description: 'Deploy in seconds, not minutes.', icon: Zap },
                                { name: 'Enterprise Security', description: 'Bank-grade encryption by default.', icon: Shield },
                                { name: 'Global Edge Network', description: 'Low latency anywhere in the world.', icon: Globe },
                                { name: 'Real-time Analytics', description: 'Track your growth live.', icon: BarChart },
                            ]}
                        />
                    </div>
                </div>

                {/* Section 5: Pricing */}
                <div className="rounded-2xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-4 text-center text-sm font-mono text-gray-500">Component: Pricing Table</div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                        <PricingTable />
                    </div>
                </div>

            </div>
        </SidebarShell>
    );
}

// Simple label helper for the demo page only
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={className}>{children}</label>
}
