import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

const embla = vi.hoisted(() => ({
  canScrollNext: vi.fn(() => true),
  canScrollPrev: vi.fn(() => false),
  off: vi.fn(),
  on: vi.fn(),
  scrollNext: vi.fn(),
  scrollPrev: vi.fn(),
}))

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), embla],
}))

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@souk/ui/components/carousel"

describe("Carousel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("registers Embla listeners and removes them on unmount", () => {
    const { unmount } = render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>One</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    expect(embla.on).toHaveBeenCalledWith("reInit", expect.any(Function))
    expect(embla.on).toHaveBeenCalledWith("select", expect.any(Function))

    unmount()

    expect(embla.off).toHaveBeenCalledWith("reInit", expect.any(Function))
    expect(embla.off).toHaveBeenCalledWith("select", expect.any(Function))
  })

  it("routes keyboard navigation to Embla", async () => {
    render(
      <Carousel aria-label="Highlights">
        <CarouselContent>
          <CarouselItem>One</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )

    const carousel = screen.getByRole("region", { name: "Highlights" })
    fireEvent.keyDown(carousel, { key: "ArrowRight" })
    fireEvent.keyDown(carousel, { key: "ArrowLeft" })
    fireEvent.keyDown(carousel, { key: "Escape" })

    expect(embla.scrollNext).toHaveBeenCalledTimes(1)
    expect(embla.scrollPrev).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(screen.getByText("Next slide").closest("button")).toBeEnabled()
    )
  })
})
