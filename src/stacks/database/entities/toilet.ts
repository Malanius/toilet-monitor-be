import { Entity } from 'electrodb';

import { getDdbClient } from '../client';
import { table } from '../table';

export const Toilet = new Entity(
  {
    model: {
      entity: 'toilet',
      service: 'status',
      version: '1',
    },
    attributes: {
      toiletId: {
        type: 'string',
      },
      toiletName: {
        type: 'string',
      },
    },
    indexes: {},
  },
  { client: getDdbClient(), table }
);
