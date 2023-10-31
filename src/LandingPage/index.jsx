// @flow

import React from "react"
import Button from "@mui/material/Button"
import {createTheme, styled, ThemeProvider} from "@mui/material/styles"
import * as colors from "@mui/material/colors"
import Markdown from "react-markdown"
import GitHubButton from "react-github-btn"
import "./github-markdown.css"
import content from './content.md'
import remarkGfm from 'remark-gfm'


const theme = createTheme()
const RootContainer = styled("div")(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}))
const ContentContainer = styled("div")(({theme}) => ({
  width: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  maxWidth: 1200,
}))
const Header = styled("div")(({theme}) => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  backgroundColor: colors.blue[600],
  padding: 8,
  boxSizing: "border-box",
}))
const HeaderButton = styled(Button)(({theme}) => ({
  color: "white",
  margin: 8,
  padding: 16,
  paddingLeft: 24,
  paddingRight: 24,
}))
const Hero = styled("div")(({theme}) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  backgroundColor: colors.blue[500],
  padding: 16,
  color: "white",
  boxSizing: "border-box",
}))
const HeroMain = styled("div")(({theme}) => ({
  fontSize: 48,
  fontWeight: "bold",
  paddingTop: 64,
  textShadow: "0px 1px 5px rgba(0,0,0,0.3)",
}))
const HeroSub = styled("div")(({theme}) => ({
  paddingTop: 32,
  lineHeight: 1.5,
  fontSize: 24,
  textShadow: "0px 1px 3px rgba(0,0,0,0.2)",
}))
const HeroButtons = styled("div")(({theme}) => ({
  paddingTop: 32,
  paddingBottom: 48,
}))
const Section = styled("div")(({theme}) => ({
  display: "flex",
  padding: 16,
  paddingTop: 32,
  flexDirection: "column",
}))

function flatten(text, child) {
  return typeof child === "string"
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text)
}

const LandingPage = () => {
  return (
    <ThemeProvider theme={theme}>
      <RootContainer>
        <Header id="about" key="header">
          <ContentContainer style={{flexDirection: "row", flexGrow: 1}}>
            <HeaderButton href="#features">Features</HeaderButton>
            <HeaderButton href="#usage">Usage</HeaderButton>
            <HeaderButton href="#props">Props</HeaderButton>
            <HeaderButton href="./demo">Demo Playground</HeaderButton>
          </ContentContainer>
        </Header>
        <Hero>
          <ContentContainer>
            <HeroMain>React Image Annotate</HeroMain>
            <HeroSub>
              Powerful React component for image annotations with bounding
              boxes, tagging, classification, multiple images and polygon
              segmentation.
            </HeroSub>
            <HeroButtons>
              <GitHubButton
                href="https://github.com/waoai/react-image-annotate"
                data-size="large"
                data-show-count="true"
                aria-label="Star waoai/react-image-annotate on GitHub"
              >
                Star
              </GitHubButton>
            </HeroButtons>
          </ContentContainer>
        </Hero>
        <ContentContainer className="markdown-body">
          <Section className="markdown-body">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </Section>
        </ContentContainer>
      </RootContainer>
    </ThemeProvider>
  )
}

export default LandingPage
