console.log("Content script loaded");

function extractUserHref() {
    const anchorTag = document.querySelector('.profile-card-member-details a');
    if (!anchorTag) return null; 

    const href = anchorTag.getAttribute('href');
    return { href };
}

function sendUserHref() {
    const userHref = extractUserHref();
    if (userHref && userHref.href) {
      console.log("Sending user href to background script:", userHref); 
      chrome.runtime.sendMessage({ action: "saveProfile", data: userHref });
    }
}

const observer = new MutationObserver(() => {
    if (document.querySelector('.profile-card-member-details a')) {
      sendUserHref();
      observer.disconnect(); 
    }
});

observer.observe(document.body, { childList: true, subtree: true });
