export const extension = {
    id: 'li8-builtin-weatherapi',
    name: 'Weather API',
    description: 'Provides a simple node to fetch current weather data from WeatherAPI.com.',
    version: '1.0.2',
    author: 'li8',
    category: 'Data & APIs',
    repository: 'https://github.com/workingprototype/li8-extension-weatherapi.git',
    credentials: [
        {
            name: 'weatherApiToken',
            displayName: 'WeatherAPI.com Key',
            properties: {
                encryptedFields: ['apiKey'],
            },
            fields: [
                { 
                    key: 'apiKey', 
                    label: 'API Key', 
                    type: 'password', 
                    required: true,
                    help: 'Sign up for a free key at WeatherAPI.com'
                }
            ]
        }
    ],
    nodes: [
        {
            type: 'action',
            name: 'Weather API',
            icon: 'fa-solid fa-cloud-sun',
            color: 'icon-purple',
            defaultSubtitle: 'Get weather data for a city',
            nodeTypeClass: 'weather-api-node',
            extension: true,
            config: {
                credentialId: null,
                city: 'London',
                jsonPaths: ['current.temp_c', 'location.name', 'current.condition.text'] 
            },
            configFields: [
                { key: 'credentialId', label: 'Weather API Key', type: 'credential', credentialType: 'weatherApiToken' },
                { key: 'city', label: 'City', type: 'text', placeholder: 'e.g., San Francisco' },
                { 
                    key: 'jsonPaths', 
                    label: 'Data to Extract', 
                    type: 'dynamic-checklist',
                    testButton: true, // This UI property now relies on the `test` property below
                    defaultPaths: [
                        { path: 'location.name', label: 'Location Name' },
                        { path: 'current.temp_c', label: 'Current Temperature (°C)' },
                        { path: 'current.condition.text', label: 'Weather Condition' }
                    ]
                }
            ],
            
            // --- MAIN WORKFLOW for actual execution ---
            workflow: {
                nodes: [
                    {
                        id: 1,
                        type: 'action',
                        title: 'HTTP Request to WeatherAPI',
                        nodeTypeClass: 'http-request-node',
                        config: {
                            url: 'https://api.weatherapi.com/v1/current.json',
                            url_data: { 
                                "q": "{{_parent.city}}", 
                                "key": "{{_parent.apiKey}}" 
                            },
                            method: 'GET',
                            headers: {},
                            body: {},
                            timeout: 10000
                        }
                    }
                ]
            },
            
            // TEST WORKFLOW for the "Test & Fetch Fields" button ---
            test: {
                workflow: {
                    nodes: [
                        {
                            id: 1,
                            type: 'action',
                            title: 'HTTP Test Request to WeatherAPI',
                            nodeTypeClass: 'http-request-node',
                            config: {
                                url: 'https://api.weatherapi.com/v1/current.json',
                                url_data: { 
                                    // Use a hardcoded city for the test run, ignoring user input.
                                    "q": "Tokyo", 
                                    "key": "{{_parent.apiKey}}" // Still need the API key from the user's config.
                                },
                                method: 'GET'
                            }
                        }
                    ]
                }
            },

            mapOutputs: {
                data: '{{_extension.responseBody}}'
            }
        }
    ]
};