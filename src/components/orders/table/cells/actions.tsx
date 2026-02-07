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
import { sampleInvoice } from '@/pdf/invoice/data';
import { InvoiceDoc } from '@/pdf/invoice/doc';
import { Order } from '@/types';
import { pdf } from '@react-pdf/renderer';
import { CellContext } from '@tanstack/react-table';
import { Copy, CreditCard, FileText, Mail, MoreVertical } from 'lucide-react';
import QrCode from 'qrcode';
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

  const handlePrintInvoice = async () => {
    const url = await getOrderInvoiceUrl();

    window.open(url, '_blank');
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
          <DropdownMenuItem className="cursor-pointer" onClick={handlePrintInvoice}>
            <FileText />
            Print Invoice
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Mail />
            Email us
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
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

async function getOrderInvoiceUrl() {
  const qrCode = await QrCode.toDataURL('https://share.google/84Zpx44Yhx0tfIhfP', {
    margin: 0,
  });
  const blob = await pdf(<InvoiceDoc data={sampleInvoice} qrCode={qrCode} />).toBlob();

  const url = URL.createObjectURL(blob);

  return url;
}
