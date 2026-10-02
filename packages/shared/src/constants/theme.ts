export const Colors = {
  pine: '#0D2B25',
  pine2: '#123830',
  pineDark: '#04110E',
  pineSurface: '#0E211D',
  cream: '#FFF6E6',
  creamLight: '#FFFBF2',
  card: '#FFFDF6',
  ink: '#143A32',
  inkMuted: '#3F5A51',
  muted: '#6E8078',
  subtle: '#A9C4B8',
  line: '#EFE2C6',
  lineDark: '#E0CFA5',
  
  marigold: '#FFB700',
  marigoldDark: '#D89A00',
  marigoldLight: '#FFF6E0',
  marigoldMuted: '#6B4E00',

  coral: '#FF6B57',
  coralDark: '#E04E3C',
  coralLight: '#FFE0D6',

  mint: '#2EC27E',
  mintDark: '#1FA165',
  mintLight: '#D6F5E3',
  mintText: '#0B7A50',
  mintDarkText: '#06301E',

  sky: '#3FB5F2',
  skyDark: '#2492CE',
  skyLight: '#D7EEFF',
  skyText: '#0F6AA8',

  grape: '#8B7CF6',
  grapeLight: '#E8E1FF',
  grapeText: '#5B4BC4',

  yellowBg: '#FFE9B8',
  yellowText: '#8A5A00',
  yellowBorder: '#F3D389',
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  retro: (borderColor = Colors.line, offsetY = 3) => ({
    borderBottomWidth: offsetY,
    borderBottomColor: borderColor,
  }),
};
