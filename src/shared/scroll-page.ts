import { LitElement } from "lit";

export class ScrollPage extends LitElement {
  protected getScrollContainer(): HTMLElement | null {
    let root: Node | null = this.getRootNode();
    while (root instanceof ShadowRoot) {
      const appMain = root.querySelector(".app-main") as HTMLElement | null;
      if (appMain) return appMain;
      const host = (root as ShadowRoot).host;
      root = host ? host.getRootNode() : null;
    }
    return document.querySelector(".app-main");
  }

  protected restoreScrollIfNeeded(pathKey?: string) {
    const key = pathKey || location.pathname;
    const shouldRestore = this.checkShouldRestore();

    if (!shouldRestore) {
      return;
    }

    requestAnimationFrame(() => {
      const container = this.getScrollContainer();
      if (!container) return;

      const saved = sessionStorage.getItem(`scroll:${key}`);
      if (saved) {
        const top = Number(saved);
        if (!Number.isNaN(top)) {
          container.scrollTop = top;
          requestAnimationFrame(() => {
            const applied = Math.abs(container.scrollTop - top) < 1;
            if (applied) {
              this.clearRestoreFlag();
            }
          });
        }
      }
    });
  }

  private checkShouldRestore(): boolean {
    const flag = sessionStorage.getItem("restore-scroll-on-next-page");
    return flag === "true";
  }

  private clearRestoreFlag(): void {
    sessionStorage.removeItem("restore-scroll-on-next-page");
  }
}
