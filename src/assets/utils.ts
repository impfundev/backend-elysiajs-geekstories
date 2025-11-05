document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("share_button") as HTMLButtonElement;
  if (!btn) return;

  const resultPara = document.querySelector<HTMLElement>(".result");
  const fallbackModal = document.getElementById(
    "fallback_modal"
  ) as HTMLElement;

  const metaTitleEl =
    document.querySelector<HTMLMetaElement>('meta[name="title"]');
  const title =
    (metaTitleEl ? metaTitleEl.content : document.title) || "Untitled";
  const metaDescEl = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]'
  );
  const text = metaDescEl ? metaDescEl.content : title;
  const url = window.location.href;

  const shareData: ShareData = { title, text, url };

  if (navigator.share) {
    if (fallbackModal) fallbackModal.style.display = "none";

    btn.addEventListener("click", async () => {
      console.log("Using native Web Share API...");
      try {
        await navigator.share(shareData);
        if (resultPara) resultPara.textContent = "Shared successfully";
      } catch (err: unknown) {
        if (resultPara && err instanceof Error && err.name !== "AbortError") {
          resultPara.textContent = `Error: ${err.message}`;
        }
      }
    });
  } else {
    console.warn("Web Share API not supported. Using fallback modal.");
    btn.style.display = "block";
    btn.addEventListener("click", () => {
      setupFallbackModal(url, title);
    });
  }

  const scrollToTopBtn = document.getElementById("page_up");
  const showOnPx = 200;
  if (scrollToTopBtn) {
    const scrollContainer = () => {
      if (
        document.body.scrollTop > showOnPx ||
        document.documentElement.scrollTop > showOnPx
      ) {
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }
    };

    window.addEventListener("scroll", scrollContainer);
    scrollToTopBtn.addEventListener("click", goToTop);
  }

  const commentBtn = document.getElementById("open_comment");
  const container = document.getElementById("comment_dialog");
  if (!commentBtn || !container) {
    console.warn("Elemen Giscus (tombol atau kontainer) tidak ditemukan.");
    return;
  }

  let hasLoaded = false;
  commentBtn.addEventListener(
    "click",
    () => {
      initCommentGiscus(hasLoaded);
      hasLoaded = true;
    },
    { once: false }
  );
});

const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

function setupFallbackModal(url: string, title: string) {
  const urlInput = document.getElementById(
    "share_url_input"
  ) as HTMLInputElement;
  const copyButton = document.getElementById(
    "copy_button"
  ) as HTMLButtonElement;
  const copyResult = document.getElementById("copy_result") as HTMLElement;
  if (urlInput) urlInput.value = url;

  if (copyButton) {
    copyButton.onclick = () => {
      if (!navigator.clipboard) {
        if (copyResult) copyResult.textContent = "Clipboard API not supported";
        return;
      }

      navigator.clipboard
        .writeText(url)
        .then(() => {
          if (copyResult) copyResult.textContent = "Link copied!";
          copyButton.innerHTML = "<i>check</i>";
          setTimeout(() => {
            if (copyResult) copyResult.textContent = "";
            copyButton.innerHTML = "<i>content_copy</i>";
          }, 2000);
        })
        .catch((err) => {
          if (copyResult) copyResult.textContent = "Failed to copy";
          console.error("Failed to copy text: ", err);
        });
    };
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const twitterLink = document.getElementById(
    "share_twitter"
  ) as HTMLAnchorElement;
  if (twitterLink) {
    twitterLink.href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  }

  const facebookLink = document.getElementById(
    "share_facebook"
  ) as HTMLAnchorElement;
  if (facebookLink) {
    facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  }

  const whatsappLink = document.getElementById(
    "share_whatsapp"
  ) as HTMLAnchorElement;
  if (whatsappLink) {
    whatsappLink.href = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  }
}

function initCommentGiscus(hasLoaded: boolean) {
  if (hasLoaded) return;
  const container = document.getElementById("comment_dialog");
  if (!container) return;
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", "impfundev/geekstories-discussion");
  script.setAttribute("data-repo-id", "R_kgDOQFjFnw");
  script.setAttribute("data-category", "General");
  script.setAttribute("data-category-id", "DIC_kwDOQFjFn84Cw2Gq");
  script.setAttribute("data-mapping", "pathname");
  script.setAttribute("data-strict", "0");
  script.setAttribute("data-reactions-enabled", "1");
  script.setAttribute("data-emit-metadata", "0");
  script.setAttribute("data-input-position", "bottom");
  script.setAttribute("data-theme", "preferred_color_scheme");
  script.setAttribute("data-lang", "en");
  script.setAttribute("data-loading", "lazy");
  script.setAttribute("crossorigin", "anonymous");
  script.setAttribute("defer", "defer");
  container.appendChild(script);
}
