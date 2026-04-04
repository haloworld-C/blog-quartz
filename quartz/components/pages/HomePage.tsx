import { ComponentChildren } from "preact"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { htmlToJsx } from "../../util/jsx"
import { PageList, byDateAndAlphabetical } from "../PageList"
import { FullSlug, resolveRelative } from "../../util/path"
import style from "../styles/homePage.scss"
import Search from "../Search"
import Darkmode from "../Darkmode"
import ReaderMode from "../ReaderMode"

// @ts-ignore
import script from "../scripts/homeTabs.inline"

const EXCLUDED_HOME_FOLDERS = new Set(["tags", "content", "Resourse"])

type HomeFolder = {
  slug: string
  title: string
  count: number
}

function getHomeFolders(props: QuartzComponentProps): HomeFolder[] {
  const folderCount = new Map<string, number>()

  for (const file of props.allFiles) {
    const slug = file.slug
    if (!slug || slug === "index" || slug.startsWith("tags/") || slug === "404") continue
    const root = slug.split("/")[0]
    if (!root || EXCLUDED_HOME_FOLDERS.has(root)) continue
    if (slug.endsWith("/index")) continue
    folderCount.set(root, (folderCount.get(root) ?? 0) + 1)
  }

  return [...folderCount.entries()]
    .map(([slug, count]) => {
      const folderIndex = props.allFiles.find((file) => file.slug === `${slug}/index`)
      return {
        slug,
        count,
        title: folderIndex?.frontmatter?.title ?? slug,
      }
    })
    .sort((a, b) => b.count - a.count)
}

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

const HomePage: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, tree } = props
  if (fileData.slug !== "index") {
    const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
    const classes: string[] = fileData.frontmatter?.cssclasses ?? []
    const classString = ["popover-hint", ...classes].join(" ")
    return <article class={classString}>{content}</article>
  }

  const folders = getHomeFolders(props)
  const recommendedFiles = getRecommendedFiles(props)
  const aboutContent = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
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
          <PageList {...props} allFiles={recommendedFiles} limit={24} />
        </div>
      </section>

      <section class="home-tab-panel" data-tab-panel="knowledge">
        <div class="knowledge-grid">
          {folders.map((folder) => (
            <a
              class="knowledge-card internal"
              href={resolveRelative(fileData.slug!, folder.slug as FullSlug)}
            >
              <h3>{folder.title}</h3>
              <p>{folder.count} 篇文章</p>
            </a>
          ))}
        </div>
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
