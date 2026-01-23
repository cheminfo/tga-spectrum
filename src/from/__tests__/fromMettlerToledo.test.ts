import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { fromMettlerToledo } from '../fromMettlerToledo.js';

describe('fromMettlerToledo', () => {
  it('Absolute weight', () => {
    const arrayBuffer = readFileSync(
      join(import.meta.dirname, './data/mettlerToledoWeight.txt'),
    );

    const analysis = fromMettlerToledo(arrayBuffer);

    const spectrum = analysis.getSpectrum();

    expect(spectrum.variables).toMatchObject({
      t: {
        units: 's',
        label: 'time',
        min: 0,
        max: 2250,
      },
      x: {
        units: '°C',
        label: 'Temperature recorded',
        min: 36.622,
        max: 658.132,
      },
      r: {
        units: '°C',
        label: 'Temperature programmed',
        min: 35,
        max: 650,
      },
      y: {
        units: 'mg',
        label: 'Weight',
        min: 2.304,
        max: 12.8038,
      },
    });

    expect(spectrum.meta?.zones).toStrictEqual([
      {
        relativeMassLoss: 0.669395,
        massLoss: { value: 8.5696, units: 'mg' },
        from: { value: 38.13, units: '°C' },
        to: { value: 647.27, units: '°C' },
        kind: 'horizontal',
        inflectionPoint: { value: 397.19, units: '°C' },
        middlePoint: { value: 401.27, units: '°C' },
      },
      {
        relativeMassLoss: 0.15049400000000002,
        massLoss: { value: 1.9266, units: 'mg' },
        from: { value: 647.27, units: '°C' },
        to: { value: 649.22, units: '°C' },
        kind: 'horizontal',
        inflectionPoint: { value: 657.4, units: '°C' },
        middlePoint: { value: 658.13, units: '°C' },
      },
      {
        relativeMassLoss: 0.18011100000000002,
        massLoss: { value: 2.304700000000001, units: 'mg' },
        kind: 'Residual',
      },
    ]);

    expect(spectrum.dataType).toBe('TGA');
    expect(spectrum).toMatchObject({
      dataType: 'TGA',
      meta: {
        method: '650 TGA/DSC',
        holder: {
          kind: 'Alumina 70ul',
          mass: { units: 'mg', value: 179.215 },
          material: 'Ceramic',
        },
        sampleMass: { value: 12.8009, units: 'mg' },
        cheminfo: {
          meta: {
            method: '650 TGA/DSC',
            holder: {
              kind: 'Alumina 70ul',
              mass: { value: 179.215, units: 'mg' },
              material: 'Ceramic',
            },
            initialValue: { value: 12.8009, units: 'mg' },
            zones: [
              {
                relativeMassLoss: 0.669395,
                massLoss: { value: 8.5696, units: 'mg' },
                from: { value: 38.13, units: '°C' },
                to: { value: 647.27, units: '°C' },
                kind: 'horizontal',
                inflectionPoint: { value: 397.19, units: '°C' },
                middlePoint: { value: 401.27, units: '°C' },
              },
              {
                relativeMassLoss: 0.15049400000000002,
                massLoss: { value: 1.9266, units: 'mg' },
                from: { value: 647.27, units: '°C' },
                to: { value: 649.22, units: '°C' },
                kind: 'horizontal',
                inflectionPoint: { value: 657.4, units: '°C' },
                middlePoint: { value: 658.13, units: '°C' },
              },
              {
                relativeMassLoss: 0.18011100000000002,
                massLoss: { value: 2.304700000000001, units: 'mg' },
                kind: 'Residual',
              },
            ],
            sampleMass: { value: 12.8009, units: 'mg' },
          },
        },
      },
    });
  });
});
