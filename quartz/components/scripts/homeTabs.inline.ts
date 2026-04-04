document.addEventListener("nav", () => {
  const groups = document.querySelectorAll<HTMLElement>(".home-tabs")

  for (const group of groups) {
    const triggers = group.querySelectorAll<HTMLButtonElement>("[data-tab-trigger]")
    const panels = group.querySelectorAll<HTMLElement>("[data-tab-panel]")
    if (triggers.length === 0 || panels.length === 0) continue

    const activate = (tabName: string) => {
      for (const trigger of triggers) {
        trigger.classList.toggle("active", trigger.dataset.tabTrigger === tabName)
      }
      for (const panel of panels) {
        panel.classList.toggle("active", panel.dataset.tabPanel === tabName)
      }
    }

    const onClick = (event: Event) => {
      const target = event.currentTarget as HTMLButtonElement
      const tabName = target.dataset.tabTrigger
      if (!tabName) return
      activate(tabName)
    }

    for (const trigger of triggers) {
      trigger.addEventListener("click", onClick)
      window.addCleanup(() => trigger.removeEventListener("click", onClick))
    }
  }
})
