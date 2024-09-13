import { SetMetadata } from '@nestjs/common';

/**
 * Custom serializer for json in response
 * 
 * Functionalities:
 * - Transform bigint to string to avoid `TypeError: Do not know how to serialize a BigInt`
 */
export const UseCustomSerializer = () =>
  SetMetadata('useCustomSerializer', true);
