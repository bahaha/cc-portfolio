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
  getSectionEl?: (anchorEl: HTMLElement) => HTMLElement;
};

export function ScrollSpy(option: ScrollSpyOptions) {
  const activeClass = Array.isArray(option.activeClass)
    ? option.activeClass
    : [option.activeClass];
  const topThreshold = option.topThreshold ?? 300;
  const getSectionEl = option.getSectionEl ?? ((el) => el);

  const navEl =
    typeof option.nav === "string"
      ? document.querySelector<HTMLElement>(option.nav)
      : option.nav;
  const { navs, anchors } = readPageAnchors();
  const anchorHeights = getSectionHeights(anchors);
  const sections = getSections(anchors);

  function listen() {
    highlightSectionOnAnchorClick();
    // window.addEventListener("scroll", debounce(handlePageScroll, 100));
    // handlePageScroll();

    const navSectionRelation = new Map<HTMLElement, HTMLElement>();
    const topThresholdRatio =
      100 -
      Math.round((topThreshold / document.documentElement.clientHeight) * 100);
    const observer = new IntersectionObserver(
      handleOnSectionIntersectionChange(navSectionRelation),
      {
        rootMargin: `0px 0px -${topThresholdRatio}% 0px`,
      },
    );
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      navSectionRelation.set(section, navs[i]);
      observer.observe(section);
    }
  }

  function handleOnSectionIntersectionChange(
    cachedEntries: Map<HTMLElement, HTMLElement>,
  ) {
    const intersectionSections = new Map<HTMLElement, HTMLElement>();

    function handler(entries: IntersectionObserverEntry[]): void {
      for (const entry of entries) {
        const section = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          const nav = cachedEntries.get(section);
          nav && intersectionSections.set(section, nav);
        } else {
          intersectionSections.delete(section);
        }
      }
      highlight(intersectionSections.values().next()?.value);
    }
    return handler;
  }

  function handlePageScroll() {
    const viewportHeight = document.documentElement.clientHeight;
    // approach I: use page y offset to find the active section
    // const yOffset = document.documentElement.scrollTop; // pageYOffset is deprecated.
    // PROS:
    // - search is fast with binary search since the start, end position of sections are sorted
    // CONS:
    // - if section height is dynamic, the active section may not be accurate
    // - the layout of html elements are restrict to find the actual section height
    let lo = 0;
    let hi = anchorHeights.length;

    const yOffset = document.documentElement.scrollTop;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const { begin, end } = anchorHeights[mid];

      if (begin === yOffset + topThreshold) {
        highlight(navs[mid]);
        return;
      } else if (begin > yOffset + topThreshold) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }

    highlight(navs[lo - 1]);

    // approach II: find the active section by calculating the rect of boundary sections with offset
    // binary search can be used to optimize the search if the anchors are sorted which is the common case
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

    // let activeSection = -1;
    // for (let i = 0; i < sections.length; i++) {
    //   const section = sections[i];
    //   const rect = section.getBoundingClientRect();
    //
    //   if (
    //     isSectionNearTop(rect) ||
    //     isSectionOverflown(rect, sections.indexOf(section))
    //   ) {
    //     activeSection = i;
    //     break;
    //   }
    // }
    //
    // highlight(anchors[activeSection]);

    // function isSectionInView(rect: DOMRect) {
    //   return rect.top >= 0 && rect.top <= viewportHeight;
    // }

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
    // function isSectionNearTop(rect: DOMRect) {
    //   return isSectionInView(rect) && rect.top <= topThreshold;
    // }

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
    // function isSectionOverflown(rect: DOMRect, index: number) {
    //   if (rect.top >= 0 || index + 1 >= sections.length) return false;
    //   const nextRect = sections[index + 1].getBoundingClientRect();
    //   return (
    //     nextRect.top > viewportHeight ||
    //     (isSectionInView(nextRect) && !isSectionNearTop(nextRect))
    //   );
    // }
  }

  function highlightSectionOnAnchorClick() {
    for (const nav of navs) {
      nav.addEventListener("click", (e) => {
        e.target && highlight(e.target as HTMLAnchorElement);
      });
    }
  }

  function readPageAnchors(): {
    navs: HTMLAnchorElement[];
    anchors: HTMLElement[];
  } {
    if (!navEl) return { navs: [], anchors: [] };
    const navs: HTMLAnchorElement[] = [];
    const anchors: HTMLElement[] = [];

    for (const nav of navEl.querySelectorAll<HTMLAnchorElement>(
      "a[href^='#']",
    )) {
      navs.push(nav);
      const href = nav.getAttribute("href");
      if (!href) continue;
      const targetId =
        href[0] === "#" ? href.slice(1) : new URL(href).hash.slice(1);
      const section = document.getElementById(targetId);
      if (section) {
        anchors.push(section);
      }
    }

    return { navs, anchors };
  }

  function getSections(anchorElements: HTMLElement[]) {
    const sections: HTMLElement[] = [];
    for (const anchor of anchorElements) {
      const section = getSectionEl(anchor);
      sections.push(section);
    }
    return sections;
  }

  function getSectionHeights(titleElements: HTMLElement[]) {
    const sectionHeights: { begin: number; end: number }[] = [];

    for (const el of titleElements) {
      const section = getSectionEl(el);
      const top = section.offsetTop;
      const height = section.offsetHeight;

      sectionHeights.push({ begin: top, end: top + height });
    }

    return sectionHeights;
  }

  function highlight(selector?: string | HTMLElement) {
    if (!navEl) return;

    const active = navEl.querySelector("[data-state='active']");
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
