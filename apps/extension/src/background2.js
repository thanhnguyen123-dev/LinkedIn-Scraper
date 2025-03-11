console.log("Background script loaded");

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "saveProfile") {
        console.log("Received profile data:", message.data);
    }
});
