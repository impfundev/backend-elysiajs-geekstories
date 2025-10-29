import { Html } from "@elysiajs/html";

export const PageToolbar = () => (
  <>
    <div class="fixed bottom right margin padding">
      <nav>
        <button class="medium circle" id="page_up">
          <i>arrow_upward</i>
          <div class="tooltip">Return to top</div>
        </button>
        <button class="medium circle" data-ui="#share_dialog" id="share_button">
          <i>share</i>
          <div class="tooltip">Share</div>
        </button>
        <button
          class="medium circle"
          data-ui="#comment_dialog"
          id="open_comment"
        >
          <i>chat</i>
          <div class="tooltip">Comment</div>
        </button>
      </nav>
    </div>
    <ShareDialog />
    <CommentDialog />
  </>
);

const ShareDialog = () => (
  <dialog class="bottom" id="share_dialog">
    <h5>Share this post</h5>

    <div class="field middle-align">
      <input type="text" id="share_url_input" readonly />
      <button class="square" id="copy_button">
        <i>content_copy</i>
      </button>
    </div>
    <div
      id="copy_result"
      style="font-size: 0.9em; color: var(--green-text); margin-top: -10px; margin-bottom: 15px;"
    ></div>

    <nav class="manual-links">
      <a id="share_twitter" href="#" target="_blank" class="chip">
        <i class="small">share</i>X
      </a>
      <a id="share_facebook" href="#" target="_blank" class="chip">
        <i class="small">share</i>
        Facebook
      </a>
      <a id="share_whatsapp" href="#" target="_blank" class="chip">
        <i class="small">share</i>
        WhatsApp
      </a>
    </nav>

    <nav class="right-align">
      <button class="border" data-ui="#share_dialog">
        Close
      </button>
    </nav>
  </dialog>
);

const CommentDialog = () => (
  <dialog id="comment_dialog" class="bottom">
    <h5>Comments</h5>
  </dialog>
);
