import { Roles } from '.prisma/client';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Role = (roles: Roles) => SetMetadata(ROLES_KEY, roles);
