// @flow

import React, { useState } from "react"
import { storiesOf } from "@storybook/react"
import { action as actionAddon } from "@storybook/addon-actions"
import PageSelector from "./"

const metadataConfigs = [{ key: "pageNumber", level: "photo", options: [] }]

storiesOf("PageSelector", module).add(
  "With edited results — updatedBy semaphore by Metadata toggle",
  () => {
    const [selected, setSelected] = useState(0)
    const [updatedBy, setUpdatedBy] = useState("AGGREGATOR")
    const [mediaPresenterLeaseUntil, setMediaPresenterLeaseUntil] = useState(
      null
    )
    const [humanProcessorConfirmation, setHumanProcessorConfirmation] = useState(
      null
    )
    const handleHumanProcessorConfirmationChange = (confirmed) => {
      actionAddon("onHumanProcessorConfirmationChange")(confirmed)
      return new Promise((resolve) => setTimeout(resolve, 800)).then(() =>
        setHumanProcessorConfirmation(
          confirmed
            ? { confirmedAt: new Date().toISOString(), confirmedBy: "story.user@example.com" }
            : null
        )
      )
    }
    const pages = [
      {
        id: "page-a",
        src: "https://placebear.com/100/140",
        isActive: selected === 0,
        metadata: [{ key: "pageNumber", value: "1" }],
        lockedUntil: null,
        syncError: null,
        isRecalcReady: false,
      },
      {
        id: "page-b",
        src: "https://placebear.com/101/140",
        isActive: selected === 1,
        metadata: [{ key: "pageNumber", value: "2" }],
        lockedUntil: null,
        syncError: null,
        isRecalcReady: false,
      },
    ]
    return (
      <div style={{ display: "flex", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ width: 360, borderRight: "1px solid #ddd" }}>
          <PageSelector
            pages={pages}
            onPageClick={(idx) => setSelected(idx)}
            onMetadataChange={actionAddon("onMetadataChange")}
            metadataConfigs={metadataConfigs}
            onRecalcClick={actionAddon("onRecalcClick")}
            updatedBy={updatedBy}
            mediaPresenterLeaseUntil={mediaPresenterLeaseUntil}
            humanProcessorConfirmation={humanProcessorConfirmation}
            onHumanProcessorConfirmationChange={handleHumanProcessorConfirmationChange}
          />
        </div>
        <div style={{ padding: 16, flex: 1 }}>
          <p>
            Same case-level <code>updatedBy</code> for all pages; semaphore remounts when you switch page (active thumbnail).
            When <code>mediaPresenterLeaseUntil</code> (ISO UTC from Dynamo) is in the future, label shows <strong>Do not modify</strong> (red lamp) even for AGGREGATOR — same as media-presenter webhook lease.
          </p>
          <p>
            <strong>Review completed</strong> can be checked only while the semaphore is Ready; unchecking is always allowed.
            The save is simulated with an 800 ms delay, during which the checkbox is disabled.
          </p>
          <button type="button" onClick={() => setUpdatedBy("AGGREGATOR")}>
            updatedBy = AGGREGATOR
          </button>{" "}
          <button type="button" onClick={() => setUpdatedBy("OPERATOR")}>
            updatedBy = OPERATOR
          </button>
          <div style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={() =>
                setMediaPresenterLeaseUntil(
                  new Date(Date.now() + 60 * 60 * 1000).toISOString()
                )
              }
            >
              Set lease +1h (semaphore: Do not modify)
            </button>{" "}
            <button
              type="button"
              onClick={() => setMediaPresenterLeaseUntil(null)}
            >
              Clear lease
            </button>
          </div>
        </div>
      </div>
    )
  }
)
