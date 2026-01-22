import type { DoubleArray, MeasurementVariable } from 'cheminfo-types';

declare module 'cheminfo-types' {
  interface MeasurementXYVariables<DataType extends DoubleArray = DoubleArray> {
    t?: MeasurementVariable<DataType>;
  }
}
