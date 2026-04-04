import { ComponentChildren } from "preact"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { htmlToJsx } from "../../util/jsx"
import { PageList, byDateAndAlphabetical } from "../PageList"
import { Element, ElementContent, Root } from "hast"
import { toString } from "hast-util-to-string"
import style from "../styles/homePage.scss"
import Search from "../Search"
import Darkmode from "../Darkmode"
import ReaderMode from "../ReaderMode"

// @ts-ignore
import script from "../scripts/homeTabs.inline"

function getRecommendedFiles(props: QuartzComponentProps) {
  const list = props.allFiles
    .filter((file) => {
      const slug = file.slug
      if (!slug || slug === "index" || slug === "404") return false
      if (slug.startsWith("tags/") || slug.endsWith("/index")) return false
      const recommend = file.frontmatter?.recommend
      const isRecommended =
        recommend === true || (typeof recommend === "string" && recommend.toLowerCase() === "true")
      if (!isRecommended) return false
      return true
    })
    .sort(byDateAndAlphabetical(props.cfg))

  return list
}

function getSectionTree(tree: Root, headingText: string, depth = 3): Root | null {
  let startIndex: number | undefined
  let endIndex = tree.children.length

  for (const [index, node] of tree.children.entries()) {
    if (node.type !== "element") continue

    const element = node as Element
    if (element.tagName !== `h${depth}`) continue

    const text = toString(element).trim()
    if (startIndex === undefined) {
      if (text === headingText) {
        startIndex = index + 1
      }
      continue
    }

    endIndex = index
    break
  }

  if (startIndex === undefined) {
    return null
  }

  return {
    ...tree,
    children: tree.children.slice(startIndex, endIndex) as ElementContent[],
  }
}

const HomePage: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props
  if (fileData.slug !== "index") {
    const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
    const classes: string[] = fileData.frontmatter?.cssclasses ?? []
    const classString = ["popover-hint", ...classes].join(" ")
    return <article class={classString}>{content}</article>
  }

  const recommendedFiles = getRecommendedFiles(props)
  const recommendedTree = getSectionTree(tree as Root, "推荐文章") ?? (tree as Root)
  const recommendedContent = htmlToJsx(fileData.filePath!, recommendedTree) as ComponentChildren
  const knowledgeTree = getSectionTree(tree as Root, "知识导航") ?? (tree as Root)
  const knowledgeContent = htmlToJsx(fileData.filePath!, knowledgeTree) as ComponentChildren
  const aboutTree = getSectionTree(tree as Root, "关于我") ?? (tree as Root)
  const aboutContent = htmlToJsx(fileData.filePath!, aboutTree) as ComponentChildren
  const SearchComponent = Search()
  const DarkmodeComponent = Darkmode()
  const ReaderModeComponent = ReaderMode()

  return (
    <div class="home-tabs popover-hint">
      <div class="home-tabs-header">
        <nav class="home-tabs-nav" aria-label="首页导航">
          <button class="home-tab active" data-tab-trigger="recommended" type="button">
            推荐文章
          </button>
          <button class="home-tab" data-tab-trigger="knowledge" type="button">
            知识导航
          </button>
          <button class="home-tab" data-tab-trigger="about" type="button">
            关于我
          </button>
        </nav>

        <div class="home-toolbar">
          <div class="home-toolbar-search">
            <SearchComponent {...props} />
          </div>
          <DarkmodeComponent {...props} />
          <ReaderModeComponent {...props} />
        </div>
      </div>

      <section class="home-tab-panel active" data-tab-panel="recommended">
        <div class="recommendation-waterfall">
          <article class="about-card">{recommendedContent}</article>
          <PageList {...props} allFiles={recommendedFiles} limit={24} showIntro />
        </div>
      </section>

      <section class="home-tab-panel" data-tab-panel="knowledge">
        <article class="about-card">{knowledgeContent}</article>
      </section>

      <section class="home-tab-panel" data-tab-panel="about">
        <article class="about-card">{aboutContent}</article>
      </section>
    </div>
  )
}

HomePage.css = style
HomePage.afterDOMLoaded = script

export default (() => HomePage) satisfies QuartzComponentConstructor
