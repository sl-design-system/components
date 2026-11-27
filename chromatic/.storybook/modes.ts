export const allModes = {
  default: {
    // integer is just width
    viewport: 1280
  },
  'bingel-dc': {
    theme: 'bingel-dc'
  },
  'bingel-int': {
    theme: 'bingel-int'
  },
  clickedu: {
    theme: 'clickedu'
  },
  'editorial-suite': {
    theme: 'editorial-suite'
  },
  itslearning: {
    theme: 'itslearning'
  },
  kampus: {
    theme: 'kampus'
  },
  magister: {
    theme: 'magister'
  },
  max: {
    theme: 'max'
  },
  'my-digital-book': {
    theme: 'my-digital-book'
  },
  neon: {
    theme: 'neon'
  },
  'sanoma-learning': {
    theme: 'sanoma-learning'
  },
  'sanoma-pro': {
    theme: 'sanoma-pro'
  },
  'sanoma-utbildning': {
    theme: 'sanoma-utbildning'
  },
  'sl-ecosystem-blue': {
    theme: 'sl-ecosystem',
    subtheme: 'blue',
    userGroup: 'poweruser'
  },
  'sl-ecosystem-green': {
    theme: 'sl-ecosystem',
    subtheme: 'green',
    userGroup: 'poweruser'
  },
  'sl-ecosystem-orange': {
    theme: 'sl-ecosystem',
    subtheme: 'orange',
    userGroup: 'poweruser'
  },
  'sl-ecosystem-purple': {
    theme: 'sl-ecosystem',
    subtheme: 'purple',
    userGroup: 'poweruser'
  },
  'sl-ecosystem-teal': {
    theme: 'sl-ecosystem',
    subtheme: 'teal',
    userGroup: 'poweruser'
  },
  teas: {
    theme: 'teas'
  },
  tig: {
    theme: 'tig'
  }
};

const subthemes = ['blue', 'green', 'orange', 'purple', 'teal'],
  userGroups = ['early', 'developing', 'advanced', 'poweruser'];

export const ecosystemMatrixModes = Object.fromEntries(
  subthemes.flatMap(subtheme =>
    userGroups.map(userGroup => [
      `sl-ecosystem-${subtheme}-${userGroup}`,
      {
        theme: 'sl-ecosystem',
        subtheme,
        userGroup
      }
    ])
  )
);
