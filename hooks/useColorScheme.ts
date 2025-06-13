import { useColorScheme as useNativeColorScheme } from 'react-native';

interface Colors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
}

export const useColorScheme = () => {
  const colorScheme = useNativeColorScheme();
  
  const colors: Colors = {
    background: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  return { colors };
}; 