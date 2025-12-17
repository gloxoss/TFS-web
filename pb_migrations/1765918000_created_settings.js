/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const collection = new Collection({
        "id": "pbc_settings00000",
        "created": "2025-12-16 21:00:00.000Z",
        "updated": "2025-12-16 21:00:00.000Z",
        "name": "settings",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "company_name",
                "name": "company_name",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "contact_email",
                "name": "contact_email",
                "type": "email",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "exceptDomains": null,
                    "onlyDomains": null
                }
            },
            {
                "system": false,
                "id": "company_phone",
                "name": "company_phone",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "company_address",
                "name": "company_address",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "email_notifications",
                "name": "email_notifications",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "new_quote_alert",
                "name": "new_quote_alert",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "quote_status_alert",
                "name": "quote_status_alert",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "show_prices",
                "name": "show_prices",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "maintenance_mode",
                "name": "maintenance_mode",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "default_language",
                "name": "default_language",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "system": false,
                "id": "currency",
                "name": "currency",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            }
        ],
        "indexes": [],
        "listRule": "",
        "viewRule": "",
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "options": {}
    });

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("pbc_settings00000");

    return app.delete(collection);
})
