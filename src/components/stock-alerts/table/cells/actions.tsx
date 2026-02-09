'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StockAlert } from '@/types';
import { CellContext } from '@tanstack/react-table';
import { MoreVertical, Trash } from 'lucide-react';

type ActionsCellProps = CellContext<StockAlert, unknown>;

export function ActionsCell({ row }: ActionsCellProps) {
  const stockAlert = row.original;

  const handleDeleteStockAlert = async () => {};

  return (
    <div key={stockAlert.id} className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            className="text-whatsapp cursor-pointer"
            onClick={handleDeleteStockAlert}
          >
            <Trash />
            Don&apos;t Alert Me
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
  ``;
}
