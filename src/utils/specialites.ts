export const SPECIALITES = {
  ida: "Informatique Développement d'Applications",
  mic: "Multimédia Internet et Communication",
  cd: "Communication Digitale"
} as const;

export type SpecialiteKey = keyof typeof SPECIALITES;

export const getNomSpecialite = (key: SpecialiteKey): string => {
  return SPECIALITES[key];
};

export type Specialite = SpecialiteKey;