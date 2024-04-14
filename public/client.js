const urlForm = document.getElementById("urlForm");
const aLink = document.getElementById("aLink");
const linkContainer = document.getElementById("link");

urlForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const body = JSON.stringify(
    {
      urlInfo: {
        url: event.target.urlInput.value,
        aliase: event.target.nameInput.value,
        password: event.target.passInput.value,
      }
    }
  );

  const newUrl = await fetch(`/create-link`, {
    method: 'post',
    headers: {
      "Content-Type": "application/json",
    },
    body
  });

  const response = await newUrl.json();
  
  if (response.code != "error"){
    aLink.setAttribute("href", response.url);
    aLink.innerHTML = response.url;
    linkContainer.classList.add("active");

    getAllLinks();

    event.target.urlInput.value = "";
    event.target.nameInput.value = "";
  } else {
    alert(response.message);
  }
});

const listOfLinks = document.getElementById('listOfLinks');

async function getAllLinks () {
  const getInfo = await fetch('/recent-links');

  const response = await getInfo.json();

  const output = response.reduce((tags, item) => {
    const row = `<a class="recentLink" href="${item}" target="_blank">${item}</a>`;
    return tags + row;
  }, "");

  listOfLinks.innerHTML = output;
}

document.addEventListener('DOMContentLoaded', getAllLinks);