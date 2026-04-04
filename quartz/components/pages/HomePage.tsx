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
  const SearchComponent = Search()
  const DarkmodeComponent = Darkmode()
  const ReaderModeComponent = ReaderMode()

  return (
    <div class="home-tabs popover-hint">
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
        <article class="about-card">
          <h3>熊也 (Hal)</h3>
          <p>
            机器人工程师，专注于 AI 与决策规划控制系统的结合，持续沉淀可复用的工程方法与算法理解。
          </p>
          <p>这里会记录从工程落地到算法理论的实践与思考。</p>
        </article>
        <div class="work-grid">
          <a
            class="work-card"
            href="https://github.com/haloworld-C"
            target="_blank"
            rel="noreferrer"
          >
            <h4>GitHub 主页</h4>
            <p>个人项目与技术实践的持续更新。</p>
          </a>
          <a
            class="work-card"
            href="https://github.com/haloworld-C/blog-quartz"
            target="_blank"
            rel="noreferrer"
          >
            <h4>博客源码</h4>
            <p>本站 Quartz 博客工程，包含主题与内容结构改造。</p>
          </a>
        </div>
      </section>
    </div>
  )
}

HomePage.css = style
HomePage.afterDOMLoaded = script

export default (() => HomePage) satisfies QuartzComponentConstructor
