chrome.runtime.onInstalled.addListener(() => {
  // Open the options page when the extension is installed
  chrome.runtime.openOptionsPage();
});

// Fetch saved URLs
function fetchUrls(callback) {
  chrome.storage.sync.get(['savedUrls'], (result) => {
    if (result.savedUrls) {
      callback(result.savedUrls);
    } else {
      callback([]);
    }
  });
}

chrome.omnibox.onInputEntered.addListener((term) => {
  fetchUrls((urls) => {
    // Array to store created tab IDs
    let createdTabIds = [];
    let isFirstUrl = true;

    // Create the tabs one by one - first url opens in the current tab
    urls.forEach((url, index) => {
      if (isFirstUrl) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            createdTabIds.push(tabs[0].id);

            chrome.tabs.update(tabs[0].id, { url: `${url}${term}` });
          }
        });

        isFirstUrl = false;
      } else {
        chrome.tabs.create({ url: `${url}${term}`, active: false }, (tab) => {
          createdTabIds.push(tab.id);
  
          if (createdTabIds.length === urls.length) {
            chrome.tabs.group({ tabIds: createdTabIds }, (groupId) => {
              if (groupId) {
                chrome.tabGroups.update(groupId, {
                  title: `Searching for ${term}`,
                  color: "purple"
                });
              }
            });
          }
        });
      }
    });
  });
});
