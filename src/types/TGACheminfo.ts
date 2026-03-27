import type { TGAMeta } from 'cheminfo-types';

/** Wrapper for standardized cheminfo metadata in TGA spectra. */
export interface TGACheminfo {
  /** Standardized TGA metadata. */
  meta: TGAMeta;
}
