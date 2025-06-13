import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getDailyData, saveDailyData } from '@/utils/storage';

interface NotesSectionProps {
  date: string;
  onDataChange: () => Promise<void>;
}

export const NotesSection: React.FC<NotesSectionProps> = ({ date, onDataChange }) => {
  const { colors } = useColorScheme();
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    loadNotes();
  }, [date]);

  const loadNotes = async () => {
    const data = await getDailyData(date);
    setNotes(data?.notes || '');
  };

  const handleNotesChange = async (text: string) => {
    setNotes(text);
    const data = await getDailyData(date);
    await saveDailyData(date, {
      ...data,
      notes: text,
    });
    onDataChange();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>Notes</Text>
      <TextInput
        style={[styles.input, { 
          color: colors.text,
          backgroundColor: colors.background,
          borderColor: colors.border,
        }]}
        value={notes}
        onChangeText={handleNotesChange}
        placeholder="Add notes for this day..."
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
}); 