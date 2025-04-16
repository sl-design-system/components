/// <reference types="@figma/plugin-typings" />

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, {
  width: 280,
  height: 128,
  themeColors: true
});

let collections: VariableCollection[] = [];
const themes: Array<{
  collectionId: string;
  collectionModeId: string;
  themeCollectionId: string;
  themeCollectionModeId: string;
  themeId: string;
  themeModeId: string;
  variantId?: string;
  compoundId: string;
  name: string;
}> = [];

/** Create the list of themes with all the id's of relevant parents and children and send it to the UI */
const sendCollections = () => {
  figma.variables
    .getLocalVariableCollectionsAsync()
    .then(c => {
      collections = c;

      //find all collections that have a theme as a direct child
      collections
        .filter(c => c.name.includes('Themes'))
        .forEach(themesCollection => {
          const base = findCollectionByName('Base');
          if (!base) {
            console.error('Base collection not found');
            return;
          }

          // find the parent collection of the themes collection
          const collection = findParentCollection(themesCollection.name);
          if (!collection) {
            console.error('Collection not found for', themesCollection.name);
            return;
          }
          // find the modeId of the collection so it can be set on the base collection
          const collectionAsMode = base.modes.find(sc => sc.name === collection.name);
          if (!collectionAsMode) {
            console.error('Collection mode id not found for', collection.name);
            return;
          }

          // find the modeId of the themes collection so it can be set on the parent collection
          const themeCollectionAsMode = collection.modes.find(sc => sc.name === themesCollection.name);
          if (!themeCollectionAsMode) {
            console.error('Theme collection mode id not found for', themesCollection.name);
            return;
          }

          // for all themes in this themesCollection, check if there are any variants, and create a list of all relevant id's
          themesCollection.modes.forEach(theme => {
            const themeCollection = findCollectionByName(theme.name);
            if (!themeCollection) {
              console.error('Theme collection not found for', theme.name);
              return;
            }
            const themeModes = themeCollection ? themeCollection.modes : [];
            if (themeModes.length > 1) {
              themeModes.forEach(mode => {
                themes.push({
                  collectionId: collection.id,
                  collectionModeId: collectionAsMode.modeId,
                  themeCollectionId: themesCollection.id,
                  themeCollectionModeId: themeCollectionAsMode.modeId,
                  themeId: themeCollection.id,
                  themeModeId: theme.modeId,
                  variantId: mode.modeId,
                  compoundId: `${themeCollection.id}-${mode.modeId}`,
                  name: `${theme.name} - ${mode.name}`
                });
              });
            } else {
              themes.push({
                collectionId: collection.id,
                collectionModeId: collectionAsMode.modeId,
                themeCollectionId: themesCollection.id,
                themeCollectionModeId: themeCollectionAsMode.modeId,
                themeId: themeCollection.id,
                themeModeId: theme.modeId,
                compoundId: `${themeCollection.id}`,
                name: `${theme.name}`
              });
            }
          });
        });
      figma.ui.postMessage(themes, { origin: '*' });
    })
    .catch(e => {
      console.error('Error getting collections', e);
    });
};

/** use this to find the collection based on the mode name */
const findCollectionByName = (name: string) => {
  return collections.find(c => c.name === name);
};

/** Find the collection based on the ID */
const findCollectionById = (id: string) => {
  return collections.find(c => c.id === id);
};

/** Find the parent collection of a child collection by looking for the child in the modes of the parent collection, based on name or modeId */
const findParentCollection = (child: string) => {
  const parent = collections.find(c => {
    const collectionsWithChild = c.modes.filter(mode => {
      return mode.name === child || mode.modeId === child;
    });
    return collectionsWithChild.length > 0;
  });
  return parent;
};

/** Removes all explicit variable modes from the current page. */
const removeCurrentVariableModes = () => {
  Object.keys(figma.currentPage.explicitVariableModes).forEach(key => {
    const collectionForKey = collections.find(c => c.id === key);

    if (collectionForKey) {
      figma.currentPage.clearExplicitVariableModeForCollection(collectionForKey);
    }
  });
};

// Listen to events from the UI
figma.ui.onmessage = async (msg: { type: string; theme: string }) => {
  if (msg.type === 'selectTheme') {
    removeCurrentVariableModes();

    const themeIds = themes.find(t => t.compoundId === msg.theme);
    const base = collections.find(c => c.name === 'Base');

    if (!themeIds) {
      console.error('Theme not found for', msg.theme);
      return;
    }

    // find collections by id because we need the send the whole collection in the API call.
    const collection = findCollectionById(themeIds.collectionId);
    const themeCollection = findCollectionById(themeIds.themeCollectionId);
    const theme = findCollectionById(themeIds.themeId);

    if (base) {
      figma.currentPage.setExplicitVariableModeForCollection(base, themeIds.collectionModeId);
    }
    if (collection) {
      figma.currentPage.setExplicitVariableModeForCollection(collection, themeIds.themeCollectionModeId);
    }
    if (themeCollection) {
      figma.currentPage.setExplicitVariableModeForCollection(themeCollection, themeIds.themeModeId);
    }
    if (theme && themeIds.variantId) {
      figma.currentPage.setExplicitVariableModeForCollection(theme, themeIds.variantId);
    }
  }

  figma.closePlugin();
};

sendCollections();
