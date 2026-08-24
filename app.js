(() => {
  "use strict";

  const config = window.POOL_CONFIG || {};
  const text = config.text || {};
  const totalSpots = Number(config.totalSpots) || 25;
  const refreshMs = Math.max(5, Number(config.refreshSeconds) || 10) * 1000;
  const allowDuplicateNames = config.allowDuplicateNames === true;

  const fill = (template, values = {}) =>
    String(template || "").replace(/\{(\w+)\}/g, (_, key) =>
      Object.prototype.hasOwnProperty.call(values, key) ? values[key] : `{${key}}`
    );

  const elements = {
    metaDescription: document.getElementById("meta-description"),
    title: document.getElementById("pool-title"),
    intro: document.getElementById("pool-intro"),
    openCount: document.getElementById("open-count"),
    openCountLabel: document.getElementById("open-count-label"),
    claimedCount: document.getElementById("claimed-count"),
    claimedCountLabel: document.getElementById("claimed-count-label"),
    spotsHeading: document.getElementById("spots-heading"),
    spotsHelp: document.getElementById("spots-help"),
    grid: document.getElementById("spots-grid"),
    status: document.getElementById("status-message"),
    lastUpdated: document.getElementById("last-updated"),
    footerText: document.getElementById("footer-text"),
    refresh: document.getElementById("refresh-button"),
    adminButton: document.getElementById("admin-button"),
    adminBadge: document.getElementById("admin-badge"),

    signupDialog: document.getElementById("signup-dialog"),
    signupForm: document.getElementById("signup-form"),
    claimDialogTitle: document.getElementById("claim-dialog-title"),
    claimDialogCopy: document.getElementById("claim-dialog-copy"),
    claimNameLabel: document.getElementById("claim-name-label"),
    selectedSpot: document.getElementById("selected-spot"),
    participantName: document.getElementById("participant-name"),
    formError: document.getElementById("form-error"),
    submitButton: document.getElementById("submit-button"),

    adminLoginDialog: document.getElementById("admin-login-dialog"),
    adminLoginForm: document.getElementById("admin-login-form"),
    adminLoginTitle: document.getElementById("admin-login-title"),
    adminLoginCopy: document.getElementById("admin-login-copy"),
    adminPasswordLabel: document.getElementById("admin-password-label"),
    adminPassword: document.getElementById("admin-password"),
    adminLoginError: document.getElementById("admin-login-error"),
    adminUnlockButton: document.getElementById("admin-unlock-button"),

    adminEditDialog: document.getElementById("admin-edit-dialog"),
    adminEditForm: document.getElementById("admin-edit-form"),
    adminEditTitle: document.getElementById("admin-edit-title"),
    adminEditCopy: document.getElementById("admin-edit-copy"),
    adminNameLabel: document.getElementById("admin-name-label"),
    adminParticipantName: document.getElementById("admin-participant-name"),
    adminSelectedSpot: document.getElementById("admin-selected-spot"),
    adminEditError: document.getElementById("admin-edit-error"),
    adminSaveButton: document.getElementById("admin-save-button"),
    adminRemoveButton: document.getElementById("admin-remove-button")
  };

  const applyText = () => {
    document.title = text.pageTitle || "";
    elements.metaDescription.content = text.metaDescription || "";
    elements.title.textContent = text.pageTitle || "";
    elements.intro.textContent = text.intro || "";
    elements.openCountLabel.textContent = text.openCountLabel || "";
    elements.claimedCountLabel.textContent = text.claimedCountLabel || "";
    elements.spotsHeading.textContent = text.spotsHeading || "";
    elements.spotsHelp.textContent = text.spotsHelp || "";
    elements.refresh.textContent = text.refreshButton || "";
    elements.adminButton.textContent = text.adminButton || "";
    elements.footerText.textContent = text.footerText || "";

    document.querySelectorAll(".dialog-close").forEach((button) => {
      button.setAttribute("aria-label", text.closeButtonLabel || "");
    });

    elements.claimDialogCopy.textContent = text.claimDialogCopy || "";
    elements.claimNameLabel.textContent = text.nameLabel || "";
    elements.submitButton.textContent = text.claimButton || "";

    elements.adminLoginTitle.textContent = text.adminLoginTitle || "";
    elements.adminLoginCopy.textContent = text.adminLoginCopy || "";
    elements.adminPasswordLabel.textContent = text.adminPasswordLabel || "";
    elements.adminUnlockButton.textContent = text.adminUnlockButton || "";

    elements.adminEditCopy.textContent = text.adminEditCopy || "";
    elements.adminNameLabel.textContent = text.nameLabel || "";
    elements.adminSaveButton.textContent = text.adminSaveButton || "";
    elements.adminRemoveButton.textContent = text.adminRemoveButton || "";
  };

  applyText();

  const configMissing =
    !config.supabaseUrl ||
    !config.supabaseKey ||
    String(config.supabaseUrl).includes("PASTE_YOUR_") ||
    String(config.supabaseKey).includes("PASTE_YOUR_");

  let client = null;

  if (!configMissing && window.supabase?.createClient) {
    client = window.supabase.createClient(
      config.supabaseUrl,
      config.supabaseKey
    );
  }

  let isAdmin = false;
  let currentSignups = [];

  const normalizeName = (value) =>
    String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase();

  const duplicateNameExists = async (name, excludeSpot = null) => {
    if (allowDuplicateNames) {
      return false;
    }

    const { data, error } = await client
      .from("office_pool_signups")
      .select("spot,name");

    if (error) {
      throw error;
    }

    const normalizedName = normalizeName(name);

    return (data || []).some((row) => {
      if (
        excludeSpot !== null &&
        Number(row.spot) === Number(excludeSpot)
      ) {
        return false;
      }

      return normalizeName(row.name) === normalizedName;
    });
  };

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

  const updateAdminUI = () => {
    elements.adminBadge.hidden = !isAdmin;
    elements.adminBadge.textContent =
      isAdmin ? text.adminModeLabel || "" : "";

    elements.adminButton.textContent = isAdmin
      ? text.adminExitButton || ""
      : text.adminButton || "";
  };

  const renderSpots = (signups) => {
    currentSignups = signups || [];

    const claimed = new Map(
      currentSignups.map((row) => [
        Number(row.spot),
        row.name
      ])
    );

    const fragment = document.createDocumentFragment();

    for (let spot = 1; spot <= totalSpots; spot += 1) {
      const name = claimed.get(spot);

      const button = document.createElement("button");
      button.type = "button";
      button.className =
        `spot ${name ? "claimed" : "available"}` +
        `${name && isAdmin ? " admin-editable" : ""}`;

      button.dataset.spot = String(spot);

      const number = document.createElement("span");
      number.className = "spot-number";
      number.textContent =
        `${text.spotWord || ""} ${spot}`.trim();

      const label = document.createElement("span");
      label.className = "spot-name";
      label.textContent =
        name || text.availableLabel || "";

      button.append(number, label);

      if (!name) {
        button.addEventListener("click", () => {
          openSignup(spot);
        });
      } else if (isAdmin) {
        button.addEventListener("click", () => {
          openAdminEdit(spot, name);
        });
      } else {
        button.disabled = true;
      }

      fragment.appendChild(button);
    }

    elements.grid.replaceChildren(fragment);

    elements.claimedCount.textContent =
      String(claimed.size);

    elements.openCount.textContent =
      String(Math.max(0, totalSpots - claimed.size));
  };

  const loadSignups = async ({ quiet = false } = {}) => {
    if (configMissing || !client) {
      renderSpots([]);
      setStatus(text.setupNeeded || "", true);
      return;
    }

    if (!quiet) {
      setStatus(text.refreshing || "");
    }

    const { data, error } = await client
      .from("office_pool_signups")
      .select("spot,name,signed_up_at")
      .order("spot", { ascending: true });

    if (error) {
      console.error(error);
      setStatus(text.loadError || "", true);
      return;
    }

    renderSpots(data || []);

    if (data?.length >= totalSpots) {
      setStatus(text.allClaimed || "");
    } else if (!quiet) {
      setStatus("");
    }

    elements.lastUpdated.textContent =
      `${text.updatedPrefix || ""} ${formatTime(new Date())}`.trim();
  };

  const closeDialog = (dialog) => {
    if (dialog?.open) {
      dialog.close();
    }
  };

  const openSignup = (spot) => {
    elements.selectedSpot.value = String(spot);

    elements.claimDialogTitle.textContent =
      fill(text.claimDialogTitle, { spot });

    elements.participantName.value = "";
    elements.formError.textContent = "";

    elements.signupDialog.showModal();

    requestAnimationFrame(() => {
      elements.participantName.focus();
    });
  };

  const openAdminLogin = () => {
    elements.adminPassword.value = "";
    elements.adminLoginError.textContent = "";

    elements.adminLoginDialog.showModal();

    requestAnimationFrame(() => {
      elements.adminPassword.focus();
    });
  };

  const openAdminEdit = (spot, name) => {
    elements.adminSelectedSpot.value = String(spot);
    elements.adminParticipantName.value = name;

    elements.adminEditTitle.textContent =
      fill(text.adminEditTitle, { spot });

    elements.adminEditError.textContent = "";

    elements.adminEditDialog.showModal();

    requestAnimationFrame(() => {
      elements.adminParticipantName.focus();
    });
  };

  elements.signupForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      elements.formError.textContent = "";

      if (!client) {
        elements.formError.textContent =
          text.databaseNotConfigured || "";
        return;
      }

      const spot =
        Number(elements.selectedSpot.value);

      const name =
        elements.participantName.value
          .trim()
          .replace(/\s+/g, " ");

      if (
        !Number.isInteger(spot) ||
        spot < 1 ||
        spot > totalSpots
      ) {
        elements.formError.textContent =
          text.invalidSpot || "";
        return;
      }

      if (!name) {
        elements.formError.textContent =
          text.enterName || "";
        return;
      }

      if (!allowDuplicateNames) {
        try {
          const duplicate =
            await duplicateNameExists(name);

          if (duplicate) {
            elements.formError.textContent =
              text.duplicateNameError ||
              "That name already has a square.";

            return;
          }
        } catch (error) {
          console.error(error);

          elements.formError.textContent =
            text.duplicateCheckError ||
            "Could not verify whether this name is already signed up. Please try again.";

          return;
        }
      }

      elements.submitButton.disabled = true;
      elements.submitButton.textContent =
        text.claimingButton || "";

      const { error } = await client
        .from("office_pool_signups")
        .insert({
          spot,
          name
        });

      elements.submitButton.disabled = false;
      elements.submitButton.textContent =
        text.claimButton || "";

      if (error) {
        console.error(error);

        if (error.code === "23505") {
          elements.formError.textContent =
            text.spotJustClaimed || "";

          await loadSignups({
            quiet: true
          });
        } else {
          elements.formError.textContent =
            text.signupSaveError || "";
        }

        return;
      }

      closeDialog(elements.signupDialog);

      await loadSignups({
        quiet: true
      });

      setStatus(
        fill(text.signupSuccess, {
          spot,
          name
        })
      );
    }
  );

  elements.adminButton.addEventListener(
    "click",
    () => {
      if (isAdmin) {
        isAdmin = false;

        updateAdminUI();
        renderSpots(currentSignups);

        setStatus(
          text.adminModeDisabled || ""
        );
      } else {
        openAdminLogin();
      }
    }
  );

  elements.adminLoginForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      elements.adminLoginError.textContent = "";

      if (
        elements.adminPassword.value !==
        String(config.adminPassword || "")
      ) {
        elements.adminLoginError.textContent =
          text.adminInvalidPassword || "";

        return;
      }

      isAdmin = true;

      closeDialog(elements.adminLoginDialog);

      updateAdminUI();
      renderSpots(currentSignups);

      setStatus(
        text.adminModeEnabled || ""
      );
    }
  );

  elements.adminEditForm.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      elements.adminEditError.textContent = "";

      if (!isAdmin || !client) {
        return;
      }

      const spot =
        Number(elements.adminSelectedSpot.value);

      const name =
        elements.adminParticipantName.value
          .trim()
          .replace(/\s+/g, " ");

      if (!name) {
        elements.adminEditError.textContent =
          text.enterName || "";

        return;
      }

      if (!allowDuplicateNames) {
        try {
          const duplicate =
            await duplicateNameExists(
              name,
              spot
            );

          if (duplicate) {
            elements.adminEditError.textContent =
              text.duplicateNameError ||
              "That name already has a square.";

            return;
          }
        } catch (error) {
          console.error(error);

          elements.adminEditError.textContent =
            text.duplicateCheckError ||
            "Could not verify whether this name is already signed up. Please try again.";

          return;
        }
      }

      elements.adminSaveButton.disabled = true;
      elements.adminSaveButton.textContent =
        text.adminSavingButton || "";

      const { error } = await client
        .from("office_pool_signups")
        .update({
          name
        })
        .eq("spot", spot);

      elements.adminSaveButton.disabled = false;
      elements.adminSaveButton.textContent =
        text.adminSaveButton || "";

      if (error) {
        console.error(error);

        elements.adminEditError.textContent =
          text.adminSaveError || "";

        return;
      }

      closeDialog(elements.adminEditDialog);

      await loadSignups({
        quiet: true
      });

      setStatus(
        fill(text.adminSaveSuccess, {
          spot,
          name
        })
      );
    }
  );

  elements.adminRemoveButton.addEventListener(
    "click",
    async () => {
      elements.adminEditError.textContent = "";

      if (!isAdmin || !client) {
        return;
      }

      const spot =
        Number(elements.adminSelectedSpot.value);

      const row =
        currentSignups.find(
          (signup) =>
            Number(signup.spot) === spot
        );

      const name =
        row?.name ||
        elements.adminParticipantName.value.trim();

      const confirmed =
        window.confirm(
          fill(text.adminRemoveConfirm, {
            spot,
            name
          })
        );

      if (!confirmed) {
        return;
      }

      elements.adminRemoveButton.disabled = true;
      elements.adminRemoveButton.textContent =
        text.adminRemovingButton || "";

      const { error } = await client
        .from("office_pool_signups")
        .delete()
        .eq("spot", spot);

      elements.adminRemoveButton.disabled = false;
      elements.adminRemoveButton.textContent =
        text.adminRemoveButton || "";

      if (error) {
        console.error(error);

        elements.adminEditError.textContent =
          text.adminRemoveError || "";

        return;
      }

      closeDialog(elements.adminEditDialog);

      await loadSignups({
        quiet: true
      });

      setStatus(
        fill(text.adminRemoveSuccess, {
          spot
        })
      );
    }
  );

  document
    .querySelectorAll(".dialog-close")
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          closeDialog(
            button.closest("dialog")
          );
        }
      );
    });

  [
    elements.signupDialog,
    elements.adminLoginDialog,
    elements.adminEditDialog
  ].forEach((dialog) => {
    dialog.addEventListener(
      "click",
      (event) => {
        if (event.target === dialog) {
          closeDialog(dialog);
        }
      }
    );
  });

  elements.refresh.addEventListener(
    "click",
    () => {
      loadSignups();
    }
  );

  updateAdminUI();
  renderSpots([]);
  loadSignups();

  window.setInterval(
    () => loadSignups({ quiet: true }),
    refreshMs
  );
})();
