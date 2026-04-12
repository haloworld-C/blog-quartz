import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
        </p>
        <p class="footer-stats">
          <span id="busuanzi_container_site_pv">
            Total visits <span id="busuanzi_value_site_pv">0</span>
          </span>
          <span id="busuanzi_container_site_uv">
            Visitors <span id="busuanzi_value_site_uv">0</span>
          </span>
          <span id="busuanzi_container_page_pv">
            This page <span id="busuanzi_value_page_pv">0</span>
          </span>
        </p>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
        <script async defer src="https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js" />
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
