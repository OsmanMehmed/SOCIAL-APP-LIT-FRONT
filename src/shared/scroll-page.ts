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

    console.log(
      `[ScrollPage] restoreScrollIfNeeded called. key=${key}, shouldRestore=${shouldRestore}`,
    );

    if (!shouldRestore) {
      console.log(`[ScrollPage] No restore flag set, skipping`);
      return;
    }

    // Small delay to ensure content is laid out
    requestAnimationFrame(() => {
      const container = this.getScrollContainer();
      console.log(
        `[ScrollPage] RAF: container=${container ? "found" : "NOT FOUND"}`,
      );
      if (!container) return;

      try {
        const saved = sessionStorage.getItem(`scroll:${key}`);
        console.log(`[ScrollPage] Saved scroll value for ${key}: ${saved}`);
        if (saved) {
          const top = Number(saved);
          if (!Number.isNaN(top)) {
            console.log(`[ScrollPage] Restoring scroll to ${top}`);
            container.scrollTop = top;
            // Verify on the next frame that scroll was applied; if not, keep the flag
            requestAnimationFrame(() => {
              const applied = Math.abs(container.scrollTop - top) < 1;
              console.log(
                `[ScrollPage] verify applied=${applied}, current=${container.scrollTop}, target=${top}, height=${container.scrollHeight}`,
              );
              if (applied) {
                this.clearRestoreFlag();
              }
            });
          }
        }
      } catch {
        // Ignore sessionStorage errors
        console.warn(`[ScrollPage] Error accessing sessionStorage`);
      }
    });
  }

  /**
   * Checks if we should restore scroll (without clearing the flag).
   */
  private checkShouldRestore(): boolean {
    try {
      const flag = sessionStorage.getItem("restore-scroll-on-next-page");
      return flag === "true";
    } catch {
      return false;
    }
  }

  /**
   * Clears the restore flag after finishing.
   */
  private clearRestoreFlag(): void {
    try {
      sessionStorage.removeItem("restore-scroll-on-next-page");
    } catch {}
  }
}
