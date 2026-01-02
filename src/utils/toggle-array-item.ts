import { xorBy } from 'lodash-es';

export const toggleArrayItem = <T>(arr: T[], item: T) => xorBy(arr, [item], 'id');
