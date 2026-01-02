import { getNav } from '@/actions/get-nav';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Skeleton } from './ui/skeleton';

export async function Nav() {
  const navItems = await getNav();
  return (
    <NavigationMenu className="max-md:hidden">
      {navItems.length > 0 && (
        <NavigationMenuList>
          {navItems.map(({ label, url, id }, idx) => (
            <NavigationMenuItem key={id}>
              <NavigationMenuLink className={navigationMenuTriggerStyle()} href={url}>
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      )}
    </NavigationMenu>
  );
}

export function NavSkeleton() {
  return (
    <div className="flex flex-1 gap-2 overflow-hidden">
      <Skeleton className="h-6 w-32 rounded-md" />
      <Skeleton className="h-6 w-24 rounded-md" />
      <Skeleton className="h-6 w-20 rounded-md" />
    </div>
  );
}
