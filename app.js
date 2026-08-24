(() => {
  "use strict";

  const config = window.POOL_CONFIG || {};
  const totalSpots = Number(config.totalSpots) || 25;
  const refreshMs = Math.max(5, Number(config.refreshSeconds) || 10) * 1000;

  const elements = {
    title: document.getElementById("pool-title"),
    subtitle: document.getElementById("pool-subtitle"),
    openCount: document.getElementById("open-count"),
    claimedCount: document.getElementById("claimed-count"),
    grid: document.getElementById("spots-grid"),
    status: document.getElementById("status-message"),
    lastUpdated: document.getElementById("last-updated"),
    refresh: document.getElementById("refresh-button"),
    dialog: document.getElementById("signup-dialog"),
    form: document.getElementById("signup-form"),
    closeDialog: document.getElementById("close-dialog"),
    selectedSpot: document.getElementById("selected-spot"),
    selectedSpotLabel: document.getElementById("selected-spot-label"),
    participantName: document.getElementById("participant-name"),
    formError: document.getElementById("form-error"),
    submitButton: document.getElementById("submit-button")
  };

  elements.title.textContent = config.title || "Office Pool Signup";
  elements.subtitle.textContent = config.subtitle || "Choose an open spot and enter your name.";
  document.title = config.title || "Office Pool Signup";

  const configMissing =
    !config.supabaseUrl ||
    !config.supabaseKey ||
    String(config.supabaseUrl).includes("PASTE_YOUR_") ||
    String(config.supabaseKey).includes("PASTE_YOUR_");

  let client = null;
  if (!configMissing && window.supabase?.createClient) {
    client = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
  }

  const setStatus = (message = "", isError = false) => {
    elements.status.textContent = message;
    elements.status.classList.toggle("error", isError);
  };

  const formatTime = (date) =>
    new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);

  const renderSpots = (signups) => {
    const claimed = new Map(signups.map((row) => [Number(row.spot), row.name]));
    const fragment = document.createDocumentFragment();

    for (let spot = 1; spot <= totalSpots; spot += 1) {
      const name = claimed.get(spot);
      const button = document.createElement("button");
      button.type = "button";
      button.className = `spot ${name ? "claimed" : "available"}`;
      button.disabled = Boolean(name);
      button.dataset.spot = String(spot);

      const number = document.createElement("span");
      number.className = "spot-number";
      number.textContent = `Spot ${spot}`;

      const label = document.createElement("span");
      label.className = "spot-name";
      label.textContent = name || "Available";

      button.append(number, label);
      if (!name) {
        button.setAttribute("aria-label", `Claim spot ${spot}`);
        button.addEventListener("click", () => openSignup(spot));
      }
      fragment.appendChild(button);
    }

    elements.grid.replaceChildren(fragment);
    elements.claimedCount.textContent = String(claimed.size);
    elements.openCount.textContent = String(Math.max(0, totalSpots - claimed.size));
  };

  const loadSignups = async ({ quiet = false } = {}) => {
    if (configMissing || !client) {
      renderSpots([]);
      setStatus("Setup needed: add your Supabase URL and publishable/anon key to config.js.", true);
      return;
    }

    if (!quiet) setStatus("Refreshing...");

    const { data, error } = await client
      .from("office_pool_signups")
      .select("spot,name,signed_up_at")
      .order("spot", { ascending: true });

    if (error) {
      console.error(error);
      setStatus("Could not load the signup sheet. Check the Supabase setup and try again.", true);
      return;
    }

    renderSpots(data || []);
    if (data?.length >= totalSpots) {
      setStatus("All spots have been claimed.");
    } else if (!quiet) {
      setStatus("");
    }
    elements.lastUpdated.textContent = `Updated ${formatTime(new Date())}`;
  };

  const openSignup = (spot) => {
    elements.selectedSpot.value = String(spot);
    elements.selectedSpotLabel.textContent = String(spot);
    elements.participantName.value = "";
    elements.formError.textContent = "";
    elements.dialog.showModal();
    requestAnimationFrame(() => elements.participantName.focus());
  };

  const closeSignup = () => {
    if (elements.dialog.open) elements.dialog.close();
  };

  elements.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    elements.formError.textContent = "";

    if (!client) {
      elements.formError.textContent = "The signup database is not configured yet.";
      return;
    }

    const spot = Number(elements.selectedSpot.value);
    const name = elements.participantName.value.trim().replace(/\s+/g, " ");

    if (!Number.isInteger(spot) || spot < 1 || spot > totalSpots) {
      elements.formError.textContent = "Invalid spot number.";
      return;
    }
    if (!name) {
      elements.formError.textContent = "Enter your name.";
      return;
    }

    elements.submitButton.disabled = true;
    elements.submitButton.textContent = "Claiming...";

    const { error } = await client
      .from("office_pool_signups")
      .insert({ spot, name });

    elements.submitButton.disabled = false;
    elements.submitButton.textContent = "Claim this spot";

    if (error) {
      console.error(error);
      if (error.code === "23505") {
        elements.formError.textContent = "Someone else just claimed this spot. Pick another open spot.";
        await loadSignups({ quiet: true });
      } else {
        elements.formError.textContent = "Could not save your signup. Please try again.";
      }
      return;
    }

    closeSignup();
    await loadSignups({ quiet: true });
    setStatus(`Spot ${spot} has been claimed for ${name}.`);
  });

  elements.closeDialog.addEventListener("click", closeSignup);
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) closeSignup();
  });
  elements.refresh.addEventListener("click", () => loadSignups());

  renderSpots([]);
  loadSignups();
  window.setInterval(() => loadSignups({ quiet: true }), refreshMs);
})();
