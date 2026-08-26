export interface LeatherColorPreset {
  name: string;
  category: string;
  hex: string;
  emoji: string;
}

export const LEATHER_COLOR_PALETTE: LeatherColorPreset[] = [
  { name: 'Tan', category: 'Light brown', hex: '#C19A6B', emoji: '🟤' },
  { name: 'Cognac', category: 'Medium brown', hex: '#9E471C', emoji: '🟤' },
  { name: 'Dark Brown', category: 'Dark brown', hex: '#3E2312', emoji: '🟤' },
  { name: 'Mahogany', category: 'Reddish brown', hex: '#5B231D', emoji: '🟤' },
  { name: 'Camel', category: 'Yellowish brown', hex: '#C69255', emoji: '🟤' },
  { name: 'Espresso Brown', category: 'Very dark brown', hex: '#261813', emoji: '🟫' },
  { name: 'Black', category: 'Black', hex: '#1A1A1A', emoji: '⚫' },
  { name: 'White', category: 'White', hex: '#FFFFFF', emoji: '⚪' },
  { name: 'Off-White', category: 'Slightly warm white', hex: '#F5F1E8', emoji: '🤍' },
  { name: 'Taupe', category: 'Beige/light brown', hex: '#8E8274', emoji: '🟤' },
  { name: 'Burnt Orange', category: 'Orange-brown', hex: '#BF5829', emoji: '🟠' },
  { name: 'Burgundy', category: 'Deep red-brown', hex: '#5E1924', emoji: '🔴' },
  { name: 'Olive Green', category: 'Dark green', hex: '#3E4E36', emoji: '🟢' },
  { name: 'Navy Blue', category: 'Dark blue', hex: '#182844', emoji: '🔵' },
  { name: 'Greige', category: 'Grey-brown', hex: '#928C84', emoji: '🩶' },
  { name: 'Honey Brown', category: 'Golden brown', hex: '#C98638', emoji: '🟡' },
  { name: 'Natural Tan', category: 'Natural leather', hex: '#DBAA79', emoji: '🟤' },
  { name: 'Chestnut', category: 'Deep reddish brown', hex: '#6D281E', emoji: '🟫' },
];
