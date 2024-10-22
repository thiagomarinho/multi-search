// DOM elements
const addUrlButton = document.getElementById('addUrl');
const saveUrlsButton = document.getElementById('saveUrls');
const urlInput = document.getElementById('newUrl');
const urlList = document.getElementById('urlList');

// Array to hold URLs
let urls = [];

// Load saved URLs on page load
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['savedUrls'], (result) => {
    if (result.savedUrls) {
      urls = result.savedUrls;
      renderUrlList();
    }
  });
});

// Add a new URL to the list
addUrlButton.addEventListener('click', () => {
  const newUrl = urlInput.value.trim();
  if (newUrl && !urls.includes(newUrl)) {
    urls.push(newUrl);
    renderUrlList();
    urlInput.value = '';  // Clear input
  }
});

// Save URLs to Chrome storage
saveUrlsButton.addEventListener('click', () => {
  chrome.storage.sync.set({ savedUrls: urls }, () => {
    alert('URLs saved successfully!');
  });
});

// Render the URL list
function renderUrlList() {
  urlList.innerHTML = '';  // Clear the current list
  urls.forEach((url, index) => {
    const li = document.createElement('li');
    li.textContent = url;
    
    // Add delete button for each URL
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px';
    deleteButton.addEventListener('click', () => {
      urls.splice(index, 1);
      renderUrlList();
    });

    li.appendChild(deleteButton);
    urlList.appendChild(li);
  });
}
