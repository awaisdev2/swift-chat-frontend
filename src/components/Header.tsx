import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  useAuth,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { createClerkSupabaseClient } from "@/config/supabase";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
            <NavigationMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/")}
            >
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  location.pathname === "/"
                    ? "bg-gray-400 hover:bg-gray-300 transition-all text-white"
                    : "hover:bg-gray-300"
                }`}
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>
            {isSignedIn && (
              <NavigationMenuItem
                className="cursor-pointer"
                onClick={() => navigate("/chats")}
              >
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} ${
                    location.pathname === "/chats"
                      ? "bg-gray-400 hover:bg-gray-300 transition-all text-white"
                      : "hover:bg-gray-300"
                  }`}
                >
                  Chats
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
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
