
const ariaData = [
    { prop: 'aria-required', valueType: 'boolean', isGlobal: false, rolesRequired: [], rolesSupported: ['checkbox', 'combobox', 'gridcell', 'listbox', 'radiogroup', 'spinbutton', 'textbox', 'tree'], rolesInherited: ['columnheader', 'rowheader', 'searchbox', 'switch'], rolesProhibited: [] },
];

const ariaRoles = ['alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form', 'generic', 'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'meter', 'navigation', 'none', 'note', 'option', 'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem', 'window'].sort();

function runQuery(selectedProp, selectedType, selectedRole) {
    console.log(`Running query: Prop=${selectedProp}, Type=${selectedType}, Role=${selectedRole}`);

    let filteredData = ariaData;
    if (selectedProp) {
        filteredData = filteredData.filter(item => item.prop === selectedProp);
    }
    console.log(`Filtered data length: ${filteredData.length}`);

    let results = [];
    const rolesToSearch = selectedRole !== 'all' ? [selectedRole] : ariaRoles;

    filteredData.forEach(propData => {
        rolesToSearch.forEach(role => {
            const roleIsRequired = propData.rolesRequired.includes(role);
            const roleIsSupported = propData.rolesSupported.includes(role) || propData.rolesSupported.includes('All roles');
            const roleIsInherited = propData.rolesInherited.includes(role);
            const roleIsProhibited = propData.rolesProhibited.includes(role);

            let shouldInclude = false;
            if (selectedType) {
                if ((selectedType === 'rolesRequired' && roleIsRequired) ||
                    (selectedType === 'rolesSupported' && roleIsSupported) ||
                    (selectedType === 'rolesInherited' && roleIsInherited) ||
                    (selectedType === 'rolesProhibited' && roleIsProhibited)) {
                    shouldInclude = true;
                }
            } else {
                if (roleIsRequired || roleIsSupported || roleIsInherited || roleIsProhibited) {
                    shouldInclude = true;
                }
            }
            if (shouldInclude) {
                results.push({ prop: propData.prop, role, roleIsRequired, roleIsSupported, roleIsInherited, roleIsProhibited });
            }
        });
    });

    console.log(`Results found: ${results.length}`);
    results.forEach(r => console.log(`- ${r.prop} on ${r.role} (Sup: ${r.roleIsSupported}, Inh: ${r.roleIsInherited})`));

    // Debugging intersection
    const supported = ariaData[0].rolesSupported;
    const missing = supported.filter(r => !ariaRoles.includes(r));
    console.log('Supported roles missing from ariaRoles:', missing);
}

runQuery('aria-required', '', 'all');
