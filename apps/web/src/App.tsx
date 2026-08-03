import type { ColumnDef } from "@tanstack/react-table"
import { useTheme } from "next-themes"
import {
  ArrowRightIcon,
  BoxesIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  CommandIcon,
  CopyIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PackageIcon,
  PlusIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  UsersIcon,
} from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@souk/ui/components/alert"
import { Badge } from "@souk/ui/components/badge"
import { Button } from "@souk/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@souk/ui/components/card"
import { Checkbox } from "@souk/ui/components/checkbox"
import { DataTable } from "@souk/ui/components/data-table"
import { DataTableColumnHeader } from "@souk/ui/components/data-table-column-header"
import { dataTableFacetedFilter } from "@souk/ui/components/data-table-faceted-filter"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@souk/ui/components/empty"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@souk/ui/components/dropdown-menu"
import { Input } from "@souk/ui/components/input"
import { Label } from "@souk/ui/components/label"
import { Progress } from "@souk/ui/components/progress"
import { Separator } from "@souk/ui/components/separator"
import { Switch } from "@souk/ui/components/switch"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@souk/ui/components/tabs"
import { Textarea } from "@souk/ui/components/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@souk/ui/components/tooltip"

type Project = {
  id: string
  name: string
  status: "Active" | "Draft" | "Paused"
  plan: "Starter" | "Scale" | "Enterprise"
  leads: number
  conversion: number
  updated: string
}

const projects: Project[] = [
  {
    id: "prj_01",
    name: "Souk Capture",
    status: "Active",
    plan: "Enterprise",
    leads: 1284,
    conversion: 18.4,
    updated: "2 min ago",
  },
  {
    id: "prj_02",
    name: "Maison Atlas",
    status: "Active",
    plan: "Scale",
    leads: 846,
    conversion: 14.9,
    updated: "18 min ago",
  },
  {
    id: "prj_03",
    name: "Studio North",
    status: "Draft",
    plan: "Starter",
    leads: 224,
    conversion: 9.2,
    updated: "1 hour ago",
  },
  {
    id: "prj_04",
    name: "Mina Finance",
    status: "Paused",
    plan: "Scale",
    leads: 612,
    conversion: 11.8,
    updated: "Yesterday",
  },
  {
    id: "prj_05",
    name: "Parallel Health",
    status: "Active",
    plan: "Enterprise",
    leads: 2104,
    conversion: 21.1,
    updated: "Yesterday",
  },
  {
    id: "prj_06",
    name: "Loom Commerce",
    status: "Draft",
    plan: "Starter",
    leads: 94,
    conversion: 6.7,
    updated: "2 days ago",
  },
]

const statusStyle: Record<Project["status"], string> = {
  Active: "border-success/20 bg-success/10 text-success",
  Draft: "border-info/20 bg-info/10 text-info",
  Paused: "border-warning/30 bg-warning/15 text-warning-foreground",
}

