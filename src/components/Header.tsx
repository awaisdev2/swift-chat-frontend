import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { createClerkSupabaseClient } from "@/config/supabase";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUserToSupabase = async () => {
      if (!isSignedIn || !user) return;

      const token = await getToken();
      const supabase = createClerkSupabaseClient(token!);

      const { id, emailAddresses, fullName } = user;
      const email = emailAddresses[0]?.emailAddress;

      const { data, error } = await supabase.from("users").upsert({
        clerk_id: id,
        email,
        name: fullName,
      });

      if (error) {
        console.error("Error saving user to Supabase:", error);
      } else {
        console.log("User synced to Supabase:", data);
      }
    };

    syncUserToSupabase();
  }, [isSignedIn, user, getToken]);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Contact
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <SignOutButton>
              <Button variant="destructive">Sign Out</Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
