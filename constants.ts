import { StyleProfile, CategoryId } from './types';

// ID Lists for mapping results
export const WORK_IDS = ['pilot', 'ship_captain', 'army_chief', 'doctor', 'athlete', 'teacher', 'businessman'];

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  WORK: 'Work Profiles'
};

// Common instructions shared across all generations
const COMMON_SYS_MSG = `Photorealistic transformation of the person in the uploaded image.

IDENTITY LOCK (CRITICAL):
Preserve the person’s facial identity, age, gender, and ethnicity across ALL generated images.
Do NOT change facial structure.
Do NOT replace the face or generate a different person.
The SAME person must appear consistently in every image.

GLOBAL VISUAL STYLE:
Photography style: ultra-photorealistic cinematic portrait
Lens: 85mm DSLR
Lighting: professional studio lighting or cinematic lighting
Detail level: ultra-detailed, high resolution, realistic skin texture
Mood: confident, professional, authoritative
Quality: sharp focus, natural proportions, realistic materials

NEGATIVE PROMPT:
cartoon, anime, illustration, painting, CGI, 3d render,
low resolution, blurry, distorted face,
extra fingers, extra limbs, bad anatomy,
face swap, different person, inconsistent face,
overprocessed skin, artificial look`;

// Specific prompts for each role (extracted from the user's detailed list)
export const ROLE_PROMPTS: Record<string, string> = {
  pilot: "ROLE: Airline Pilot\nProfessional airline pilot wearing a navy pilot uniform with captain stripes, standing inside a commercial airplane cockpit, confident and authoritative posture.",
  ship_captain: "ROLE: Ship Captain\nShip captain wearing a white naval uniform with gold insignia, standing on the bridge of a large ocean vessel, sea visible through windows, strong leadership presence.",
  army_chief: "ROLE: Army Chief\nHigh-ranking army chief wearing a decorated military uniform with medals and badges, standing in a military command headquarters, authoritative stance, dramatic lighting.",
  doctor: "ROLE: Doctor\nMedical doctor wearing a clean white lab coat with a stethoscope, modern hospital environment, trustworthy and professional appearance, soft professional lighting.",
  athlete: "ROLE: Pro Athlete\nProfessional athlete wearing high-performance sportswear, stadium background with dramatic lights, powerful athletic pose, dynamic energy.",
  teacher: "ROLE: Teacher\nProfessional teacher wearing smart formal attire, modern classroom background with books and board, warm and approachable expression.",
  businessman: "ROLE: Executive\nCorporate executive wearing a tailored luxury business suit, modern corporate office or city skyline background, confident executive posture."
};

export const getPromptForId = (id: string): string => {
  return `${COMMON_SYS_MSG}\n\n========================\nGENERATE TARGET ROLE:\n${ROLE_PROMPTS[id] || ''}`;
};

// Deprecated: No longer used for single-shot batching, but kept for type compatibility if needed
export const CATEGORY_PROMPTS: Record<CategoryId, string> = {
  WORK: '' 
};

export const STYLES: StyleProfile[] = [
  // WORK PROFILES
  { id: 'pilot', name: 'Airline Pilot', description: 'Cockpit environment', category: 'WORK', icon: 'plane' },
  { id: 'ship_captain', name: 'Ship Captain', description: 'Ship bridge & ocean', category: 'WORK', icon: 'anchor' },
  { id: 'army_chief', name: 'Army Chief', description: 'Command HQ', category: 'WORK', icon: 'shield' },
  { id: 'doctor', name: 'Doctor', description: 'Hospital environment', category: 'WORK', icon: 'stethoscope' },
  { id: 'athlete', name: 'Pro Athlete', description: 'Stadium lights', category: 'WORK', icon: 'medal' },
  { id: 'teacher', name: 'Teacher', description: 'Classroom setting', category: 'WORK', icon: 'book' },
  { id: 'businessman', name: 'Executive', description: 'Corporate office', category: 'WORK', icon: 'briefcase' },
];