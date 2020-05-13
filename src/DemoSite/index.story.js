// @flow

import React from "react"

import { storiesOf } from "@storybook/react"

import DemoSite from "./"

storiesOf("DemoSite", module)
    .add("Basic", () => <DemoSite />)
    .add("Multiple", () =>{
            return(
                <React.Fragment>
                    <DemoSite />
                    <DemoSite />
                </React.Fragment>
            )
        }
    )
