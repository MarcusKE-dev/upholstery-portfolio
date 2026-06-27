// Categories and their subcategories (extended for Kenyan upholstery industry)

export const CATEGORIES = [
  { id: 'residential', label: 'Bespoke Seating' },
  { id: 'window',      label: 'Window Dressings' },
  { id: 'bedroom',     label: 'Beds & Accents' },
  { id: 'automotive',  label: 'Car Seat Covers' },
] as const

export type CategoryId = typeof CATEGORIES[number]['id']

export const SUBCATEGORIES: Record<CategoryId, string[]> = {
  residential: [
    'Sofas',
    'Dining Sets',
    'Loose Covers',
    'Mockets/Ottomans',
    'Chesterfield Sofas',
    'Sectional Sofas',
    'Recliners',
    'Love Seats',
    'Accent Chairs',
    'Banquette Seating',
  ],
  window: [
    'Curtains',
    'Blinds',
    'Sheers',
    'Roman Blinds',
    'Pleated Curtains',
    'Grommet Curtains',
    'Roller Blinds',
    'Vertical Blinds',
  ],
  bedroom: [
    'Chester Beds',
    'Scatter Cushions',
    'Victorian Beds',
    'Leather Beds',
    'Rustic Beds',
    'Tuffed Headboards',
    'Canopy Beds',
    'Platform Beds',
    'Ottoman Beds',
    'Upholstered Headboards',
  ],
  automotive: [
    'Car Seat Covers',
    'Leather Seats',
    'Custom Interiors',
    'Headliners',
    'Door Panels',
  ],
}