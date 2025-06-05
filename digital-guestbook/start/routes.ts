/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const GuestsController = () => import('#controllers/guests_controller')

// Redirect root to guests
router.get('/', async ({ response }) => {
  return response.redirect('/guests')
})

// Guest book routes
router.get('/guests', [GuestsController, 'index']).as('guests.index')
router.get('/guests/create', [GuestsController, 'create']).as('guests.create')
router.post('/guests', [GuestsController, 'store']).as('guests.store')
router.get('/guests/:id', [GuestsController, 'show']).as('guests.show')