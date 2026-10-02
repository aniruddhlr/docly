import { Colors as SharedColors } from '@docly/shared';
import { Platform } from 'react-native';

export const Colors = {
  ...SharedColors,
  background: SharedColors.cream,
  surface: SharedColors.card,
  text: SharedColors.ink,
  textSecondary: SharedColors.muted,
  border: SharedColors.line,
  borderStrong: SharedColors.lineDark,
};

export const Typography = {
  display: Platform.select({
    ios: 'Fredoka-SemiBold',
    android: 'Fredoka_600SemiBold',
    default: 'system-ui',
  }),
  displayBold: Platform.select({
    ios: 'Fredoka-Bold',
    android: 'Fredoka_700Bold',
    default: 'system-ui',
  }),
  body: Platform.select({
    ios: 'Karla-Regular',
    android: 'Karla_400Regular',
    default: 'system-ui',
  }),
  bodyMedium: Platform.select({
    ios: 'Karla-Medium',
    android: 'Karla_500Medium',
    default: 'system-ui',
  }),
  bodyBold: Platform.select({
    ios: 'Karla-Bold',
    android: 'Karla_700Bold',
    default: 'system-ui',
  }),
  bodyExtraBold: Platform.select({
    ios: 'Karla-ExtraBold',
    android: 'Karla_800ExtraBold',
    default: 'system-ui',
  }),
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 9999,
};

export const RetroShadow = (color: string = Colors.line, height: number = 3) => ({
  borderBottomWidth: height,
  borderBottomColor: color,
});
