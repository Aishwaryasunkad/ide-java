const SelectList = require('atom-select-list')

class ImportSuggestionListView {
  constructor(importSuggestions = []) {
    if (importSuggestions.length === 0)
      throw new Error('Import suggestions list cannot be empty')

    this.importSuggestions = importSuggestions

    let listInitializer = {
      items: importSuggestions,
      elementForItem: (itm, { index }) => {
        const $listItm = document.createElement('li')
        $listItm.innerHTML = itm
        return $listItm
      }
    }

    this._promise = new Promise(resolve => {
      const resWith = (itm = '') => {
        if (itm) resolve(itm)
        this.close()
      }

      listInitializer.didConfirmSelection = itm => resWith(itm)
      listInitializer.didCancelSelection = () => resWith()
      listInitializer.didConfirmEmptySelection = () => resWith()
    })

    this.selectList = new SelectList(listInitializer)

    this.panel = atom.workspace.addModalPanel({ item: this.selectList.element })
    this.selectList.focus()
    this.panel.show()
  }

  waitForConfirmOrCancel() { return this._promise }
  close() { if (this.panel) this.panel.destroy() }
}

module.exports = ImportSuggestionListView
