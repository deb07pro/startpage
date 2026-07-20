const defaultShortcuts = {
  general: {
    label: "~/general",
    items: [
      { name: "Google", url: "https://google.com/" },
      { name: "YouTube", url: "https://youtube.com" },
      { name: "Gmail", url: "https://mail.google.com/mail/u/0/#inbox" },
    ],
  },
  stuffs: {
    label: "~/stuffs",
    items: [
      { name: "Excalidraw", url: "https://excalidraw.com/" },
      { name: "Photopea", url: "https://www.photopea.com/" },
      { name: "GitHub", url: "https://github.com/" },
    ],
  },
  study: {
    label: "~/study",
    items: [
      { name: "Drive", url: "https://drive.google.com/" },
      { name: "Wolframalpha", url: "https://www.wolframalpha.com/" },
      { name: "Desmos", url: "https://www.desmos.com/calculator" },
    ],
  },
  dumbness: {
    label: "~/social",
    items: [
      { name: "Discord", url: "https://discord.com/" },
      { name: "Reddit", url: "https://reddit.com/" },
      { name: "Twitter", url: "https://x.com/" },
    ],
  },
};

const STORAGE_KEY = "startpage_shortcuts";
let editMode = false;

function loadShortcuts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Failed to load shortcuts, using defaults", e);
  }
  return structuredClone(defaultShortcuts);
}

function saveShortcuts(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let shortcuts = loadShortcuts();

function render() {
  const container = document.getElementById("links");
  container.innerHTML = "";

  for (const key of Object.keys(shortcuts)) {
    const col = shortcuts[key];
    const wrap = document.createElement("div");
    wrap.className = "urls";

    if (!editMode) {
      const header = document.createElement("div");
      header.className = "header";
      header.textContent = col.label + " ";
      wrap.appendChild(header);
    } else {
      const headerInput = document.createElement("input");
      headerInput.type = "text";
      headerInput.value = col.label;
      headerInput.className = "edit-input header-input";
      headerInput.addEventListener("change", (e) => {
        shortcuts[key].label = e.target.value;
        saveShortcuts(shortcuts);
      });
      wrap.appendChild(headerInput);
    }

    const ul = document.createElement("ul");

    col.items.forEach((item, idx) => {
      const li = document.createElement("li");

      if (!editMode) {
        const a = document.createElement("a");
        a.href = item.url;
        a.textContent = item.name;
        li.appendChild(a);
      } else {
        li.classList.add("edit-row");

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = item.name;
        nameInput.className = "edit-input name-input";
        nameInput.addEventListener("change", (e) => {
          shortcuts[key].items[idx].name = e.target.value;
          saveShortcuts(shortcuts);
        });

        const urlInput = document.createElement("input");
        urlInput.type = "text";
        urlInput.value = item.url;
        urlInput.className = "edit-input url-input";
        urlInput.addEventListener("change", (e) => {
          shortcuts[key].items[idx].url = e.target.value;
          saveShortcuts(shortcuts);
        });

        const delBtn = document.createElement("button");
        delBtn.className = "del-btn";
        delBtn.textContent = "×";
        delBtn.addEventListener("click", () => {
          shortcuts[key].items.splice(idx, 1);
          saveShortcuts(shortcuts);
          render();
        });

        li.appendChild(nameInput);
        li.appendChild(urlInput);
        li.appendChild(delBtn);
      }

      ul.appendChild(li);
    });

    if (editMode) {
      const addLi = document.createElement("li");
      addLi.className = "add-row";
      const addBtn = document.createElement("button");
      addBtn.className = "add-btn";
      addBtn.textContent = "+ add";
      addBtn.addEventListener("click", () => {
        shortcuts[key].items.push({ name: "New", url: "https://" });
        saveShortcuts(shortcuts);
        render();
      });
      addLi.appendChild(addBtn);
      ul.appendChild(addLi);
    }

    wrap.appendChild(ul);
    container.appendChild(wrap);
  }
}

function toggleEditMode() {
  editMode = !editMode;
  document.body.classList.toggle("edit-mode", editMode);
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  render();

  const editToggle = document.getElementById("edit-toggle");
  if (editToggle) {
    editToggle.addEventListener("click", toggleEditMode);
  }
});