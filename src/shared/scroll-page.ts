import { LitElement } from "lit";

/**
 * Base class for pages that need scroll restoration.
 * Uses sessionStorage to keep per-path scroll positions and restores them on back navigation.
 */
export class ScrollPage extends LitElement {
  protected getScrollContainer(): HTMLElement | null {
    // Walk up through shadow roots to find app-main (page -> app-root)
    let root: Node | null = this.getRootNode();
    while (root instanceof ShadowRoot) {
      const appMain = root.querySelector(".app-main") as HTMLElement | null;
      if (appMain) return appMain;
      const host = (root as ShadowRoot).host;
      root = host ? host.getRootNode() : null;
    }
    // Fallback in case we are outside shadow DOM
    return document.querySelector(".app-main");
  }

  /**
   * Call in firstUpdated() of the subclass to restore scroll.
   * Uses the current pathname as key unless a custom key is provided.
   */
  protected restoreScrollIfNeeded(pathKey?: string) {
    const key = pathKey || location.pathname;
    const shouldRestore = this.checkShouldRestore();

    if (!shouldRestore) {
      return;
    }

    // Small delay to ensure content is laid out
    requestAnimationFrame(() => {
      const container = this.getScrollContainer();
      if (!container) return;

      const saved = sessionStorage.getItem(`scroll:${key}`);
      if (saved) {
        const top = Number(saved);
        if (!Number.isNaN(top)) {
          container.scrollTop = top;
          // Verify on the next frame that scroll was applied; if not, keep the flag
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

  /**
   * Checks if we should restore scroll (without clearing the flag).
   */
  private checkShouldRestore(): boolean {
    const flag = sessionStorage.getItem("restore-scroll-on-next-page");
    return flag === "true";
  }

  /**
   * Clears the restore flag after finishing.
   */
  private clearRestoreFlag(): void {
    sessionStorage.removeItem("restore-scroll-on-next-page");
  }
}
