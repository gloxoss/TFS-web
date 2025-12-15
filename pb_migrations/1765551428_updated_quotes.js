/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1234567890")

  // update field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "bool3208210267",
    "name": "pdf_generated",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1234567890")

  // update field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "bool3208210267",
    "name": "pdf_generated",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
