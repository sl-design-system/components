(function() {
  'use strict';

  const STORAGE_KEY = 'storybook-roots-expanded';

  // Get stored preference (default to true = expanded when no preference exists)
  function getStoredPreference() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // If null/undefined, default to true (expanded)
      if (stored === null) {
        return true;
      }
      return stored === 'true';
    } catch (e) {
      return true;
    }
  }

  // Save preference to localStorage
  function savePreference(expanded) {
    try {
      localStorage.setItem(STORAGE_KEY, expanded.toString());
    } catch (e) {
      console.error('Error saving preference:', e);
    }
  }

  // Expand all root folders
  function expandAll() {
    const expandItems = () => {
      try {
        // Target root-level folders - works with both showRoots true and false
        // When showRoots: false, top-level items are groups; when true, they are roots
        const itemsToExpand = Array.from(
          document.querySelectorAll(
            '#storybook-explorer-tree [data-nodetype="root"] > button[aria-expanded="false"]'
          )
        );

        if (itemsToExpand.length > 0) {
          itemsToExpand.forEach(item => item.click());
          setTimeout(expandItems, 100);
        } else {
          // All expanded, save preference
          savePreference(true);
        }
      } catch (e) {
        console.error('Error expanding folders:', e);
      }
    };
    expandItems();
  }

  // Collapse all root folders
  function collapseAll() {
    const collapseItems = () => {
      try {
        // Find the currently selected item to preserve its parent folder
        const selectedItem = document.querySelector('#storybook-explorer-tree [data-selected="true"]');
        let activeRootButton = null;

        if (selectedItem) {
          // Traverse up the parent chain using data-parent-id to find the root
          let currentItem = selectedItem;
          let parentId = currentItem.getAttribute('data-parent-id');

          // Keep going up until we find an item whose parent is root or has no parent
          while (parentId && parentId !== 'root') {
            const parent = document.querySelector(`#storybook-explorer-tree [data-item-id="${parentId}"]`);
            if (!parent) break;
            currentItem = parent;
            parentId = parent.getAttribute('data-parent-id');
          }

          // Now currentItem should be the top-level root item
          if (parentId === 'root' || !parentId) {
            activeRootButton = currentItem.querySelector(':scope > button[aria-expanded]');
          }
        }

        // Target root-level folders - works with both showRoots true and false
        const itemsToCollapse = Array.from(
          document.querySelectorAll(
            '#storybook-explorer-tree [data-nodetype="root"] > button[aria-expanded="true"]'
          )
        ).filter(button => button !== activeRootButton); // Don't collapse the active story's folder

        if (itemsToCollapse.length > 0) {
          itemsToCollapse.forEach(item => item.click());
          setTimeout(collapseItems, 100);
        } else {
          // All collapsed, save preference
          savePreference(false);
        }
      } catch (e) {
        console.error('Error collapsing folders:', e);
      }
    };
    collapseItems();
  }

  // Apply stored preference on load
  function applyStoredPreference() {
    const explorerTree = document.querySelector('#storybook-explorer-tree');
    if (!explorerTree) {
      setTimeout(applyStoredPreference, 100);
      return;
    }

    const shouldExpand = getStoredPreference();

    // Wait a bit for the tree to be fully rendered and current story to be selected
    setTimeout(() => {
      if (shouldExpand) {
        expandAll();
      } else {
        // Collapse roots but preserve the currently active story's folder
        collapseAll();
      }
    }, 500);
  }

  // Add control buttons to the sidebar
  function addSidebarControls() {
    const explorerTree = document.querySelector('#storybook-explorer-tree');
    if (!explorerTree) {
      setTimeout(addSidebarControls, 100);
      return;
    }

    // Check if controls already exist
    if (document.querySelector('.sidebar-toggle-buttons')) {
      return;
    }

    // Find the sidebar container
    const sidebarContainer = explorerTree.parentElement;
    if (!sidebarContainer) {
      return;
    }

    // Create header with buttons
    const header = document.createElement('div');
    header.className = 'sidebar-header';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'sidebar-toggle-buttons';

    const expandBtn = document.createElement('button');
    expandBtn.className = 'sidebar-toggle-btn';
    expandBtn.textContent = '↓ Expand All';
    expandBtn.title = 'Expand all root folders';
    expandBtn.onclick = expandAll;

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'sidebar-toggle-btn';
    collapseBtn.textContent = '→ Collapse All';
    collapseBtn.title = 'Collapse all root folders';
    collapseBtn.onclick = collapseAll;

    buttonContainer.appendChild(expandBtn);
    buttonContainer.appendChild(collapseBtn);
    header.appendChild(buttonContainer);

    // Insert header before the explorer tree
    sidebarContainer.insertBefore(header, explorerTree);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addSidebarControls();
      applyStoredPreference();
    });
  } else {
    addSidebarControls();
    applyStoredPreference();
  }

  // Also try on window load as a fallback
  window.addEventListener('load', () => {
    setTimeout(() => {
      addSidebarControls();
      applyStoredPreference();
    }, 500);
  });

  // Expose functions globally for keyboard shortcuts or console access
  window.storybookExpandAll = expandAll;
  window.storybookCollapseAll = collapseAll;
})();
