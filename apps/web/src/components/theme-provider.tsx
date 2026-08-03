import * as React from "react"
import {
  ThemeProvider as NextThemeProvider,
  useTheme,
  type ThemeProviderProps,
} from "next-themes"

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      Boolean(
        target.closest("input, textarea, select, [contenteditable='true']")
      ))
  )
}

function ThemeShortcut() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.key.toLowerCase() !== "d" ||
        isEditableTarget(event.target)
      ) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [resolvedTheme, setTheme])

  return null
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ThemeShortcut />
      {children}
    </NextThemeProvider>
  )
}

export { ThemeProvider }
