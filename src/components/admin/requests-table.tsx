'use client';

import { Quote } from '@/services';
import Link from 'next/link';
import { Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    Button
} from "@heroui/react";

interface RequestsTableProps {
    requests: Quote[];
    lng: string;
}

const statusColorMap: Record<string, "warning" | "primary" | "success" | "danger" | "default"> = {
    pending: "warning",
    reviewing: "primary",
    confirmed: "success",
    rejected: "danger",
};

const columns = [
    { name: "REFERENCE", uid: "id" },
    { name: "CLIENT", uid: "client" },
    { name: "DATES", uid: "dates" },
    { name: "ITEMS", uid: "items" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];

export default function RequestsTable({ requests, lng }: RequestsTableProps) {

    // Render cell content based on column
    const renderCell = (request: Quote, columnKey: React.Key) => {
        const cellValue = request[columnKey as keyof Quote];
        const statusColor = statusColorMap[request.status] || "default";

        switch (columnKey) {
            case "id":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize text-white">
                            {(request as any).confirmationNumber || request.id.slice(0, 8).toUpperCase()}
                        </p>
                    </div>
                );
            case "client":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: "" /* Add avatar url if available */ }}
                        description={request.clientEmail}
                        name={request.clientName}
                    >
                        {request.clientEmail}
                    </User>
                );
            case "dates":
                const days = Math.ceil((new Date(request.rentalEndDate).getTime() - new Date(request.rentalStartDate).getTime()) / (1000 * 60 * 60 * 24));
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm text-white">
                            {format(new Date(request.rentalStartDate), 'MMM d')} - {format(new Date(request.rentalEndDate), 'MMM d')}
                        </p>
                        <p className="text-tiny text-default-400 capitalize">{days} Days</p>
                    </div>
                );
            case "items":
                // Safely parse if string, though Service Layer guarantees string. 
                // Double safety or assume string from Service logic.
                let count = 0;
                try {
                    const parsed = JSON.parse(request.itemsJson);
                    count = Array.isArray(parsed) ? parsed.length : 0;
                } catch (e) { count = 0; }

                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm text-white">{count} item{count !== 1 ? 's' : ''}</p>
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColor} size="sm" variant="flat">
                        {request.status}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Review Request">
                            <Button
                                isIconOnly
                                as={Link}
                                href={`/${lng}/admin/requests/${request.id}`}
                                size="sm"
                                variant="light"
                                className="text-default-400 cursor-pointer active:opacity-50"
                            >
                                <Eye className="w-5 h-5" />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue as React.ReactNode;
        }
    };

    if (requests.length === 0) {
        return (
            <div className="text-center py-20 bg-default-50 rounded-lg border border-default-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-default-100 mb-4">
                    <AlertCircle className="w-8 h-8 text-default-500" />
                </div>
                <h3 className="text-lg font-medium text-white">No requests found</h3>
                <p className="mt-1 text-sm text-default-400">Your inbox is completely clear.</p>
            </div>
        );
    }

    return (
        <Table aria-label="Rental requests table">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={requests}>
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
