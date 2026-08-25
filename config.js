// EDIT THIS FILE to customize the pool.
// Keep your Supabase Project URL and browser-safe Publishable/anon key here.
// NEVER put a service_role key in this file.
window.POOL_CONFIG = {
  totalSpots: 25,
  refreshSeconds: 10,
  allowDuplicateNames: false,

  // Convenience-only admin gate. Because this site is hosted on GitHub Pages,
  // this value can be viewed by someone inspecting the site's source.
  adminPassword: "football2026",

  // Branding image. You can use either:
  //   brandImageUrl: "packers-logo.png",  // image uploaded to this repo
  // or a full https:// image URL.
  // Leave blank to hide the image completely.
  brandImageUrl: "",
  brandImageAlt: "PackerLogo.png",

  supabaseUrl: "https://wsluhvnzyejzazecxjhe.supabase.co/",
  supabaseKey: "sb_publishable_dGCOYIAu3bHaV_8MxPIjVg_9Auuipbh",

  text: {
    pageTitle: "2026 Packer Football Pool",
    metaDescription: "Signup sheet for the 2026 Packer Football Pool.",
    intro: "Choose an open spot and enter your name. Please only claim 1 spot at this time. Open spots will be offered for doubles as the start of the season approaches.",

    openCountLabel: "Open",
    claimedCountLabel: "Claimed",

    spotsHeading: "Choose a square!\n($34 per square payable to Drake via Venmo, Paypal, or cold hard cash.)",
    spotsHelp: "Green squares are available. Claimed squares show the participant's name.",
    spotWord: "Square",
    availableLabel: "Available",

    refreshButton: "Refresh",
    footerText: "2026 Packer Football Pool",
    updatedPrefix: "Updated",
    refreshing: "Refreshing...",
    allClaimed: "All squares have been claimed.",
    setupNeeded: "Setup needed: add your Supabase URL and publishable/anon key to config.js.",
    loadError: "Could not load the signup sheet. Check the Supabase setup and try again.",

    claimDialogTitle: "Claim square {spot}",
    claimDialogCopy: "Enter your name to claim this square.",
    nameLabel: "Name",
    claimButton: "Claim this square",
    claimingButton: "Claiming...",
    closeButtonLabel: "Close",
    databaseNotConfigured: "The signup database is not configured yet.",
    invalidSpot: "Invalid square number.",
    enterName: "Enter your name.",
    spotJustClaimed: "Someone else just claimed this square. Pick another open square.",
    signupSaveError: "Could not save your signup. Please try again.",
    signupSuccess: "Square {spot} has been claimed for {name}.",

    duplicateNameError: "That name already has a square. Please only claim one square at this time.",
    duplicateCheckError: "Could not verify whether this name is already signed up. Please try again.",

    adminButton: "Admin",
    adminExitButton: "Exit Admin",
    adminModeLabel: "ADMIN MODE",
    adminLoginTitle: "Admin access",
    adminLoginCopy: "Enter the admin password to change or remove signups.",
    adminPasswordLabel: "Password",
    adminUnlockButton: "Unlock Admin",
    adminInvalidPassword: "Incorrect password.",
    adminModeEnabled: "Admin mode enabled. Click a claimed square to edit it.",
    adminModeDisabled: "Admin mode disabled.",

    adminEditTitle: "Edit square {spot}",
    adminEditCopy: "Change the participant name or reopen this square.",
    adminSaveButton: "Save Name",
    adminSavingButton: "Saving...",
    adminSaveError: "Could not update this signup. Please try again.",
    adminSaveSuccess: "Square {spot} has been updated to {name}.",
    adminRemoveButton: "Remove Signup",
    adminRemovingButton: "Removing...",
    adminRemoveConfirm: "Remove {name} from square {spot}? This will reopen the square.",
    adminRemoveError: "Could not remove this signup. Please try again.",
    adminRemoveSuccess: "Square {spot} is open again."
  }
};
