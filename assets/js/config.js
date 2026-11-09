/*
 * Crème et Crema — site settings
 * ------------------------------------------------------------
 * This is the only file you need to edit for contact details,
 * the quote form and prices. Leave a value as "" or null to hide it.
 */
window.SITE_CONFIG = {
  businessName: "Crème et Crema",

  // Contact — shown in the footer and contact section when filled in.
  email: "",            // e.g. "bonjour@cremeetcrema.ca"
  phone: "",            // e.g. "514-555-0123"
  instagram: "",        // handle without @, e.g. "cremeetcrema"

  // Quote form delivery.
  // 1) Best: create a free form at https://formspree.io and paste its URL here,
  //    e.g. "https://formspree.io/f/abcdwxyz". Requests land in your inbox.
  // 2) If this is empty but `email` is set, the form opens the visitor's
  //    email app with everything pre-filled.
  formEndpoint: "",

  // Minimum booking. This file is public, so the numbers stay empty while the
  // minimum is private. To show it on the site, fill both in and set showMinimums: true.
  showMinimums: false,
  minGuests: null,
  minHours: null,

  // Calendar on the quote form.
  minNoticeDays: 2,        // earliest bookable date = today + this many days
  maxMonthsAhead: 18,      // how far ahead people can pick
  unavailableDates: [      // dates you're already booked or off, "YYYY-MM-DD"
    // "2026-12-24", "2026-12-25"
  ],
  timeSlots: { start: "07:00", end: "21:00", stepMinutes: 30 },
  durationOptions: [2, 3, 4, 5, 6, 8], // hours shown as buttons

  // Prices. Leave null to show "Sur soumission / On quote".
  // When set, packages show "À partir de / From $X" and the form shows an estimate.
  pricing: {
    currency: "CAD",
    packages: {
      coffee: null,   // starting price shown as "From $X"
      matcha: null,
      both: null
    },
    perExtraGuest: null,   // added per guest above minGuests
    perExtraHour: null,    // added per hour above minHours
    secondBaristaFrom: 76, // guest count where a 2nd barista is added
    secondBarista: null,   // price of the 2nd barista
    travel: {
      zone1: null,  // Island of Montreal
      zone2: null,  // Rest of Greater Montreal
      perKmOutside: null // outside the GMA, per km round trip
    }
  },

  // Photos. Add files to assets/img/gallery/ and list them here.
  // The gallery section stays hidden while this list is empty.
  gallery: [
    // { src: "assets/img/gallery/cart.jpg", alt: { fr: "Notre chariot", en: "Our cart" } }
  ]
};
