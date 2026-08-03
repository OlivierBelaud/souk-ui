import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Progress } from "@soukjs/ui/components/progress"

describe("Progress", () => {
  it("forwards the default value contract to the accessible primitive", () => {
    render(<Progress value={25} />)

    const progress = screen.getByRole("progressbar")
    expect(progress).toHaveAttribute("aria-valuenow", "25")
    expect(progress).toHaveAttribute("aria-valuemax", "100")
    expect(progress).toHaveAttribute("data-state", "loading")
    expect(progress.firstElementChild).toHaveStyle(
      "transform: translateX(-75%)"
    )
  })

  it("supports custom maxima and clamps the visual percentage", () => {
    const { rerender } = render(<Progress value={25} max={50} />)

    const progress = screen.getByRole("progressbar")
    expect(progress).toHaveAttribute("aria-valuemax", "50")
    expect(progress.firstElementChild).toHaveStyle(
      "transform: translateX(-50%)"
    )

    rerender(<Progress value={75} max={50} />)
    expect(progress.firstElementChild).toHaveStyle("transform: translateX(0%)")
    expect(progress).toHaveAttribute("aria-valuenow", "50")

    rerender(<Progress value={-5} max={0} />)
    expect(progress).toHaveAttribute("aria-valuemax", "100")
    expect(progress).toHaveAttribute("aria-valuenow", "0")
    expect(progress.firstElementChild).toHaveStyle(
      "transform: translateX(-100%)"
    )
  })
})
