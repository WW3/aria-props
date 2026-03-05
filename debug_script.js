
        const ariaData = [
            { prop: 'aria-activedescendant', valueType: 'ID reference', isGlobal: false, rolesRequired: [], rolesSupported: ['application', 'composite', 'group', 'textbox'], rolesInherited: ['combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup', 'row', 'searchbox', 'select', 'table', 'tablist', 'toolbar', 'tree', 'treegrid'], rolesProhibited: [] },
            { prop: 'aria-atomic', valueType: 'boolean', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-autocomplete', valueType: 'token', isGlobal: false, rolesRequired: [], rolesSupported: ['combobox', 'textbox'], rolesInherited: ['searchbox'], rolesProhibited: [] },
            { prop: 'aria-braillelabel', valueType: 'string', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-brailleroledescription', valueType: 'string', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-busy', valueType: 'boolean', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-checked', valueType: 'tristate', isGlobal: false, rolesRequired: [], rolesSupported: ['checkbox', 'option', 'radio', 'switch'], rolesInherited: ['menuitemcheckbox', 'menuitemradio', 'treeitem'], rolesProhibited: [] },
            { prop: 'aria-colcount', valueType: 'integer', isGlobal: false, rolesRequired: [], rolesSupported: ['table'], rolesInherited: ['grid', 'treegrid'], rolesProhibited: [] },
            { prop: 'aria-colindex', valueType: 'integer', isGlobal: false, rolesRequired: [], rolesSupported: ['cell', 'row'], rolesInherited: ['columnheader', 'gridcell', 'rowheader'], rolesProhibited: [] },
            { prop: 'aria-colindextext', valueType: 'string', isGlobal: false, rolesRequired: [], rolesSupported: ['cell', 'row'], rolesInherited: ['columnheader', 'gridcell', 'rowheader'], rolesProhibited: [] },
            { prop: 'aria-colspan', valueType: 'integer', isGlobal: false, rolesRequired: [], rolesSupported: ['cell'], rolesInherited: ['columnheader', 'gridcell', 'rowheader'], rolesProhibited: [] },
            { prop: 'aria-controls', valueType: 'ID reference list', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-current', valueType: 'token', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-describedby', valueType: 'ID reference list', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-description', valueType: 'string', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: ['generic'] },
            { prop: 'aria-details', valueType: 'ID reference list', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-disabled', valueType: 'boolean', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-dropeffect', valueType: 'token list', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-errormessage', valueType: 'ID reference', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-expanded', valueType: 'boolean', isGlobal: false, rolesRequired: [], rolesSupported: ['application', 'button', 'checkbox', 'combobox', 'gridcell', 'link', 'listbox', 'menuitem', 'row', 'rowheader', 'tab', 'treeitem'], rolesInherited: ['columnheader', 'menuitemcheckbox', 'menuitemradio', 'switch'], rolesProhibited: [] },
            { prop: 'aria-flowto', valueType: 'ID reference list', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-grabbed', valueType: 'boolean', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-haspopup', valueType: 'token', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-hidden', valueType: 'boolean', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-invalid', valueType: 'token', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-keyshortcuts', valueType: 'string', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-label', valueType: 'string', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: ['generic'] },
            { prop: 'aria-labelledby', valueType: 'ID reference list', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: ['generic'] },
            { prop: 'aria-level', valueType: 'integer', isGlobal: false, rolesRequired: ['heading'], rolesSupported: ['heading', 'listitem', 'row', 'treeitem'], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-live', valueType: 'token', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-modal', valueType: 'boolean', isGlobal: false, rolesRequired: [], rolesSupported: ['window'], rolesInherited: ['dialog', 'alertdialog'], rolesProhibited: [] },
            { prop: 'aria-multiline', valueType: 'boolean', isGlobal: false, rolesRequired: [], rolesSupported: ['textbox'], rolesInherited: ['searchbox'], rolesProhibited: [] },
            { prop: 'aria-multiselectable', valueType: 'boolean', isGlobal: false, rolesRequired: [], rolesSupported: ['grid', 'listbox', 'tablist', 'tree'], rolesInherited: ['treegrid'], rolesProhibited: [] },
            { prop: 'aria-orientation', valueType: 'token', isGlobal: false, rolesRequired: [], rolesSupported: ['scrollbar', 'select', 'separator', 'slider', 'tablist', 'toolbar'], rolesInherited: ['listbox', 'menu', 'menubar', 'radiogroup', 'tree'], rolesProhibited: [] },
            { prop: 'aria-owns', valueType: 'ID reference list', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-placeholder', valueType: 'string', isGlobal: false, rolesRequired: [], rolesSupported: ['textbox'], rolesInherited: ['combobox', 'searchbox'], rolesProhibited: [] },
            { prop: 'aria-posinset', valueType: 'integer', isGlobal: false, rolesRequired: [], rolesSupported: ['article', 'listitem', 'menuitem', 'option', 'radio', 'row', 'tab', 'treeitem'], rolesInherited: ['menuitemcheckbox', 'menuitemradio'], rolesProhibited: [] },
            { prop: 'aria-pressed', valueType: 'tristate', isGlobal: false, rolesRequired: [], rolesSupported: ['button'], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-readonly', valueType: 'boolean', isGlobal: false, rolesRequired: [], rolesSupported: ['checkbox', 'combobox', 'grid', 'gridcell', 'listbox', 'radiogroup', 'slider', 'spinbutton', 'textbox'], rolesInherited: ['columnheader', 'rowheader', 'searchbox', 'switch'], rolesProhibited: [] },
            { prop: 'aria-relevant', valueType: 'token list', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-required', valueType: 'boolean', isGlobal: false, rolesRequired: [], rolesSupported: ['checkbox', 'combobox', 'gridcell', 'listbox', 'radiogroup', 'spinbutton', 'textbox', 'tree'], rolesInherited: ['columnheader', 'rowheader', 'searchbox', 'switch'], rolesProhibited: [] },
            { prop: 'aria-roledescription', valueType: 'string', isGlobal: true, rolesRequired: [], rolesSupported: [], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-rowcount', valueType: 'integer', isGlobal: false, rolesRequired: [], rolesSupported: ['table'], rolesInherited: ['grid', 'treegrid'], rolesProhibited: [] },
            { prop: 'aria-rowindex', valueType: 'integer', isGlobal: false, rolesRequired: [], rolesSupported: ['cell', 'row'], rolesInherited: ['columnheader', 'gridcell', 'listitem', 'option', 'rowheader', 'treeitem'], rolesProhibited: [] },
            { prop: 'aria-rowindextext', valueType: 'string', isGlobal: false, rolesRequired: [], rolesSupported: ['cell', 'row'], rolesInherited: ['columnheader', 'gridcell', 'rowheader', 'treeitem'], rolesProhibited: [] },
            { prop: 'aria-rowspan', valueType: 'integer', isGlobal: false, rolesRequired: [], rolesSupported: ['cell'], rolesInherited: ['columnheader', 'gridcell', 'rowheader'], rolesProhibited: [] },
            { prop: 'aria-selected', valueType: 'boolean', isGlobal: false, rolesRequired: [], rolesSupported: ['gridcell', 'option', 'row', 'tab'], rolesInherited: ['columnheader', 'listitem', 'rowheader', 'treeitem'], rolesProhibited: [] },
            { prop: 'aria-setsize', valueType: 'integer', isGlobal: false, rolesRequired: [], rolesSupported: ['article', 'listitem', 'menuitem', 'option', 'radio', 'row', 'tab', 'treeitem'], rolesInherited: ['menuitemcheckbox', 'menuitemradio'], rolesProhibited: [] },
            { prop: 'aria-sort', valueType: 'token', isGlobal: false, rolesRequired: [], rolesSupported: ['columnheader', 'rowheader'], rolesInherited: [], rolesProhibited: [] },
            { prop: 'aria-valuemax', valueType: 'number', isGlobal: false, rolesRequired: ['scrollbar', 'slider', 'spinbutton'], rolesSupported: ['meter', 'progressbar', 'scrollbar', 'slider', 'spinbutton'], rolesInherited: ['separator'], rolesProhibited: [] },
            { prop: 'aria-valuemin', valueType: 'number', isGlobal: false, rolesRequired: [], rolesSupported: ['meter', 'progressbar', 'scrollbar', 'slider', 'spinbutton'], rolesInherited: ['separator'], rolesProhibited: [] },
            { prop: 'aria-valuenow', valueType: 'number', isGlobal: false, rolesRequired: ['scrollbar', 'slider', 'spinbutton'], rolesSupported: ['meter', 'progressbar', 'scrollbar', 'slider', 'spinbutton'], rolesInherited: ['separator'], rolesProhibited: [] },
            { prop: 'aria-valuetext', valueType: 'string', isGlobal: false, rolesRequired: [], rolesSupported: ['scrollbar', 'slider', 'spinbutton'], rolesInherited: ['meter', 'progressbar', 'separator'], rolesProhibited: [] },
        ];
        const ariaRoles = ['alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form', 'generic', 'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'meter', 'navigation', 'none', 'note', 'option', 'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem', 'window'].sort();
        const propSelect = document.getElementById('aria-prop');
        const typeSelect = document.getElementById('prop-type');
        const roleSelect = document.getElementById('aria-role');
        const form = document.getElementById('aria-query-form');
        const resultsBody = document.getElementById('results-body');
        const resultsSummary = document.getElementById('results-summary');
        const errorMessage = document.getElementById('error-message');
        const liveFeedback = document.getElementById('live-feedback');
        const suggestBtn = document.getElementById('suggest-implementation-btn');
        const modal = document.getElementById('gemini-modal');
        const dialogContentWrapper = document.getElementById('dialog-content-wrapper');
        const resultsContainer = document.getElementById('results-container');
        const resultsTableWrapper = document.getElementById('results-table-wrapper');
        const apiKeyInput = document.getElementById('api-key-input');
        const propHeader = document.getElementById('prop-header');
        const roleHeader = document.getElementById('role-header');
        let currentResults = [];
        let currentSort = { key: null, direction: 'ascending' };
        let lastQuery = {};
        let modalTriggerElement = null;

        document.addEventListener('DOMContentLoaded', () => {
            populatePropSelect();
            populateRoleSelect();
            form.addEventListener('submit', (e) => { e.preventDefault(); handleFormSubmit(); });
            window.addEventListener('hashchange', syncUiAndQueryFromUrl);
            syncUiAndQueryFromUrl();
            suggestBtn.addEventListener('click', (e) => handleSuggestImplementation(e.target));
            modal.addEventListener('close', () => { if (modalTriggerElement) modalTriggerElement.focus(); });
            propHeader.addEventListener('click', () => sortResults('prop'));
            roleHeader.addEventListener('click', () => sortResults('role'));
            const handleKeydownSort = (e, key) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sortResults(key); } };
            propHeader.addEventListener('keydown', (e) => handleKeydownSort(e, 'prop'));
            roleHeader.addEventListener('keydown', (e) => handleKeydownSort(e, 'role'));
        });

        function handleFormSubmit() {
            const selectedProp = propSelect.value;
            const selectedType = typeSelect.value;
            const selectedRole = roleSelect.value;
            const selectionCount = [selectedProp, selectedType, selectedRole].filter(v => v && v !== 'all').length;
            if (selectionCount < 1 && (selectedRole !== 'all' || selectedType === '')) {
                errorMessage.textContent = 'Please select at least one criterion to perform a search.';
                errorMessage.classList.remove('hidden');
                propSelect.setAttribute('aria-describedby', 'error-message');
                propSelect.focus();
                return;
            }
            errorMessage.classList.add('hidden');
            propSelect.removeAttribute('aria-describedby');
            updateUrlFromForm();
        }

        function updateUrlFromForm() {
            const params = new URLSearchParams();
            if (propSelect.value) params.set('prop', propSelect.value);
            if (typeSelect.value) params.set('type', typeSelect.value);
            if (roleSelect.value && roleSelect.value !== 'all') params.set('role', roleSelect.value);
            window.location.hash = params.toString();
        }

        function syncUiAndQueryFromUrl() {
            const params = new URLSearchParams(window.location.hash.substring(1));
            const prop = params.get('prop') || '';
            const type = params.get('type') || '';
            const role = params.get('role') || 'all';
            propSelect.value = prop;
            typeSelect.value = type;
            roleSelect.value = role;
            runQuery(prop, type, role);
        }

        function populatePropSelect() {
            ariaData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.prop;
                option.textContent = item.prop;
                propSelect.appendChild(option);
            });
        }

        function populateRoleSelect() {
            roleSelect.innerHTML = '<option value="all">All Roles</option>';
            ariaRoles.forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                roleSelect.appendChild(option);
            });
        }

        function escapeHTML(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        async function callGemini(prompt, triggerElement) {
            modalTriggerElement = triggerElement;
            const originalButtonText = triggerElement.innerHTML;
            triggerElement.disabled = true;
            triggerElement.innerHTML = `<span class="loader" style="width: 16px; height: 16px; border-width: 2px;"></span> Loading...`;

            const apiKey = apiKeyInput.value || "";

            if (!apiKey) {
                renderModalContent(`<p class="text-red-500 font-semibold">API Key is missing. Please paste your Gemini API key in the input field at the top of the page to use this feature.</p>`);
                modal.showModal();
                triggerElement.disabled = false;
                triggerElement.innerHTML = originalButtonText;
                return;
            }

            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorBody = await response.json();
                    console.error("API Error Response:", errorBody);
                    const errorMsg = errorBody.error?.message || `API Error: ${response.status} ${response.statusText}`;
                    throw new Error(errorMsg);
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    renderModalContent(text);
                    modal.showModal();
                } else {
                    console.warn("Unexpected API response structure:", result);
                    throw new Error("No valid content received from API.");
                }

            } catch (error) {
                console.error("Gemini API call failed:", error);
                renderModalContent(`<p class="text-red-500 font-semibold">Sorry, an error occurred: ${error.message}</p>`);
                modal.showModal();
            } finally {
                triggerElement.disabled = false;
                triggerElement.innerHTML = originalButtonText;
            }
        }

        const STORAGE_KEY_DATA = 'gemini_api_key_enc';
        const STORAGE_KEY_CRYPTO = 'gemini_crypto_key';

        async function getCryptoKey() {
            let keyJson = localStorage.getItem(STORAGE_KEY_CRYPTO);
            if (keyJson) {
                try {
                    const jwk = JSON.parse(keyJson);
                    return await window.crypto.subtle.importKey("jwk", jwk, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
                } catch (e) {
                    console.warn("Failed to import stored key, generating new one.", e);
                }
            }
            const key = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
            const exported = await window.crypto.subtle.exportKey("jwk", key);
            localStorage.setItem(STORAGE_KEY_CRYPTO, JSON.stringify(exported));
            return key;
        }

        async function encryptApiKey(apiKey) {
            try {
                const key = await getCryptoKey();
                const iv = window.crypto.getRandomValues(new Uint8Array(12));
                const encoded = new TextEncoder().encode(apiKey);
                const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoded);
                const data = { iv: Array.from(iv), content: Array.from(new Uint8Array(encrypted)) };
                localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(data));
                console.log("API Key encrypted and saved.");
            } catch (e) {
                console.error("Encryption failed:", e);
            }
        }

        async function decryptApiKey() {
            try {
                const storedData = localStorage.getItem(STORAGE_KEY_DATA);
                if (!storedData) return null;
                const { iv, content } = JSON.parse(storedData);
                const key = await getCryptoKey();
                const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv) }, key, new Uint8Array(content));
                return new TextDecoder().decode(decrypted);
            } catch (e) {
                console.error("Decryption failed:", e);
                return null;
            }
        }

        async function validateApiKey(apiKey) {
            if (!apiKey) return false;
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash?key=${apiKey}`;
            try {
                const response = await fetch(url);
                return response.ok;
            } catch (e) {
                console.error("Validation check failed:", e);
                return false;
            }
        }

        let validationTimeout;
        apiKeyInput.addEventListener('input', (e) => {
            const key = e.target.value.trim();
            apiKeyInput.classList.remove('border-green-500', 'border-red-500', 'bg-green-50', 'bg-red-50');
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(async () => {
                if (key.length === 0) {
                    localStorage.removeItem(STORAGE_KEY_DATA);
                    return;
                }
                apiKeyInput.classList.add('opacity-50');
                const isValid = await validateApiKey(key);
                apiKeyInput.classList.remove('opacity-50');
                if (isValid) {
                    apiKeyInput.classList.add('border-green-500', 'bg-green-50');
                    await encryptApiKey(key);
                } else {
                    apiKeyInput.classList.add('border-red-500', 'bg-red-50');
                }
            }, 800);
        });

        (async () => {
            const savedKey = await decryptApiKey();
            if (savedKey && !apiKeyInput.value) {
                apiKeyInput.value = savedKey;
                apiKeyInput.classList.add('border-green-500', 'bg-green-50');
            }
        })();

        function renderModalContent(text) {
            let finalHtml = '';
            const codeBlockRegex = /```html([\s\S]*?)```/;
            const match = text.match(codeBlockRegex);

            const processMarkdown = (str) => {
                if (!str) return '';
                return str.trim()
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/`([^`]+)`/g, '<code class="bg-gray-200 text-red-600 px-1 rounded">$1</code>')
                    .replace(/\n/g, '<br>');
            };

            if (match) {
                const beforeCode = text.substring(0, match.index);
                const afterCode = text.substring(match.index + match[0].length);
                const rawCode = match[1].trim();
                const escapedCode = escapeHTML(rawCode);

                finalHtml = `
                    <p>${processMarkdown(beforeCode)}</p>
                    <pre><code class="language-html">${escapedCode}</code></pre>
                    <p>${processMarkdown(afterCode)}</p>
                `;
            } else {
                finalHtml = `<p>${processMarkdown(text)}</p>`;
            }

            dialogContentWrapper.innerHTML = `
                <h2 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">AI Assistant</h2>
                <div class="mt-2 px-7 py-3">
                    <div class="modal-content text-sm text-gray-700 text-left">${finalHtml}</div>
                </div>
                <div class="items-center px-4 py-3">
                    <form method="dialog">
                        <button id="close-modal-btn" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600">
                            Close
                        </button>
                    </form>
                </div>
            `;

            hljs.highlightAll();
        }

        function runQuery(selectedProp, selectedType, selectedRole) {
            console.log('runQuery called with:', { selectedProp, selectedType, selectedRole });
            liveFeedback.classList.add('hidden');
            liveFeedback.textContent = '';
            const selectionCount = [selectedProp, selectedType, selectedRole].filter(v => v && v !== 'all').length;
            if (selectionCount < 1 && (selectedRole !== 'all' || selectedType === '')) {
                resultsContainer.classList.add('hidden');
                return;
            }
            lastQuery = { selectedProp, selectedType, selectedRole };
            let filteredData = ariaData;
            if (selectedProp) {
                filteredData = filteredData.filter(item => item.prop === selectedProp);
            }
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
                        if ((selectedType === 'rolesRequired' && roleIsRequired) || (selectedType === 'rolesSupported' && roleIsSupported) || (selectedType === 'rolesInherited' && roleIsInherited) || (selectedType === 'rolesProhibited' && roleIsProhibited)) {
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
            currentResults = results;
            currentSort = { key: null, direction: 'ascending' };
            updateSortHeaders();
            renderResults(currentResults, true);
        }

        function sortResults(key) {
            const triggerElement = document.activeElement;
            if (currentSort.key === key) {
                currentSort.direction = currentSort.direction === 'ascending' ? 'descending' : 'ascending';
            } else {
                currentSort.key = key;
                currentSort.direction = 'ascending';
            }
            currentResults.sort((a, b) => {
                const valA = a[key].toLowerCase();
                const valB = b[key].toLowerCase();
                if (valA < valB) return currentSort.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return currentSort.direction === 'ascending' ? 1 : -1;
                return 0;
            });
            updateSortHeaders();
            renderResults(currentResults, false);
            if (triggerElement) triggerElement.focus();
        }

        function updateSortHeaders() {
            const headers = [propHeader, roleHeader];
            headers.forEach(header => {
                const key = header.id === 'prop-header' ? 'prop' : 'role';
                const sortNone = header.querySelector('.sort-none');
                const sortAsc = header.querySelector('.sort-asc');
                const sortDesc = header.querySelector('.sort-desc');
                sortNone.classList.add('hidden');
                sortAsc.classList.add('hidden');
                sortDesc.classList.add('hidden');
                if (key === currentSort.key) {
                    header.setAttribute('aria-sort', currentSort.direction);
                    if (currentSort.direction === 'ascending') {
                        sortAsc.classList.remove('hidden');
                    } else {
                        sortDesc.classList.remove('hidden');
                    }
                } else {
                    header.setAttribute('aria-sort', 'none');
                    sortNone.classList.remove('hidden');
                }
            });
        }

        function getRelationship(item) {
            if (item.roleIsRequired) return 'required';
            if (item.roleIsSupported) return 'supported';
            if (item.roleIsInherited) return 'inherited';
            if (item.roleIsProhibited) return 'prohibited';
            function handleExplainClick(item, triggerElement) {
                const relationship = getRelationship(item);
                const prompt = `As a web accessibility expert, explain concisely why the WAI-ARIA property "${item.prop}" is **${relationship}** on the "${item.role}" role. Focus on the practical reason a web developer should know this.`;
                callGemini(prompt, triggerElement);
            }

            function handleSuggestImplementation(triggerElement) {
                const { selectedProp, selectedRole } = lastQuery;
                if (!selectedProp || !selectedRole || selectedRole === 'all') {
                    modalTriggerElement = triggerElement;
                    renderModalContent("<p>Please select a specific Property and a specific Role in your query to get an HTML suggestion.</p>");
                    modal.showModal();
                    return;
                }
                const prompt = `Provide a simple, best-practice HTML code snippet demonstrating the use of the WAI-ARIA attribute "${selectedProp}" on an element with the role "${selectedRole}". Include a brief explanation of the code's accessibility purpose. Format the code block using HTML markdown.`;
                callGemini(prompt, triggerElement);
            }

            function renderResults(results, shouldFocusContainer = true) {
                resultsBody.innerHTML = '';

                if (results.length === 0) {
                    resultsContainer.classList.add('hidden');
                    liveFeedback.classList.remove('hidden');
                    // Use setTimeout to ensure screen readers announce the change every time
                    liveFeedback.textContent = '';
                    setTimeout(() => {
                        liveFeedback.textContent = 'No matches found.';
                    }, 1);
                    return;
                }

                resultsContainer.classList.remove('hidden');
                resultsTableWrapper.classList.remove('hidden');
                resultsSummary.textContent = `Displaying ${results.length} result(s).`;
                if (lastQuery.selectedProp && lastQuery.selectedRole && lastQuery.selectedRole !== 'all') {
                    suggestBtn.classList.remove('hidden');
                } else {
                    suggestBtn.classList.add('hidden');
                }

                results.forEach(item => {
                    const row = document.createElement('tr');
                    row.className = 'hover:bg-gray-50 transition-colors duration-150';

                    const createBoolCell = (value) => {
                        const cell = document.createElement('td');
                        cell.className = 'px-6 py-4 whitespace-nowrap text-center';

                        const trueIcon = `<svg class="w-6 h-6 text-green-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="True"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
                        const falseIcon = `<svg class="w-6 h-6 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="False"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;

                        cell.innerHTML = value ? trueIcon : falseIcon;
                        return cell;
                    };

                    const propUrl = `https://www.w3.org/TR/wai-aria-1.3/#${item.prop}`;
                    const roleUrl = `https://www.w3.org/TR/wai-aria-1.3/#${item.role}`;

                    row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-800">
                        <a href="${propUrl}" target="_blank" rel="noopener noreferrer" class="underline text-blue-600 hover:text-blue-800">
                            ${item.prop}
                            <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="opens in a new tab">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 0 00-2 2v10a2 0 002 2h10a2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                        </a>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        <a href="${roleUrl}" target="_blank" rel="noopener noreferrer" class="underline text-blue-600 hover:text-blue-800">
                            ${item.role}
                            <svg class="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="opens in a new tab">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 0 00-2 2v10a2 0 002 2h10a2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                            </svg>
                        </a>
                    </td>
                `;

                    row.appendChild(createBoolCell(item.roleIsRequired));
                    row.appendChild(createBoolCell(item.roleIsSupported));
                    row.appendChild(createBoolCell(item.roleIsInherited));
                    row.appendChild(createBoolCell(item.roleIsProhibited));

                    const explainCell = document.createElement('td');
                    explainCell.className = 'px-6 py-4 whitespace-nowrap text-center';
                    const explainButton = document.createElement('button');
                    explainButton.type = 'button';
                    explainButton.setAttribute('aria-haspopup', 'dialog');
                    explainButton.innerHTML = `<span aria-hidden="true">✨</span>&nbsp;Explain`;
                    explainButton.className = 'bg-gray-200 text-gray-800 text-xs font-bold py-1 px-3 rounded-full hover:bg-gray-300 transition';
                    explainButton.onclick = (e) => handleExplainClick(item, e.target);
                    explainCell.appendChild(explainButton);
                    row.appendChild(explainCell);

                    resultsBody.appendChild(row);
                });

                if (shouldFocusContainer) {
                    resultsContainer.focus();
                }
            }
    
