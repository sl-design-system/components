export type Mode = 'light' | 'dark';

export interface Theme {
  id: string,
  name: string;
  fonts: string[];
  setup: () => Promise<void>;
}

export const themes: Theme[] = [
  {
    id: 'bingel-dc',
    name: 'Bingel DC',
    fonts: ['https://use.typekit.net/ghy4rhf.css'],
    setup: async () => {
      const { setup } = await import('@sl-design-system/bingel-dc');

      setup();
    }
  },
  {
    id: 'bingel-int',
    name: 'Bingel INT',
    fonts: ['https://use.typekit.net/qya8xxo.css'],
    setup: async () => {
      const { setup } = await import('@sl-design-system/bingel-int');

      setup();
    }
  },
  {
    id: 'clickedu',
    name: 'Clickedu',
    fonts: [
      'https://use.typekit.net/xps8gfu.css',
      '/themes/clickedu/fonts.css'
    ],
    setup: async () => {
      const { setup } = await import('@sl-design-system/clickedu');

      setup();
    }
  },
  {
    id: 'editorial-suite',
    name: 'Editorial Suite',
    fonts: ['https://use.typekit.net/bws3iof.css'],
    setup: async () => {
      const { setup } = await import('@sl-design-system/editorial-suite');

      setup();
    }
  },
  {
    id: 'itslearning',
    name: 'itslearning',
    fonts: ['https://use.typekit.net/ucw7xel.css'],
    setup: async () => {
      const { setup } = await import('@sl-design-system/itslearning');

      setup();
    }
  },
  {
    id: 'kampus',
    name: 'Kampus',
    fonts: ['https://use.typekit.net/pva0jun.css'],
    setup: async () => {
      const { setup } = await import('@sl-design-system/kampus');

      setup();
    }
  },
  {
    id: 'magister',
    name: 'Magister',
    fonts: [
      'https://use.typekit.net/zkq0zzv.css',
      '/themes/sanoma-learning/fonts.css'
    ],
    setup: async () => {
      const { setup } = await import('@sl-design-system/magister');

      setup();
    }
  },
  {
    id: 'max',
    name: 'MAX Online',
    fonts: ['https://use.typekit.net/doq6twb.css'],
    setup: async () => {
      const { setup } = await import('@sl-design-system/max');

      setup();
    }
  },
  {
    id: 'my-digital-book',
    name: 'My Digital Book',
    fonts: [
      'https://use.typekit.net/pdw7rxd.css',
      '/themes/my-digital-book/fonts.css'
    ],
    setup: async () => {
      const { setup } = await import('@sl-design-system/my-digital-book');

      setup();
    }
  },
  // {
  //   id: 'myvanin',
  //   name: 'My Van In',
  //   fonts: ['https://use.typekit.net/qwk4gym.css'],
  //   setup: async () => {
  //     const { setup } = await import('@sl-design-system/myvanin');

  //     setup();
  //   }
  // },
  {
    id: 'neon',
    name: 'NEON',
    fonts: [
      'https://use.typekit.net/ghy4rhf.css',
      'https://use.typekit.net/qod6igq.css'
    ],
    setup: async () => {
      const { setup } = await import('@sl-design-system/neon');

      setup();
    }
  },
  {
    id: 'sanoma-learning',
    name: 'Sanoma Learning',
    fonts: [
      'https://use.typekit.net/kes1hoh.css',
      '/themes/sanoma-learning/fonts.css'
    ],
    setup: async () => {
      const { setup } = await import('@sl-design-system/sanoma-learning');

      setup();
    }
  },
  // {
  //   id: 'sanoma-utbildning',
  //   name: 'Sanoma Utbildning',
  //   fonts: ['https://use.typekit.net/zjd4wix.css'],
  //   setup: async () => {
  //     const { setup } = await import('@sl-design-system/sanoma-utbildning');

  //     setup();
  //   }
  // },
  {
    id: 'teas',
    name: 'TEAS',
    fonts: ['https://use.typekit.net/fgr4zwk.css'],
    setup: async () => {
      const { setup } = await import('@sl-design-system/teas');

      setup();
    }
  }
];

const resources: { mode?: HTMLLinkElement, fonts?: HTMLLinkElement[], global?: HTMLLinkElement } = {};

export const updateTheme = async (themeId: string, mode: Mode = 'light'): Promise<void> => {
  const theme = themes.find(({ id }) => id === themeId);
  if (!theme) {
    return;
  }

  resources.mode ??= document.head.appendChild(document.createElement('link'));
  resources.mode.href = `/themes/${themeId}/${mode}.css`;
  resources.mode.rel = 'stylesheet';

  resources.global ??= document.head.appendChild(document.createElement('link'));
  resources.global.href = `/themes/${themeId}/global.css`;
  resources.global.rel = 'stylesheet';

  if (theme.fonts) {
    resources.fonts = theme.fonts.map(font => {
      const link = document.head.appendChild(document.createElement('link'));
      link.href = font;
      link.rel = 'stylesheet';

      return link;
    });
  }

  await Promise.allSettled([
    new Promise(resolve => resources.mode!.onload = resolve),
    ...(resources.fonts?.map(font => new Promise(resolve => font.onload = resolve)) ?? []),
    theme.setup()
  ])
};
