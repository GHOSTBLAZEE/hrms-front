"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  IconCreditCard,
  IconChevronDown,
  IconLogout,
  IconBell,
  IconUser,
  IconSettings,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { logoutApi } from "@/lib/authApi"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function NavUser({ user }) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  // ✅ PROPER LOGOUT MUTATION
  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    
    onSuccess: () => {
      // Clear all React Query cache
      queryClient.clear()
      
      // Clear local storage (if you store anything there)
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      sessionStorage.clear()
      
      // Show success message
      toast.success("Logged out successfully", {
        description: "You have been signed out of your account"
      })
      
      // Redirect to login
      router.push('/login')
    },
    
    onError: (error) => {
      console.error('Logout error:', error)
      
      // Even if API fails, clear frontend and redirect
      queryClient.clear()
      localStorage.clear()
      sessionStorage.clear()
      
      toast.error("Logout completed", {
        description: "Session ended. Redirecting to login..."
      })
      
      // Still redirect to login
      router.push('/login')
    },
  })

  const handleLogout = () => {
    setShowLogoutDialog(false)
    logoutMutation.mutate()
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors"
              >
                <Avatar className="h-8 w-8 rounded-lg border-2 border-border">
                  <AvatarImage 
                    src={user.avatar} 
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <IconChevronDown className="ml-auto size-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-lg shadow-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-2 text-sm">
                  <Avatar className="h-10 w-10 rounded-lg border-2 border-border">
                    <AvatarImage 
                      src={user.avatar} 
                      alt={user.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/dashboard/profile')}
                >
                  <IconUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/dashboard/settings')}
                >
                  <IconSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => router.push('/dashboard/notifications')}
                >
                  <IconBell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={() => setShowLogoutDialog(true)}
                disabled={logoutMutation.isPending}
              >
                <IconLogout className="mr-2 h-4 w-4" />
                <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* ✅ LOGOUT CONFIRMATION DIALOG */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={logoutMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {logoutMutation.isPending ? (
                <>
                  <IconLogout className="mr-2 h-4 w-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                "Log out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}