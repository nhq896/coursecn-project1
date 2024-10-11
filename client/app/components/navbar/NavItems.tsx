import { navItems } from "@/app/constants/navItems";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemsProps {
  isMobile: boolean;
}

const NavItems: React.FC<NavItemsProps> = ({ isMobile }) => {
  const pathname = usePathname();

  return (
    <>
      {!isMobile && (
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems &&
                navItems.map((item, index) => {
                  return (
                    <Link href={item.path} key={index} passHref>
                      <span
                        className={clsx(
                          "px-2 font-medium text-foreground/60 transition-colors hover:text-foreground/80 lg:px-3",
                          pathname === item.path && "underline",
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
      {isMobile && (
        <div className="w-full py-4">
          {navItems &&
            navItems.map((item, index) => {
              const { icon: Icon } = item;

              return (
                <Link href={item.path} key={index} passHref>
                  <span
                    className={clsx(
                      "flex items-center gap-4 py-3 font-medium text-foreground/60 transition-colors hover:text-foreground/80",
                      pathname === item.path && "underline",
                    )}
                  >
                    <Icon />
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </div>
      )}
    </>
  );
};

export default NavItems;
