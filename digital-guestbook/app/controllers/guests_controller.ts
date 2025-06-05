import type { HttpContext } from '@adonisjs/core/http'
import Guest from '#models/guest'

export default class GuestsController {
  // Display the list of guests (Buku Tamu)
  public async index({ view }: HttpContext) {
    // Fetch all guests from the database, ordered by latest first
    const guests = await Guest.query().orderBy('created_at', 'desc')

    // Render the guests/index view and pass the guests data
    return view.render('guests/index', { guests })
  }

  // Show the form to create a new guest entry
  public async create({ view }: HttpContext) {
    // Render the guests/create view
    return view.render('guests/create')
  }

  // Store a new guest entry
  public async store({ request, response, session }: HttpContext) {
    const name = request.input('name')
    const email = request.input('email')
    const phone = request.input('phone')
    const message = request.input('message')
    const rating = request.input('rating')

    // Validate inputs
    if (!name || !email || !message) {
      session.flash('error', 'Nama, email, dan pesan wajib diisi!')
      return response.redirect('back')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      session.flash('error', 'Format email tidak valid!')
      return response.redirect('back')
    }

    try {
      // Create a new guest entry
      const guest = await Guest.create({ 
        name, 
        email, 
        phone, 
        message, 
        rating: rating || '5' 
      })

      // Flash success message
      session.flash('success', `Terima kasih ${name}! Pesan Anda telah berhasil disimpan dalam buku tamu digital kami. 🎉`)

      // Redirect to the guests list
      return response.redirect('/guests')
    } catch (error) {
      session.flash('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi!')
      return response.redirect('back')
    }
  }

  // Show individual guest details
  public async show({ params, view, response }: HttpContext) {
    const guestId = params.id

    // Fetch the guest by ID
    const guest = await Guest.find(guestId)
  
    // If the guest doesn't exist, return a 404 response
    if (!guest) {
      return response.status(404).send('Data tamu tidak ditemukan')
    }
  
    // Render the guest details view
    return view.render('guests/show', { guest })
  }
}