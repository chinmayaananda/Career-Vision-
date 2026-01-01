export type CategoryId = 'WORK';

export interface StyleProfile {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  icon: string;
}

export interface TransformationRequest {
  image: string; // Base64
  styleId: string;
}

export interface GenerationResult {
  imageUrl: string | null;
  error: string | null;
}