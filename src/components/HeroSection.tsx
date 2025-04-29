import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const { isSignedIn } = useUser();
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Welcome to <span className="text-primary">SwiftChat</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Chat fast. Connect instantly. Experience real-time messaging with
          ease.
        </p>
        {!isSignedIn && (
          <SignInButton mode="modal">
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        )}
        {isSignedIn && (
          <Button asChild size="lg">
            <Link to="/chats" className="text-white">
              Start Chatting
            </Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default Hero;
