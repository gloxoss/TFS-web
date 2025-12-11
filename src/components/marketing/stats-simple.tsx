import { cn } from "@/lib/utils";

interface StatItem {
    id: number | string;
    name: string;
    value: string;
}

interface StatsProps {
    title?: string;
    description?: string;
    stats?: StatItem[];
    className?: string;
}

const defaultStats: StatItem[] = [
    { id: 1, name: 'Creators on the platform', value: '8,000+' },
    { id: 2, name: 'Flat platform fee', value: '3%' },
    { id: 3, name: 'Uptime guarantee', value: '99.9%' },
    { id: 4, name: 'Paid out to creators', value: '$70M' },
];

export default function StatsSimple({
    title = "Trusted by creators worldwide",
    description = "Lorem ipsum dolor sit amet consect adipisicing possimus.",
    stats = defaultStats,
    className,
}: StatsProps) {
    return (
        <div className={cn("bg-gray-900 py-24 sm:py-32", className)}>
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="text-center">
                        <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
                            {title}
                        </h2>
                        <p className="mt-4 text-lg/8 text-gray-300">{description}</p>
                    </div>
                    <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.id} className="flex flex-col bg-white/5 p-8">
                                <dt className="text-sm/6 font-semibold text-gray-300">{stat.name}</dt>
                                <dd className="order-first text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    )
}
