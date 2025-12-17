/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2527524235")

  // update collection data
  unmarshal({
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2527524235")

  // update collection data
  unmarshal({
    "viewRule": "@request.auth.id != \"\" && (user = @request.auth.id || @request.auth.role = \"admin\")"
  }, collection)

  return app.save(collection)
})
