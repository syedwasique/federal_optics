/* Opening times shown across the site. The shop and the eye clinic keep different hours. */

export const SHOP_HOURS = {
  weekdays: 'Monday – Saturday: 11:00 AM – 9:30 PM',
  short: 'Mon – Sat: 11:00 AM – 9:30 PM',
};

export const CLINIC_HOURS = {
  weekdays: 'Monday – Saturday: 5:30 PM – 10:30 PM',
  sunday: 'Sunday: 2:00 PM – 4:00 PM',
  short: 'Mon – Sat: 5:30 PM – 10:30 PM · Sun: 2:00 – 4:00 PM',
};

/** Appointment slots inside the clinic's hours. */
export const CLINIC_SLOTS = [
  'Evening (5:30 PM – 8:00 PM)',
  'Night (8:00 PM – 10:30 PM)',
  'Sunday (2:00 PM – 4:00 PM)',
];
