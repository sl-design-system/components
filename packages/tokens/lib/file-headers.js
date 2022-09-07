export const legal = {
  name: 'sl/legal',
  fileHeader(defaultMessage) {
    return [
      'Copyright 2022 Sanoma Learning',
      'SPDX-License-Identifier: Apache-2.0',
      '',
      ...defaultMessage
    ];
  }
};
