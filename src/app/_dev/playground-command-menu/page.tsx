import CommandMenuWithCategories from "@/components/application/command-menus/command-menu-with-categories";

export default function CommandMenuPlayground() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
            <CommandMenuWithCategories />
        </div>
    );
}
