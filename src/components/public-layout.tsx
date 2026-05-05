import { Link } from "wouter";
import { Store, Search, UserCircle, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import logoDark from "@assets/FB_IMG_1777342978960_1777343138107.jpg";

const FB_PAGE_URL = "https://www.facebook.com/share/1BcP1N5D2S/";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
              <img src={logoDark} alt="Camotes Online Store logo" className="h-9 w-9 rounded-full object-cover" data-testid="img-logo" />
              <span className="font-bold text-xl tracking-tight text-foreground">Camotes Store</span>
            </div>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link href="/services">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground" data-testid="link-services">
                <Store className="w-4 h-4 mr-2" />
                Services
              </Button>
            </Link>
            <Link href="/lookup">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" data-testid="link-lookup">
                <Search className="w-4 h-4 mr-2" />
                Find Account
              </Button>
            </Link>
            <a href={FB_PAGE_URL} target="_blank" rel="noopener noreferrer" data-testid="link-fb-message">
              <Button size="sm" variant="secondary" className="hidden sm:flex font-semibold">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Us on FB
              </Button>
              <Button size="icon" variant="secondary" className="sm:hidden">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </a>
            <Link href="/admin/login">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" title="Admin Login" data-testid="link-admin-login">
                <UserCircle className="w-5 h-5" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="py-8 border-t bg-card text-center text-muted-foreground text-sm">
        <div className="container mx-auto px-4 space-y-2">
          <p className="font-semibold text-foreground">Camotes Online Store — Microfinance Inc. Since 2022</p>
          <p>Cebu City, Philippines • DTI Registered • Business Permit Holder</p>
          <a
            href={FB_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary hover:text-foreground transition-colors"
            data-testid="link-fb-footer"
          >
            <MessageCircle className="w-4 h-4" />
            Message us on Facebook
          </a>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
