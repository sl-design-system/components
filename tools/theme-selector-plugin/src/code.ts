/// <reference types="@figma/plugin-typings" />

// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

let collections:VariableCollection[] = [];
let themes:{
  collectionId:string,
  collectionModeId:string,
  subCollectionId:string,
  subCollectionModeId:string,
  themeId:string,
  themeModeId:string,
  variantId?:string,
  compoundId:string,
  name:string
}[] = [];




const sendCollections = () => {
  figma.variables.getLocalVariableCollectionsAsync().then((c) => {
    collections = c;
    console.log('qwer-collections', collections);
    //find all collections that have a theme as a direct child // search string is temporary
    collections.filter(c => c.name.includes(` - `)).forEach((subCollection) => {
      // this should be done by findParentCollection, but the names of the modes in the collections are not the same as the names of the theme collections.
      const base = findCollectionByName('Base');
      if(!base) {
        console.error('Base collection not found');
        return;
      }

      const collection = findCollectionByName(subCollection.name.split(' - ')[0]);
      if(!collection) {
        console.error('Collection not found for', subCollection.name);
        return;
      }

      const collectionModeId = base.modes.find(sc=>sc.name===collection.name);
      if(!collectionModeId) {
        console.error('Collection mode id not found for', subCollection.name);
        return;
      }

      console.log(collection.modes);
      const subCollectionModeId = collection.modes.find(sc=>sc.name===`Collection ${subCollection.name.split(' - ')[1]}`);
      if(!subCollectionModeId) {
        console.error('Sub collection mode id not found for', subCollection.name);
        return;
      }
      // for all modes (themes) in the subCollection, find information by the name.
      subCollection.modes.forEach((theme) => {
        const themeCollection = findCollectionByName(theme.name);
        if(!themeCollection) {
          console.error('Theme collection not found for', theme.name);
          return;
        }
        if(!collection) {
          console.error('Collection not found for', subCollection.name);
          return;
        }
        const themeModes = themeCollection? themeCollection.modes : [];
        console.log('themeCollection',theme.name, themeCollection, themeModes);
        if(themeModes.length>1) {
          themeModes.forEach((mode) => {
            const themeVariant = findCollectionByName(mode.name);
            // console.log('themeVariant', themeVariant, mode.name);
                themes.push({
                  collectionId: collection.id,
                  collectionModeId: collectionModeId.modeId,
                  subCollectionId: subCollection.id,
                  subCollectionModeId: subCollectionModeId.modeId,
                  themeId: themeCollection.id,
                  themeModeId: theme.modeId,
                  variantId: mode.modeId,
                  compoundId: `${themeCollection.id}-${mode.modeId}`,
                  name: `${theme.name} - ${mode.name}`
                });
              });
          }else{
          themes.push({
            collectionId: collection.id,
            collectionModeId: collectionModeId.modeId,
            subCollectionId: subCollection.id,
            subCollectionModeId: subCollectionModeId.modeId,
            themeId: themeCollection.id,
            themeModeId: theme.modeId,
            compoundId: `${themeCollection.id}`,
            name: `${theme.name}`
          });
        }
      });
    });
    console.log('themes', themes);
    figma.ui.postMessage(themes, { origin: "*" });
  });
}



const findCollectionByName = (name:string) => {
  return collections.find(c => c.name === name);
}
const findCollectionById = (id:string) => {
  return collections.find(c => c.id === id);
}

const findParentCollection = (child: string) => {
  const parent = collections.find(c => {
    // console.log('collections', collections);
    const collectionsWithChild =  c.modes.filter(mode => {
      // console.log('findParentCollection',mode, child);
      return mode.name === child || mode.modeId === child;
    });
    // console.log('collectionsWithChild', collectionsWithChild);
    return collectionsWithChild.length > 0;
  });
  // console.log('findParentCollection', parent);
  return parent;
};



// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async (msg: { type: string, theme: string }) => {

  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'selectTheme') {
    // const level2 = findParentCollection(msg.theme);
    // console.log('level2', level2);
    console.log(figma.currentPage.explicitVariableModes);
    collections.forEach(variable => {
      figma.currentPage.clearExplicitVariableModeForCollection(variable);
    });
    const themeIds = themes.find(t => t.compoundId === msg.theme);
    console.log('theme', themeIds);
    const base = collections.find(c => c.name==="Base");
    if(!themeIds) {
      console.error('Theme not found for', msg.theme);
      return;
    }
    const collection = findCollectionById(themeIds.collectionId);
    const subCollection = findCollectionById(themeIds.subCollectionId);
    const theme = findCollectionById(themeIds.themeId);

    if(base) {
      figma.currentPage.setExplicitVariableModeForCollection(base, themeIds.collectionModeId);
    }
    if(collection) {
      console.log('set',collection, themeIds.subCollectionModeId);
      figma.currentPage.setExplicitVariableModeForCollection(collection, themeIds.subCollectionModeId);
    }
    if(subCollection) {
      figma.currentPage.setExplicitVariableModeForCollection(subCollection, themeIds.themeModeId);
    }
    if(theme && themeIds.variantId) {
      // console.log('set',themeIds.themeId, themeIds.variantId)
      figma.currentPage.setExplicitVariableModeForCollection(theme, themeIds.variantId);
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};


sendCollections();
