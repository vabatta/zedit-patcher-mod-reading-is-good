/* global info, xelib, registerPatcher, patcherUrl */

registerPatcher({
  info: info,
  gameModes: [ xelib.gmSSE, xelib.gmTES5 ],
  settings: {
    label: info.name,
    hide: false,
    templateUrl: `${patcherUrl}/partials/settings.html`,
    defaultSettings: {
      title: info.name,
      patchFileName: 'zPatch.esp'
    }
  },
  requiredFiles: [ 'Reading Is Good 2.esp' ],
  getFilesToPatch: filenames => {
    return filenames
  },
  execute: (patchFile, helpers, settings, locals) => ({
    initialize: () => {
      // initialize
      // measure the execution time
      locals.start = new Date()
      // get the base mod file
      const ris = xelib.FileByName('Reading Is Good 2.esp')
      // locally save the lists
      locals.lists = []
      locals.lists[0] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_OneHanded'), patchFile, false) // sSBList1HD
      locals.lists[1] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_TwoHanded'), patchFile, false) // sSBList2HD
      locals.lists[2] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Marksman'), patchFile, false) // sSBListARC
      locals.lists[3] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Block'), patchFile, false) // sSBListBLO
      locals.lists[4] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Smithing'), patchFile, false) // sSBListSMI
      locals.lists[5] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_HeavyArmor'), patchFile, false) // sSBListHVA
      locals.lists[6] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_LightArmor'), patchFile, false) // sSBListLTA
      locals.lists[7] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Pickpocket'), patchFile, false) // sSBListPIC
      locals.lists[8] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Lockpicking'), patchFile, false) // sSBListLOC
      locals.lists[9] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Sneak'), patchFile, false) // sSBListSNK
      locals.lists[10] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Alchemy'), patchFile, false) // sSBListALC
      locals.lists[11] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Speechcraft'), patchFile, false) // sSBListSPE
      locals.lists[12] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Alteration'), patchFile, false) // sSBListALT
      locals.lists[13] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Conjuration'), patchFile, false) // sSBListCON
      locals.lists[14] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Destruction'), patchFile, false) // sSBListDES
      locals.lists[15] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Illusion'), patchFile, false) // sSBListILU
      locals.lists[16] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Restoration'), patchFile, false) // sSBListRES
      locals.lists[17] = xelib.CopyElement(xelib.GetElement(ris, '_RIG_SkillBookList_Enchanting'), patchFile, false) // sSBListENC
    },
    process: [{
      load: {
        signature: 'BOOK',
        filter: record => {
          // Returns true if it's a winning override and is a skill book
          return xelib.GetEnabledFlags(record, 'DATA - Data\\Flags').includes('Teaches Skill') && xelib.IsWinningOverride(record)
        }
      },
      patch: record => {
        // get the skill related to the book
        let skillId = xelib.GetIntValue(record, 'DATA\\Skill') - 6

        // check if the skill is valid
        if (skillId >= 0 && skillId <= 17) {
          // add the form id to the list
          xelib.AddFormID(locals.lists[skillId], xelib.GetHexFormID(record))
          // patch the skill to none
          xelib.SetIntValue(record, 'DATA\\Skill', -1)
          // log report
          // helpers.logMessage(`${xelib.EditorId(record)}: Patched (skill ID ${skillId})`)
        }
      }
    }],
    finalize: () => {
      // log the execution time
      locals.time = new Date() - locals.start
      helpers.logMessage(`Took ${locals.time / 1000} seconds`)
    }
  })
})
