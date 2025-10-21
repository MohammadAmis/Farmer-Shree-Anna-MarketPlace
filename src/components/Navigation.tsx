// src/components/Navigation.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sprout,
  Menu,
  X,
  Home,
  LayoutDashboard,
  File,
  TrendingUp,
  BookOpen,
  HeadphonesIcon,
  Map,
  ShoppingCart,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/qa-reports", label: "QA Reports", icon: File },
    { path: "/orders", label: "Orders", icon: ShoppingCart },
    { path: "/market-prices", label: "Market Prices", icon: TrendingUp },
    { path: "/knowledge", label: "Knowledge Hub", icon: BookOpen },
    { path: "/qa-center-map", label: "QA Center Map", icon: Map },
    { path: "/support", label: "Support", icon: HeadphonesIcon },
  ];

  const getInitials = (email?: string) => {
    if (!email) return "U";
    return email
      .split("@")[0]
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm" 
        : "bg-background/80 backdrop-blur-lg border-b border-border/20"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 transition-all hover:opacity-80 group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-foreground text-lg tracking-tight">Shree Anna</span>
              <span className="text-xs text-muted-foreground font-medium">Marketplace</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative",
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                  {isActive(link.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] h-1 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Desktop Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="hidden md:flex">
                    <Button 
                      variant="ghost" 
                      className="rounded-2xl px-3 py-2 h-auto gap-2 hover:bg-muted/50 transition-all"
                    >
                      <Avatar className="w-8 h-8 border-2 border-background shadow-sm">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-medium">
                          {getInitials(user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent 
                    align="end" 
                    className="w-64 rounded-2xl p-2 shadow-xl border border-border/50 backdrop-blur-sm"
                  >
                    <div className="px-3 py-3">
                      <div className="text-sm font-semibold text-foreground truncate">
                        {user.email}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Welcome back!
                      </div>
                    </div>
                    
                    <DropdownMenuSeparator className="my-1" />
                    
                    <Link to="/settings">
                      <DropdownMenuItem className="rounded-lg py-3 cursor-pointer flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Settings className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Settings</span>
                          <span className="text-xs text-muted-foreground">Manage your account</span>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                    
                    <DropdownMenuSeparator className="my-1" />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="rounded-lg py-3 text-destructive focus:text-destructive cursor-pointer flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Logout</span>
                        <span className="text-xs text-muted-foreground">Sign out of your account</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile: Settings icon */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-xl"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button 
                  size="sm" 
                  className="hidden md:flex rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-sm hover:shadow transition-all"
                >
                  Login
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/30 animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all",
                      isActive(link.path)
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

              {user ? (
                <div className="flex flex-col gap-1 pt-4 mt-2 border-t border-border/30">
                  <div className="px-4 py-3 flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-background">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-medium">
                        {getInitials(user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">
                        {user.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Active account
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    className="justify-start gap-3 py-3.5 px-4 rounded-xl text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      navigate("/settings");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Button>
                  
                  <Button
                    variant="ghost"
                    className="justify-start gap-3 py-3.5 px-4 rounded-xl text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-4 mt-2 border-t border-border/30">
                  <Link 
                    to="/auth" 
                    className="flex-1" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button 
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};