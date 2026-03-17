'use client';

import { Whatsapp } from '@/components/icons/whatsapp';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { site } from '@/constants/site';
import { Order } from '@/types';
import { CellContext } from '@tanstack/react-table';
import { Copy, CreditCard, FileText, Mail, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

type ActionsCellProps = CellContext<Order, unknown>;

export function ActionsCell({ row }: ActionsCellProps) {
  const order = row.original;
  const paymentStatus = order.paymentStatus;

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.id.toString());
      toast.success(`#${order.id} copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy order ID');
    }
  };

  return (
    <div key={order.id.toString()} className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {paymentStatus === 'unpaid' && (
            <DropdownMenuItem className="cursor-pointer">
              <CreditCard />
              Checkout
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="cursor-pointer" asChild>
            <a
              href={`${site.url}/orders/${order.id}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText />
              Print Invoice
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Mail />
            Email us
          </DropdownMenuItem>
          <DropdownMenuItem className="text-whatsapp cursor-pointer">
            <Whatsapp />
            Chat us
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleCopyOrderId}>
            <Copy />
            Copy Order ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
  ``;
}
