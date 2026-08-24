// ============================================================
// 2026 PACKER FOOTBALL POOL - SITE CONFIGURATION
// ============================================================
// Edit this file for normal site changes.
// All user-facing titles, instructions, labels, buttons, and
// status messages are defined here.
//
// IMPORTANT ABOUT adminPassword:
// This site is hosted on GitHub Pages, so config.js is public.
// The password below is only a convenience gate for a small
// office pool. It is NOT suitable for protecting sensitive data.
//
// NEVER put a Supabase service_role/secret key in this file.
// Use only the browser-safe Publishable/anon key.

window.POOL_CONFIG = {
  totalSpots: 25,
  refreshSeconds: 10,

  // Change this to whatever password you want admins to enter.
  adminPassword: "football2026",

  // Keep your existing Supabase values here.
  supabaseUrl: "https://wsluhvnzyejzazecxjhe.supabase.co/",
  supabaseKey: "sb_publishable_dGCOYIAu3bHaV_8MxPIjVg_9Auuipbh",

  text: {
    pageTitle: "2026 Packer Football Pool",
    metaDescription: "Signup sheet for the 2026 Packer Football Pool.",

    intro: "Choose an open square and enter your name. Please only claim 1 spot at this time. Open spots will be offered for doubles as the start of the season approaches.",

    openCountLabel: "spots open",
    claimedCountLabel: "claimed",

    spotsHeading: "Choose a square!\n($34 per square payable to Drake via Venmo, Paypal, or cold hard cash.)",
    spotsHelp: "Green spots are available. Claimed spots show the participant's name.",
    refreshButton: "Refresh",
    spotWord: "Spot",
    availableLabel: "Available",

    footerText: "First come, first served.",
    updatedPrefix: "Updated",

    claimDialogTitle: "Spot {spot}",
    claimDialogCopy: "Enter your name exactly as you want it displayed on the signup sheet.",
    nameLabel: "Name",
    closeButtonLabel: "Close",
    claimButton: "Claim this spot",
    claimingButton: "Claiming...",

    adminButton: "Admin",
    adminModeLabel: "Admin mode",
    adminExitButton: "Exit Admin",
    adminLoginTitle: "Admin Access",
    adminLoginCopy: "Enter the admin password to change or remove existing signups.",
    adminPasswordLabel: "Password",
    adminUnlockButton: "Unlock Admin",
    adminInvalidPassword: "Incorrect admin password.",

    adminEditTitle: "Manage Spot {spot}",
    adminEditCopy: "Change the participant name or remove this signup.",
    adminSaveButton: "Save Name",
    adminSavingButton: "Saving...",
    adminRemoveButton: "Remove Spot",
    adminRemovingButton: "Removing...",
    adminRemoveConfirm: "Remove {name} from Spot {spot}? This will make the spot available again.",

    setupNeeded: "Setup needed: add your Supabase URL and publishable/anon key to config.js.",
    refreshing: "Refreshing...",
    loadError: "Could not load the signup sheet. Check the Supabase setup and try again.",
    allClaimed: "All spots have been claimed.",
    invalidSpot: "Invalid spot number.",
    enterName: "Enter your name.",
    databaseNotConfigured: "The signup database is not configured yet.",
    spotJustClaimed: "Someone else just claimed this spot. Pick another open spot.",
    signupSaveError: "Could not save your signup. Please try again.",
    signupSuccess: "Spot {spot} has been claimed for {name}.",
    adminSaveError: "Could not update the name. Please try again.",
    adminSaveSuccess: "Spot {spot} has been updated to {name}.",
    adminRemoveError: "Could not remove the signup. Please try again.",
    adminRemoveSuccess: "Spot {spot} is available again.",
    adminModeEnabled: "Admin mode enabled. Select a claimed spot to change or remove it.",
    adminModeDisabled: "Admin mode disabled."
  }
};