const columns: ColumnDef<Project>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all projects"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(Boolean(value))
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(Boolean(value))}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-lg border bg-muted text-xs font-semibold">
          {row.original.name.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="font-mono text-xs text-muted-foreground">
            {row.original.id}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge variant="outline" className={statusStyle[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
    filterFn: dataTableFacetedFilter,
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan" />
    ),
    filterFn: dataTableFacetedFilter,
  },
  {
    accessorKey: "leads",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Leads"
        className="justify-end"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right tabular-nums">
        {row.original.leads.toLocaleString("en-US")}
      </div>
    ),
  },
  {
    accessorKey: "conversion",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Conversion"
        className="justify-end"
      />
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {row.original.conversion}%
      </div>
    ),
  },
  { accessorKey: "updated", header: "Updated" },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Actions for ${row.original.name}`}
          >
            <MoreHorizontalIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Project actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Open project</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem variant="destructive">Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

const componentGroups = [
  ["Actions", "Button", "Button group", "Toggle", "Toggle group"],
  [
    "Forms",
    "Field",
    "Input",
    "Textarea",
    "Select",
    "Combobox",
    "Checkbox",
    "Radio group",
    "Switch",
    "Input OTP",
    "Calendar",
  ],
  [
    "Navigation",
    "Breadcrumb",
    "Navigation menu",
    "Menubar",
    "Pagination",
    "Sidebar",
    "Tabs",
  ],
  [
    "Overlays",
    "Dialog",
    "Alert dialog",
    "Drawer",
    "Sheet",
    "Popover",
    "Hover card",
    "Tooltip",
    "Dropdown menu",
    "Context menu",
    "Command",
  ],
  [
    "Data",
    "DataTable",
    "Table",
    "Chart",
    "Badge",
    "Avatar",
    "Progress",
    "Skeleton",
    "Empty",
  ],
  [
    "Layout",
    "Card",
    "Accordion",
    "Collapsible",
    "Carousel",
    "Resizable",
    "Scroll area",
    "Separator",
    "Aspect ratio",
  ],
  [
    "AI & files",
    "Attachment",
    "Bubble",
    "Message",
    "Message scroller",
    "Marker",
  ],
  ["Feedback", "Alert", "Sonner", "Spinner", "Kbd", "Item"],
]

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="max-w-2xl space-y-2">
      <div className="font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
        {title}
      </h2>
      <p className="leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunIcon aria-hidden="true" />
          ) : (
            <MoonIcon aria-hidden="true" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Theme · shortcut D</TooltipContent>
    </Tooltip>
  )
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1480px] items-center gap-4 px-4 sm:px-6">
        <a
          href="#top"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="grid size-7 place-items-center rounded-lg bg-foreground text-background">
            <CommandIcon className="size-4" aria-hidden="true" />
          </span>
          Souk UI
          <Badge variant="secondary" className="font-mono">
            v0.1
          </Badge>
        </a>
        <nav
          className="ml-auto hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          <Button variant="ghost" size="sm" asChild>
            <a href="#foundations">Foundations</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#components">Components</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#datatable">DataTable</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#patterns">Patterns</a>
          </Button>
        </nav>
        <Separator orientation="vertical" className="ml-auto h-5 md:ml-0" />
        <ThemeToggle />
        <Button size="sm" asChild>
          <a href="https://github.com/OlivierBelaud/souk-ui">
            GitHub <ExternalLinkIcon aria-hidden="true" />
          </a>
        </Button>
      </div>
    </header>
  )
}

function DashboardPreview() {
  const nav = [
    [LayoutDashboardIcon, "Overview", true],
    [DatabaseIcon, "Projects", false],
    [UsersIcon, "Customers", false],
    [PackageIcon, "Billing", false],
    [SettingsIcon, "Settings", false],
  ] as const
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-xl">
      <div className="flex h-11 items-center gap-2 border-b px-4">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-warning/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
        <span className="mx-auto rounded-md bg-muted px-12 py-1 font-mono text-[10px] text-muted-foreground">
          app.souk.io
        </span>
      </div>
      <div className="grid min-h-[410px] sm:grid-cols-[180px_1fr]">
        <aside className="hidden border-r bg-sidebar p-3 sm:block">
          <div className="mb-5 flex items-center gap-2 px-2 py-1 text-xs font-semibold">
            <span className="grid size-6 place-items-center rounded-md bg-foreground text-[9px] text-background">
              S
            </span>{" "}
            Souk Labs
          </div>
          <div className="space-y-1">
            {nav.map(([Icon, label, active]) => (
              <div
                key={label}
                className={`flex h-8 items-center gap-2 rounded-md px-2 text-xs ${active ? "bg-sidebar-accent font-medium" : "text-muted-foreground"}`}
              >
                <Icon className="size-3.5" />
                {label}
              </div>
            ))}
          </div>
        </aside>
        <div className="bg-background p-4 text-foreground sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold tracking-tight">
                Overview
              </div>
              <div className="text-xs text-muted-foreground">
                Monday, August 3
              </div>
            </div>
            <Button size="sm">
              <PlusIcon />
              Create
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Active projects", "24", "+3.2%"],
              ["New leads", "1,284", "+18.4%"],
              ["Revenue", "€42.8k", "+8.1%"],
            ].map(([label, value, delta]) => (
              <div
                key={label}
                className="rounded-xl border bg-card p-4 shadow-xs"
              >
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-xl font-semibold tracking-tight">
                    {value}
                  </div>
                  <div className="text-[10px] font-medium text-success">
                    {delta}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border bg-card p-4 shadow-xs">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Weekly activity</div>
                <div className="text-xs text-muted-foreground">
                  Unique capture sessions
                </div>
              </div>
              <Badge variant="outline">Last 7 days</Badge>
            </div>
            <div className="flex h-32 items-end gap-2" aria-hidden="true">
              {[42, 58, 46, 72, 64, 88, 78, 92, 68, 84, 76, 96].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t bg-foreground/8 transition-colors hover:bg-foreground/20"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Foundations() {
  const colors = [
    ["Foreground", "bg-foreground"],
    ["Muted", "bg-muted"],
    ["Border", "bg-border"],
    ["Info", "bg-info"],
    ["Success", "bg-success"],
    ["Warning", "bg-warning"],
    ["Destructive", "bg-destructive"],
  ]
  return (
    <section
      id="foundations"
      className="scroll-mt-20 space-y-10 border-t py-20"
    >
      <SectionHeading
        eyebrow="01 · Foundations"
        title="Calm by default. Precise when it matters."
        description="A neutral Linear-inspired canvas, Inter Variable, semantic color only, compact rhythm and one visible focus language across every Souk product."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Color roles</CardTitle>
            <CardDescription>
              OKLCH tokens for perceptual consistency and first-class dark mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {colors.map(([name, color]) => (
              <div key={name} className="space-y-2">
                <div className={`h-14 rounded-lg border ${color}`} />
                <div className="text-xs font-medium">{name}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Type & rhythm</CardTitle>
            <CardDescription>
              One variable typeface, a compact 4px grid and tabular data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="text-3xl font-semibold tracking-[-0.04em]">
                Build once. Scale clearly.
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Display · 30/36 · Semibold
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-[1fr_auto] gap-3 text-sm">
              <span>Body copy remains quiet and readable.</span>
              <span className="font-mono tabular-nums">1,284.40</span>
              <span className="text-muted-foreground">
                Supporting information steps back.
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                12/16
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Components() {
  return (
    <section id="components" className="scroll-mt-20 space-y-10 border-t py-20">
      <SectionHeading
        eyebrow="02 · Components"
        title="The full shadcn/ui surface, owned by Souk."
        description="Composable source-level components built on Radix primitives, with a stable @souk/ui package contract. No visual emulation and no app-local forks."
      />
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Interactive primitives</CardTitle>
            <CardDescription>
              States, focus, disabled behavior and destructive intent are
              encoded once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge
                variant="outline"
                className="border-success/20 bg-success/10 text-success"
              >
                <CheckCircle2Icon />
                Healthy
              </Badge>
            </div>
            <Alert>
              <SparklesIcon aria-hidden="true" />
              <AlertTitle>System-ready pattern</AlertTitle>
              <AlertDescription>
                Composition stays flexible while tokens and behavior stay
                governed.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Workspace setup</span>
                <span className="text-muted-foreground tabular-nums">72%</span>
              </div>
              <Progress value={72} aria-label="Workspace setup progress" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Form pattern</CardTitle>
            <CardDescription>
              Labels remain explicit; errors are semantic and accessible.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="workspace-name">Workspace name</Label>
              <Input id="workspace-name" defaultValue="Souk Labs" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="workspace-brief">Product brief</Label>
              <Textarea
                id="workspace-brief"
                placeholder="Describe the outcome…"
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="weekly-digest">Weekly digest</Label>
                <p className="text-xs text-muted-foreground">
                  Sent every Monday at 09:00.
                </p>
              </div>
              <Switch id="weekly-digest" defaultChecked />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {componentGroups.map(([group, ...items]) => (
          <Card key={group} size="sm">
            <CardHeader>
              <CardTitle>{group}</CardTitle>
              <CardDescription>{items.length} primitives</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-1.5">
              {items.map((item) => (
                <Badge key={item} variant="secondary" className="font-normal">
                  {item}
                </Badge>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function DataTableSection() {
  return (
    <section id="datatable" className="scroll-mt-20 space-y-10 border-t py-20">
      <SectionHeading
        eyebrow="03 · DataTable"
        title="Operational data without rebuilding the plumbing."
        description="Sorting, search, faceted filters, selection, pagination, page size, column visibility, empty states and controlled server-side mode are part of the shared contract."
      />
      <DataTable
        columns={columns}
        data={projects}
        getRowId={(row) => row.id}
        filterColumn="name"
        filterPlaceholder="Search projects…"
        filters={[
          {
            columnId: "status",
            title: "Status",
            options: ["Active", "Draft", "Paused"].map((value) => ({
              label: value,
              value,
            })),
          },
          {
            columnId: "plan",
            title: "Plan",
            options: ["Starter", "Scale", "Enterprise"].map((value) => ({
              label: value,
              value,
            })),
          },
        ]}
        pageSize={5}
        pageSizeOptions={[5, 10, 20]}
        initialSorting={[{ id: "leads", desc: true }]}
        actions={
          <Button size="sm" className="h-8">
            <PlusIcon />
            New project
          </Button>
        }
      />
    </section>
  )
}

function Patterns() {
  return (
    <section id="patterns" className="scroll-mt-20 space-y-10 border-t py-20">
      <SectionHeading
        eyebrow="04 · Product patterns"
        title="Decisions that survive beyond a component."
        description="Common SaaS flows are shown as compositions so new products inherit hierarchy, interaction and language—not just colors."
      />
      <Tabs defaultValue="settings" className="gap-5">
        <TabsList variant="line">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="empty">Empty state</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Workspace settings</CardTitle>
              <CardDescription>
                Manage the shared defaults for every member.
              </CardDescription>
              <CardAction>
                <Button variant="outline" size="sm">
                  <CopyIcon />
                  Copy ID
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Souk" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug">Workspace slug</Label>
                  <Input id="slug" defaultValue="souk" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">
                    Two-factor requirement
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Enforce 2FA for all administrators.
                  </div>
                </div>
                <Switch aria-label="Require two-factor authentication" />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="outline">Discard</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="empty">
          <Card className="max-w-2xl">
            <CardContent className="p-0">
              <Empty className="min-h-72 border-0">
                <EmptyHeader>
                  <EmptyMedia
                    variant="icon"
                    className="size-11 rounded-xl border"
                  >
                    <BoxesIcon className="size-5" />
                  </EmptyMedia>
                  <EmptyTitle>No integrations yet</EmptyTitle>
                  <EmptyDescription>
                    Connect your first source to begin synchronizing customer
                    data.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button>
                    <PlusIcon />
                    Add integration
                  </Button>
                </EmptyContent>
              </Empty>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Scale plan</CardTitle>
              <CardDescription>
                Everything your team needs to run production workflows.
              </CardDescription>
              <CardAction>
                <Badge>Current plan</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold tracking-tight">
                  €149
                </span>
                <span className="text-muted-foreground">/ month</span>
              </div>
              <div className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                {[
                  "Unlimited projects",
                  "20 team members",
                  "Advanced DataTable",
                  "Priority support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-4 text-success" />
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="text-xs text-muted-foreground">
                Renews September 3
              </span>
              <Button variant="outline">Manage billing</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: ShieldCheckIcon,
            title: "Accessible",
            description:
              "Keyboard, focus, contrast and reduced motion are baseline behavior.",
          },
          {
            icon: PackageIcon,
            title: "Versioned",
            description:
              "Changesets and semantic releases make upgrades deliberate.",
          },
          {
            icon: CircleDotIcon,
            title: "Observable",
            description:
              "Tests, package checks and visual QA guard every release.",
          },
        ].map(({ icon: Icon, title, description }) => (
          <Card key={title} size="sm">
            <CardHeader>
              <span className="mb-2 grid size-8 place-items-center rounded-lg bg-muted">
                <Icon className="size-4" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

export function App() {
  return (
    <TooltipProvider>
      <div id="top" className="min-h-svh bg-background">
        <AppHeader />
        <main className="mx-auto max-w-[1480px] px-4 sm:px-6">
          <section className="grid items-center gap-12 py-16 lg:grid-cols-[.82fr_1.18fr] lg:py-24">
            <div>
              <Badge variant="outline" className="mb-5 gap-1.5">
                <SparklesIcon />
                Souk product infrastructure
              </Badge>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.055em] text-balance sm:text-6xl">
                One interface language for every Souk SaaS.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-7 text-muted-foreground">
                A governed React 19 component system powered by Tailwind CSS 4,
                the real shadcn/ui registry and TanStack Table.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <Button size="lg" asChild>
                  <a href="#components">
                    Explore the system <ArrowRightIcon />
                  </a>
                </Button>
                <Button size="lg" variant="outline">
                  <CommandIcon />
                  npm i @souk/ui
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2Icon className="size-3.5 text-success" />
                  React 19
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2Icon className="size-3.5 text-success" />
                  Tailwind 4
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2Icon className="size-3.5 text-success" />
                  Tree-shakeable ESM
                </span>
              </div>
            </div>
            <DashboardPreview />
          </section>
          <Foundations />
          <Components />
          <DataTableSection />
          <Patterns />
        </main>
        <footer className="border-t">
          <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Souk UI · Product infrastructure, not decoration.</span>
            <span className="font-mono text-xs">
              React 19 · Tailwind 4 · shadcn/ui · TanStack Table
            </span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
