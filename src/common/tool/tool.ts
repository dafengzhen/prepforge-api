import { ForbiddenException } from '@nestjs/common';

/**
 * isHttpsSite.
 */
export const isHttpsSite = () => {
  return process.env.IS_HTTPS_SITE === 'true';
};

/**
 * getMaxAge.
 *
 * @param days days
 */
export const getMaxAge = (days: number) => {
  return days * 24 * 60 * 60 * 1000;
};

/**
 * checkUserPermission.
 *
 * @param id id
 * @param currentUserId currentUserId
 */
export const checkUserPermission = (id: number, currentUserId: number) => {
  if (id !== currentUserId) {
    throw new ForbiddenException(
      'Sorry, you do not have permission to access this resource.',
    );
  }
};

/**
 * isPasswordSimilar.
 *
 * @param oldPassword oldPassword
 * @param newPassword newPassword
 */
export const isPasswordSimilar = (
  oldPassword: string | null | undefined,
  newPassword: string | null | undefined,
) => {
  if (
    typeof oldPassword !== 'string' ||
    typeof newPassword !== 'string' ||
    oldPassword === '' ||
    newPassword === ''
  ) {
    return;
  }

  const oldLength = oldPassword.length;
  const newLength = newPassword.length;
  if (oldLength !== newLength) {
    return false;
  }

  const minMatch = Math.ceil(oldLength / 2);
  let matchCount = 0;

  for (let i = 0; i < oldLength; i++) {
    if (newPassword.includes(oldPassword[i])) {
      matchCount++;
    }

    if (matchCount >= minMatch) {
      return true;
    }
  }

  return false;
};
