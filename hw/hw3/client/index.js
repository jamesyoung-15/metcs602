const apiUrl = "http://localhost:3039";

const addForm = document.getElementById("add-contact-form");
const updateForm = document.getElementById("update-contact-form");
const contactsUl = document.getElementById("contacts");
const updateSelect = document.getElementById("update-id");

// fetches contacts from server, outputs to ul, updates select to show new contact ids
async function loadContacts() {
  try {
    const res = await fetch(`${apiUrl}/contacts`);
    if (!res.ok) throw new Error(`Failed to load (${res.status})`);
    const contacts = await res.json();
    renderContacts(Array.isArray(contacts) ? contacts : []);
    populateUpdateSelect(Array.isArray(contacts) ? contacts : []);
  } catch (err) {
    console.error("Load contacts error:", err);
  }
}

// outputs contacts to ul
function renderContacts(contacts) {
  contactsUl.innerHTML = "";
  if (!contacts.length) {
    const li = document.createElement("li");
    li.textContent = "No contacts";
    contactsUl.appendChild(li);
    return;
  }

  for (const contact of contacts) {
    const id = contact.id;
    const li = document.createElement("li");
    li.dataset.id = id;
    li.innerHTML = `
      <div class="info">
        <strong>Name: ${contact.name ?? ""}</strong>
        <div>Contact: ${contact.contactPoint ?? ""}</div>
        <div><small>Notes: ${contact.notes ?? ""}</small></div>
        <div><small>Reminder: ${((contact.reminderDate ?? "") + " " + (contact.reminderTime ?? "")).trim()}</small></div>
      </div>
      <div class="actions">
        <button class="delete" data-id="${id}">Delete</button>
      </div>
    `;
    contactsUl.appendChild(li);
  }
}

// populates the update select with contact ids
function populateUpdateSelect(contacts) {
  updateSelect.innerHTML = `<option value="" disabled selected>Select contact to update</option>`;
  for (const contact of contacts) {
    const id = contact.id;
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = contact.name || `ID ${id}`;
    updateSelect.appendChild(opt);
  }
}

// Add contact
addForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = addForm.elements;
  const payload = {
    name: f["name"].value,
    contactPoint: f["contactPoint"].value,
    notes: f["notes"].value,
    reminderDate: f["reminderDate"].value,
    reminderTime: f["reminderTime"].value,
  };
  try {
    const res = await fetch(`${apiUrl}/contacts`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) {
      alert(`Create failed: ${text}`);
      return;
    }
    // success
    addForm.reset();
    await loadContacts();
  } catch (err) {
    alert(`Create error: ${err}`);
  }
});

// Update form: populate fields when select changes
updateSelect?.addEventListener("change", async () => {
  const id = updateSelect.value;
  if (!id) return;
  try {
    const res = await fetch(`${apiUrl}/contacts`);
    const contacts = await res.json();
    const contact = (contacts || []).find(c => (c.id + "") === (id + ""));
    if (!contact) return;
    // fill fields
    updateForm.querySelector("#update-name").value = contact.name ?? "";
    updateForm.querySelector("#update-contactPoint").value = contact.contactPoint ?? "";
    updateForm.querySelector("#update-notes").value = contact.notes ?? "";
    updateForm.querySelector("#update-reminderDate").value = contact.reminderDate ?? "";
    updateForm.querySelector("#update-reminderTime").value = contact.reminderTime ?? "";
  } catch (err) {
    console.error("Populate update form error:", err);
  }
});

// Update submit
updateForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = updateSelect.value;
  if (!id) { alert("Select a contact to update"); return; }
  const f = updateForm.elements;
  const payload = {
    name: f["update-name"].value,
    contactPoint: f["update-contactPoint"].value,
    notes: f["update-notes"].value,
    reminderDate: f["update-reminderDate"].value,
    reminderTime: f["update-reminderTime"].value,
  };
  try {
    const res = await fetch(`${apiUrl}/contacts/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) {
      alert(`Update failed: ${text}`);
      return;
    }
    updateForm.reset();
    updateSelect.selectedIndex = 0;
    await loadContacts();
  } catch (err) {
    alert(`Update error: ${err}`);
  }
});

// Delegated click for delete from the UL
contactsUl.addEventListener("click", async (e) => {
  const target = e.target;
  if (target.classList.contains("delete")) {
    const id = target.dataset.id;
    if (!confirm("Delete this contact?")) return;
    try {
      const res = await fetch(`${apiUrl}/contacts/${encodeURIComponent(id)}`, { method: "DELETE" });
      // handle 204 or body
      if (res.status === 204 || res.ok) {
        await loadContacts();
      } else {
        const text = await res.text();
        alert(`Delete failed: ${text}`);
      }
    } catch (err) {
      alert(`Delete error: ${err}`);
    }
  }
});

// initial load
loadContacts();