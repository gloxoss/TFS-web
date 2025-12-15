import { Paperclip } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Attachment {
  name: string;
  size: string;
}

interface DescriptionListProps {
  title?: string;
  subtitle?: string;
  details?: { label: string; value: string | string[] }[];
  attachments?: Attachment[];
  className?: string;
}

const defaultDetails = [
  { label: 'Full name', value: 'Margot Foster' },
  { label: 'Application for', value: 'Backend Developer' },
  { label: 'Email address', value: 'margotfoster@example.com' },
  { label: 'Salary expectation', value: '$120,000' },
  { label: 'About', value: 'Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.' },
];

const defaultAttachments: Attachment[] = [
  { name: 'resume_back_end_developer.pdf', size: '2.4mb' },
  { name: 'coverletter_back_end_developer.pdf', size: '4.5mb' }
];

export default function DescriptionList({
  title = "Applicant Information",
  subtitle = "Personal details and application.",
  details = defaultDetails,
  attachments = defaultAttachments,
  className
}: DescriptionListProps) {
  return (
    <div className={cn(className)}>
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-white">{title}</h3>
        <p className="mt-1 max-w-2xl text-sm/6 text-gray-400">{subtitle}</p>
      </div>
      <div className="mt-6 border-t border-white/10">
        <dl className="divide-y divide-white/10">
          {details.map((item, idx) => (
            <div key={idx} className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-white">{item.label}</dt>
              <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">{item.value}</dd>
            </div>
          ))}

          {attachments.length > 0 && (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-white">Attachments</dt>
              <dd className="mt-2 text-sm text-white sm:col-span-2 sm:mt-0">
                <ul role="list" className="divide-y divide-white/10 rounded-md border border-white/20">
                  {attachments.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between py-4 pr-5 pl-4 text-sm/6">
                      <div className="flex w-0 flex-1 items-center">
                        <Paperclip aria-hidden="true" className="size-5 shrink-0 text-gray-400" />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">{file.name}</span>
                          <span className="shrink-0 text-gray-400">{file.size}</span>
                        </div>
                      </div>
                      <div className="ml-4 shrink-0">
                        <a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">
                          Download
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
