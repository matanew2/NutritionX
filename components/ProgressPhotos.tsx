import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Image } from 'react-native';
import { Camera, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

export function ProgressPhotos() {
  const colorScheme = useColorScheme();
  
  const colors = {
    surface: colorScheme === 'dark' ? '#1F1F1F' : '#F8F9FA',
    text: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    textSecondary: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    primary: '#4F46E5',
    border: colorScheme === 'dark' ? '#374151' : '#E5E7EB',
  };

  const photos = [
    {
      id: '1',
      date: '2024-01-01',
      image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400',
      label: 'Starting',
    },
    {
      id: '2',
      date: '2024-01-15',
      image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400',
      label: '2 weeks',
    },
    {
      id: '3',
      date: '2024-02-01',
      image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg?auto=compress&cs=tinysrgb&w=400',
      label: '1 month',
    },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Progress Photos
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/progress-photos')}
        >
          <Text style={[styles.viewAll, { color: colors.textSecondary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.container, { backgroundColor: colors.surface }]}>
        <View style={styles.photosGrid}>
          {photos.map((photo) => (
            <View key={photo.id} style={styles.photoItem}>
              <Image source={{ uri: photo.image }} style={styles.photo} />
              <Text style={[styles.photoLabel, { color: colors.textSecondary }]}>
                {photo.label}
              </Text>
            </View>
          ))}
          
          <TouchableOpacity
            style={[styles.addPhotoButton, { borderColor: colors.border }]}
            onPress={() => router.push('/progress-photos')}
          >
            <View style={[styles.addIcon, { backgroundColor: colors.primary }]}>
              <Plus size={20} color="white" />
            </View>
            <Text style={[styles.addPhotoText, { color: colors.textSecondary }]}>
              Add Photo
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.cameraButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/progress-photos')}
        >
          <Camera size={16} color="white" />
          <Text style={styles.cameraButtonText}>
            Take Progress Photo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  viewAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  container: {
    borderRadius: 16,
    padding: 20,
  },
  photosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  photoItem: {
    alignItems: 'center',
  },
  photo: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
  },
  photoLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  addPhotoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  addPhotoText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
});