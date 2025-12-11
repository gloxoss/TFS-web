import { cn } from "@/lib/utils";

interface TableColumn {
  key: string;
  label: string;
}

interface TableProps {
  title?: string;
  description?: string;
  columns?: TableColumn[];
  data?: any[];
  className?: string; // For overrides
}

const defaultColumns: TableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
];

const defaultData = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  { name: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
  { name: 'Tom Cook', title: 'Director of Product', email: 'tom.cook@example.com', role: 'Member' },
  { name: 'Whitney Francis', title: 'Copywriter', email: 'whitney.francis@example.com', role: 'Admin' },
  { name: 'Leonard Krasner', title: 'Senior Designer', email: 'leonard.krasner@example.com', role: 'Owner' },
  { name: 'Floyd Miles', title: 'Principal Designer', email: 'floyd.miles@example.com', role: 'Member' },
];

export default function Table({
  title = "Users",
  description = "A list of all the users in your account including their name, title, email and role.",
  columns = defaultColumns,
  data = defaultData,
  className,
}: TableProps) {
  return (
    <div className={cn("bg-gray-900", className)}>
      <div className="mx-auto max-w-7xl">
        <div className="bg-gray-900 py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold text-white">{title}</h1>
                <p className="mt-2 text-sm text-gray-300">
                  {description}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  type="button"
                  className="block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Add user
                </button>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        {columns.map((col, index) => (
                          <th
                            key={col.key}
                            scope="col"
                            className={cn(
                              "py-3.5 text-left text-sm font-semibold text-white",
                              index === 0 ? "pl-4 pr-3 sm:pl-0" : "px-3"
                            )}
                          >
                            {col.label}
                          </th>
                        ))}
                        <th scope="col" className="relative py-3.5 pr-4 pl-3 sm:pr-0">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {data.map((item, rowIdx) => (
                        <tr key={rowIdx}>
                          {columns.map((col, colIdx) => (
                            <td
                              key={col.key}
                              className={cn(
                                "whitespace-nowrap py-4 text-sm",
                                colIdx === 0 ? "pl-4 pr-3 font-medium text-white sm:pl-0" : "px-3 text-gray-300"
                              )}
                            >
                              {item[col.key]}
                            </td>
                          ))}
                          <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                            <a href="#" className="text-indigo-400 hover:text-indigo-300">
                              Edit<span className="sr-only">, {item[columns[0].key]}</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
