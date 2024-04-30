function debounce(fn, delay: number) {
  let timeout: NodeJS.Timeout | null;
  return function (...args: any[]) {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

type ScrollSpyOptions = {
  nav: string | HTMLElement;
  activeClass: string | string[];
  topThreshold?: number;
};

export function ScrollSpy(option: ScrollSpyOptions) {
  const activeClass = Array.isArray(option.activeClass)
    ? option.activeClass
    : [option.activeClass];
  const topThreshold = option.topThreshold ?? 300;
  const nav =
    typeof option.nav === "string"
      ? document.querySelector<HTMLElement>(option.nav)
      : option.nav;
  const { anchors, sections } = readPageAnchors();

  function listen() {
    highlightSectionOnAnchorClick();
    window.addEventListener("scroll", debounce(handlePageScroll, 100));
    handlePageScroll();
  }

  function handlePageScroll() {
    // approach I: use page y offset to find the active section; pageYOffset is deprecated
    // const yOffset = document.documentElement.scrollTop;

    // approach II: find the active section by calculating the rect of boundary sections with offset
    // binary search can be used to optimize the search if the anchors are sorted which is the common case
    const viewportHeight = document.documentElement.clientHeight;
    // FIXME: find an approach to determine if the active section
    // is above or below the viewport to adopt the binary search

    // let lo = 0;
    // let hi = sections.length;
    //
    // while (lo < hi) {
    //   const mid = lo + Math.floor((hi - lo) / 2);
    //   const rect = sections[mid].getBoundingClientRect();
    //
    //   if (isSectionNearTop(rect) || isSectionOverflown(rect, mid)) {
    //     // lowest most section
    //     hi = mid;
    //   } else if (rect.top > viewportHeight) {
    //     // current section is below the viewport, search in the upper half
    //     lo = mid + 1;
    //   } else {
    //     hi = mid;
    //   }
    // }
    //
    // if (lo > hi) {
    //   // TODO: find an approach to handle the case when only part of bottom of section are visible.
    //   return;
    // }
    //
    // highlight(anchors[lo]);

    let activeSection = -1;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();

      if (
        isSectionNearTop(rect) ||
        isSectionOverflown(rect, sections.indexOf(section))
      ) {
        activeSection = i;
        break;
      }
    }

    highlight(anchors[activeSection]);

    function isSectionInView(rect: DOMRect) {
      return rect.top >= 0 && rect.top <= viewportHeight;
    }

    /**
     *  +-------------+ <- viewport top
     *  |             | <- topThreshold
     *  | +---------+ | <- section top
     *  | |/////////| |
     *  | |/////////| |
     *  | |/////////| |
     *  | +---------+ | <- section bottom
     *  |             |
     *  +-------------+ <- viewport bottom
     */
    function isSectionNearTop(rect: DOMRect) {
      return isSectionInView(rect) && rect.top <= topThreshold;
    }

    /**
     *    +---------+  <- section I top             +---------+  <- section I top
     *    |/////////|                               |/////////|
     *  +-------------+ <- viewport top           +-------------+ <- viewport top
     *  | |/////////| |                           | |/////////| |
     *  | |/////////| |                           | +---------+ | <- section I bottom
     *  | |/////////| |                           |             |
     *  | |/////////| |                           | +---------+ | <- section II top
     *  +-------------+ <- viewport bottom        +-------------+ <- viewport bottom
     *    |/////////|                               |#########|
     *    +---------+  <- section I bottom          |#########|
     *                                              +---------+  <- section I bottom
     *    +---------+  <- section II top
     *    |#########|
     */
    function isSectionOverflown(rect: DOMRect, index: number) {
      if (rect.top >= 0 || index + 1 >= sections.length) return false;
      const nextRect = sections[index + 1].getBoundingClientRect();
      return (
        (isSectionInView(nextRect) && !isSectionNearTop(nextRect)) ||
        nextRect.top > viewportHeight
      );
    }
  }

  function highlightSectionOnAnchorClick() {
    for (const anchor of anchors) {
      anchor.addEventListener("click", (e) => {
        e.target && highlight(e.target as HTMLAnchorElement);
      });
    }
  }

  function readPageAnchors() {
    if (!nav) return { anchors: [], sections: [] };
    const sections: HTMLElement[] = [];
    const anchors: HTMLAnchorElement[] = [];

    for (const anchor of nav.querySelectorAll<HTMLAnchorElement>(
      "a[href^='#']",
    )) {
      anchors.push(anchor);
      const href = anchor.getAttribute("href");
      if (!href) continue;
      const targetId =
        href[0] === "#" ? href.slice(1) : new URL(href).hash.slice(1);
      const section = document.getElementById(targetId);
      if (section) {
        sections.push(section);
      }
    }

    return { anchors, sections };
  }

  function highlight(selector?: string | HTMLElement) {
    if (!nav) return;

    const active = nav.querySelector("[data-state='active']");
    if (active) {
      active.removeAttribute("data-state");
      active.classList.remove(...activeClass);
    }

    const target =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;
    if (!target) return;

    target.setAttribute("data-state", "active");
    target.classList.add(...activeClass);
  }

  return { listen };
}
