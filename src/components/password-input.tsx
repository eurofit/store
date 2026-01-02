'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { Eye, EyeClosed } from 'lucide-react';
import { useEffect, useState } from 'react';

type PasswordInputProps = React.ComponentPropsWithRef<'input'> & {
  showPassword?: boolean;
  onShowPasswordChange?: (show: boolean) => void;
};

function PasswordInput({
  showPassword = false,
  onShowPasswordChange,
  ref,
  className,
  ...props
}: PasswordInputProps) {
  const [show, setShow] = useState(showPassword);

  useEffect(() => {
    setShow(showPassword);
  }, [showPassword]);

  const handleToggle = () => {
    const next = !show;
    setShow(next);
    onShowPasswordChange?.(next);
  };

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        className={cn('hide-password-toggle pr-10', className)}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute inset-y-0 right-0 px-3 py-2 hover:bg-transparent"
        onClick={handleToggle}
      >
        {show ? (
          <Eye className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeClosed className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">{show ? 'Hide password' : 'Show password'}</span>
      </Button>
      <style>{`
        .hide-password-toggle::-ms-reveal,
        .hide-password-toggle::-ms-clear {
          visibility: hidden;
          pointer-events: none;
          display: none;
        }
      `}</style>
    </div>
  );
}

export { PasswordInput };
