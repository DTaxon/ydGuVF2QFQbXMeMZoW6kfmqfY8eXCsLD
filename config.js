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

  allowDuplicateNames: false,

  // Keep your existing Supabase values here.
  supabaseUrl: "https://wsluhvnzyejzazecxjhe.supabase.co/",
  supabaseKey: "sb_publishable_dGCOYIAu3bHaV_8MxPIjVg_9Auuipbh",

  text: {
    pageTitle: "2026 Packer Football Pool Sign Up",
    metaDescription: "Signup sheet for the 2026 Packer Football Pool.",

    intro: "Choose an open square and enter your name. Please only claim 1 square at this time. Open squares will be offered for doubles as the start of the season approaches.",

    openCountLabel: "squares open",
    claimedCountLabel: "claimed",
    duplicateNameError: "That name already has a square. Please only claim one square at this time.",
    duplicateCheckError: "Could not verify whether this name is already signed up. Please try again.",

    spotsHeading: "Choose a Square!\n$34 per square payable to Drake via Venmo, Paypal, or cold hard cash",
    spotsHelp: "Green squares are available. Claimed squares show the participant's name.",
    refreshButton: "Refresh",
    spotWord: "Square",
    availableLabel: "Available",

    footerText: "First come, first served.",
    updatedPrefix: "Updated",

    claimDialogTitle: "Square {spot}",
    claimDialogCopy: "Enter your name exactly as you want it displayed on the signup sheet.",
    nameLabel: "Name",
    closeButtonLabel: "Close",
    claimButton: "Claim this square",
    claimingButton: "Claiming...",

    adminButton: "Admin",
    adminModeLabel: "Admin mode",
    adminExitButton: "Exit Admin",
    adminLoginTitle: "Admin Access",
    adminLoginCopy: "Enter the admin password to change or remove existing signups.",
    adminPasswordLabel: "Password",
    adminUnlockButton: "Unlock Admin",
    adminInvalidPassword: "Incorrect admin password.",

    adminEditTitle: "Manage Square {spot}",
    adminEditCopy: "Change the participant name or remove this signup.",
    adminSaveButton: "Save Name",
    adminSavingButton: "Saving...",
    adminRemoveButton: "Remove Square",
    adminRemovingButton: "Removing...",
    adminRemoveConfirm: "Remove {name} from Square {spot}? This will make the square available again.",

    setupNeeded: "Setup needed: add your Supabase URL and publishable/anon key to config.js.",
    refreshing: "Refreshing...",
    loadError: "Could not load the signup sheet. Check the Supabase setup and try again.",
    allClaimed: "All squares have been claimed.",
    invalidSpot: "Invalid square number.",
    enterName: "Enter your name.",
    databaseNotConfigured: "The signup database is not configured yet.",
    spotJustClaimed: "Someone else just claimed this square. Pick another open square.",
    signupSaveError: "Could not save your signup. Please try again.",
    signupSuccess: "Square {spot} has been claimed for {name}.",
    adminSaveError: "Could not update the name. Please try again.",
    adminSaveSuccess: "Square {spot} has been updated to {name}.",
    adminRemoveError: "Could not remove the signup. Please try again.",
    adminRemoveSuccess: "Square {spot} is available again.",
    adminModeEnabled: "Admin mode enabled. Select a claimed square to change or remove it.",
    adminModeDisabled: "Admin mode disabled."
  }
};
