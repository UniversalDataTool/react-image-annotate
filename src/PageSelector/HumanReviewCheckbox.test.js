import React from "react"
import ReactDOM from "react-dom"
import { act } from "react-dom/test-utils"
import HumanReviewCheckbox from "./HumanReviewCheckbox"

const confirmation = {
  confirmedAt: "2026-11-11T20:00:00.000Z",
  confirmedBy: "jan@example.com",
}

let container

beforeEach(() => {
  container = document.createElement("div")
  document.body.appendChild(container)
})

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
  container.remove()
})

function render(props) {
  act(() => {
    ReactDOM.render(<HumanReviewCheckbox onChange={() => { }} {...props} />, container)
  })
  return container.querySelector("input")
}

test("can be checked when the case is Ready", () => {
  const onChange = jest.fn()
  const input = render({ updatedBy: "AGGREGATOR", onChange })
  expect(input.checked).toBe(false)
  expect(input.disabled).toBe(false)
  act(() => input.click())
  expect(onChange).toHaveBeenCalledWith(true)
})

test("cannot be checked when the case is not Ready", () => {
  expect(render({ updatedBy: "WEBHOOK" }).disabled).toBe(true)
  const lease = new Date(Date.now() + 3600e3).toISOString()
  expect(render({ updatedBy: "AGGREGATOR", mediaPresenterLeaseUntil: lease }).disabled).toBe(true)
})

test("can be unchecked even when the case is not Ready", () => {
  const onChange = jest.fn()
  const input = render({ updatedBy: "WEBHOOK", humanProcessorConfirmation: confirmation, onChange })
  expect(input.checked).toBe(true)
  expect(input.disabled).toBe(false)
  act(() => input.click())
  expect(onChange).toHaveBeenCalledWith(false)
  expect(container.querySelector("label").title).toContain("jan@example.com")
})

test("stays disabled while the save promise is pending", async () => {
  let resolve
  const onChange = jest.fn(() => new Promise((r) => { resolve = r }))
  const input = render({ updatedBy: "AGGREGATOR", onChange })
  act(() => input.click())
  expect(input.disabled).toBe(true)
  await act(async () => resolve())
  expect(input.disabled).toBe(false)
})
