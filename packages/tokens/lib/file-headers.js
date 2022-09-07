export const legal = {
  name: 'sl/legal',
  fileHeader(defaultMessage) {
    return [
      ...defaultMessage,
      '',
      'Copyright 2022 Sanoma Learning',
      'SPDX-License-Identifier: Apache-2.0'
    ];
  }
};
