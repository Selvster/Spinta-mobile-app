import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';
import { pickImage, uploadToCloudinary } from '../../utils/imageUpload';

interface ImagePickerButtonProps {
  label: string;
  value?: string | null;
  onImageUploaded: (url: string) => void;
  onError?: (error: string) => void;
  folder?: string;
  size?: number;
  shape?: 'circle' | 'square';
  placeholder?: string;
}

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  label,
  value,
  onImageUploaded,
  onError,
  folder,
  size = 100,
  shape = 'circle',
  placeholder = 'Add Photo',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const handlePress = async () => {
    const pickResult = await pickImage();

    if (!pickResult.success || !pickResult.uri) {
      if (pickResult.error && pickResult.error !== 'Image selection was cancelled') {
        onError?.(pickResult.error);
      }
      return;
    }

    // Show local preview immediately
    setLocalUri(pickResult.uri);
    setIsUploading(true);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(pickResult.uri, folder);

    setIsUploading(false);

    if (uploadResult.success && uploadResult.url) {
      onImageUploaded(uploadResult.url);
    } else {
      setLocalUri(null);
      onError?.(uploadResult.error || 'Upload failed');
    }
  };

  const displayImage = localUri || value;
  const borderRadius = shape === 'circle' ? size / 2 : 12;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius,
          },
        ]}
        onPress={handlePress}
        disabled={isUploading}
        activeOpacity={0.7}
      >
        {displayImage ? (
          <>
            <Image
              source={{ uri: displayImage }}
              style={[styles.image, { borderRadius }]}
            />
            {isUploading && (
              <View style={[styles.uploadingOverlay, { borderRadius }]}>
                <ActivityIndicator color={COLORS.white} size="small" />
              </View>
            )}
            {!isUploading && (
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color={COLORS.white} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            {isUploading ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <>
                <Ionicons name="camera-outline" size={24} color={COLORS.textSecondary} />
                <Text style={styles.placeholderText}>{placeholder}</Text>
              </>
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  button: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
