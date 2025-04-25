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

type VariableCollectionWithModeId = VariableCollection & {
  modeId?: string;
};

let libVariables: LibraryVariableCollection[] = [];
let variableCollections: VariableCollectionWithModeId[] = [];
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

const getFromLibrary = async () => {
  // this list is all we have access to when the variables only exist in the library, not on the current page
  libVariables = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  const variableCollection: VariableCollection[] = [];

  const baseVariable = libVariables.find(c => c.name === 'Base');
  if (!baseVariable) {
    console.error('Base collection not found');
    return;
  }

  const base = await getCollectionFromKey(baseVariable.key);
  if (!base || !base.modes) {
    console.log('No collection found');
    return;
  }
  variableCollections.push(base);

  // get all collections from the base collection (Collection I & Collection II level)
  const collections = await getSubCollections(base);

  // get all theme collections from the all collections (Theme A, B, etc level)
  const themecollections = await Promise.all(
    collections.filter(c => c !== undefined).flatMap(c => getSubCollections(c))
  );

  // get all themes from the all theme collections (Sanoma Learning, Magister, etc level)
  await Promise.all(
    themecollections
      .flat()
      .filter(c => c !== undefined)
      .flatMap(c => getSubCollections(c))
  );

  return variableCollection;
};

const getSubCollections = async (collection: VariableCollection | VariableCollectionWithModeId) => {
  return await Promise.all(
    collection.modes.map(async mode => {
      if (mode.name === 'Placeholder') {
        // we don't want to show the placeholder theme in the UI
        return;
      }
      const modeVariable = libVariables.find(c => c.name === mode.name);
      if (!modeVariable) {
        console.error('Mode variable not found for', mode.name);
        return;
      }
      const modeCollection = (await getCollectionFromKey(modeVariable.key)) as VariableCollectionWithModeId;
      if (!modeCollection) {
        console.error('Mode collection not found for', mode.name);
        return;
      }
      modeCollection.modeId = mode.modeId;
      variableCollections.push(modeCollection);
      return modeCollection;
    })
  );
};

const getCollectionFromKey = async (key: string) => {
  const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(key);
  if (variables.length === 0) {
    console.log('No variables found in library collection');
    return;
  }
  const baseId = (await figma.variables.importVariableByKeyAsync(variables[0].key)).variableCollectionId;
  const variablesByKey = await figma.variables.importVariableByKeyAsync(variables[0].key);
  console.log('types', variablesByKey.name, variablesByKey.resolvedType, variables);
  return await figma.variables.getVariableCollectionByIdAsync(baseId);
};

getFromLibrary()
  .then(variableCollection => {
    if (variableCollection) {
      sendCollections();
    } else {
      // if the variables are not in the library, we need to get them from the current page
      figma.variables
        .getLocalVariableCollectionsAsync()
        .then(c => {
          variableCollections = c;
          sendCollections();
        })
        .catch(e => {
          console.error('Error getting local variable collections', e);
        });
    }
  })
  .catch(e => {
    console.error('Error getting library variables', e);
  });

/** Create the list of themes with all the id's of relevant parents and children and send it to the UI */
const sendCollections = () => {
  //find all collections that have a theme as a direct child
  variableCollections
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
      themesCollection.modes
        .filter(theme => theme.name !== 'Placeholder')
        .forEach(theme => {
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
};

/** use this to find the collection based on the mode name */
const findCollectionByName = (name: string) => {
  return variableCollections.find(c => c.name === name);
};

/** Find the collection based on the ID */
const findCollectionById = (id: string) => {
  return variableCollections.find(c => c.id === id);
};

/** Find the parent collection of a child collection by looking for the child in the modes of the parent collection, based on name or modeId */
const findParentCollection = (child: string) => {
  const parent = variableCollections.find(c => {
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
    const collectionForKey = variableCollections.find(c => c.id === key);

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
    const base = variableCollections.find(c => c.name === 'Base');

    if (!themeIds) {
      console.error('Theme not found for', msg.theme);
      return;
    }

    // find collections by id because we need the send the whole collection in the API call.
    const collection = findCollectionById(themeIds.collectionId);
    const themeCollection = findCollectionById(themeIds.themeCollectionId);
    const theme = findCollectionById(themeIds.themeId);

    figma
      .loadFontAsync({ family: 'The Message', style: 'DemiBold' })
      .then(() => {
        console.log({ base, collection, themeCollection, theme });

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
      })
      .catch(e => {
        console.error('Error loading font', e);
        figma.notify('Error loading font', { error: true });
      });
  }

  figma.closePlugin();
};
