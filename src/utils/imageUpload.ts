import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_CONFIG } from '../constants/config';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface PickImageResult {
  success: boolean;
  uri?: string;
  error?: string;
}

/**
 * Request permission and pick an image from the device library
 */
export const pickImage = async (): Promise<PickImageResult> => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return {
        success: false,
        error: 'Permission to access photos was denied',
      };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return {
        success: false,
        error: 'Image selection was cancelled',
      };
    }

    return {
      success: true,
      uri: result.assets[0].uri,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to pick image',
    };
  }
};

/**
 * Upload an image to Cloudinary
 * @param imageUri - Local URI of the image to upload
 * @param folder - Optional folder name in Cloudinary (e.g., 'players', 'clubs')
 */
export const uploadToCloudinary = async (
  imageUri: string,
  folder?: string
): Promise<ImageUploadResult> => {
  try {
    const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;

    if (!cloudName || cloudName === 'YOUR_CLOUD_NAME') {
      return {
        success: false,
        error: 'Cloudinary is not configured. Please update CLOUDINARY_CONFIG in config.ts',
      };
    }

    // Create form data for upload
    const formData = new FormData();

    // Get file extension from URI
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('file', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: `upload.${fileType}`,
    } as any);

    formData.append('upload_preset', uploadPreset);

    if (folder) {
      formData.append('folder', `spinta/${folder}`);
    }

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error?.message || 'Upload failed',
      };
    }

    return {
      success: true,
      url: data.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: 'Failed to upload image. Please try again.',
    };
  }
};

/**
 * Pick and upload an image in one step
 * @param folder - Optional folder name in Cloudinary
 */
export const pickAndUploadImage = async (
  folder?: string
): Promise<ImageUploadResult> => {
  const pickResult = await pickImage();

  if (!pickResult.success || !pickResult.uri) {
    return {
      success: false,
      error: pickResult.error,
    };
  }

  return uploadToCloudinary(pickResult.uri, folder);
};
